#!/usr/bin/env python3
"""
Palm Oil Cultivation Chatbot (Mistral7B + Ollama)

What this script does:
1. Loads local palm oil knowledge from JSON.
2. Builds simple text chunks for retrieval.
3. Ranks chunks by keyword overlap with user question.
4. Sends grounded prompt to Mistral 7B via Ollama.
5. Runs an interactive CLI chatbot loop.

Run:
  python scripts/palm_oil_mistral_chatbot.py

Optional env vars:
  OLLAMA_API_URL=http://localhost:11434/api/generate
  MISTRAL_MODEL=mistral:7b-instruct
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.error
import urllib.request
from dataclasses import dataclass
from pathlib import Path
from typing import List

OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434/api/generate")
MISTRAL_MODEL = os.getenv("MISTRAL_MODEL", "mistral:7b-instruct")
KNOWLEDGE_PATH = Path(__file__).resolve().parents[1] / "src" / "data" / "palm-oil-cultivation.json"


@dataclass
class Chunk:
    topic: str
    text: str


def load_knowledge() -> List[Chunk]:
    if not KNOWLEDGE_PATH.exists():
        raise FileNotFoundError(f"Knowledge file not found: {KNOWLEDGE_PATH}")

    with KNOWLEDGE_PATH.open("r", encoding="utf-8") as f:
        payload = json.load(f)

    chunks: List[Chunk] = []
    for item in payload.get("palmCultivationKnowledge", []):
        topic = str(item.get("topic", "General"))
        points = item.get("points", [])
        if not isinstance(points, list):
            continue
        merged = " ".join(str(point).strip() for point in points if str(point).strip())
        if merged:
            chunks.append(Chunk(topic=topic, text=merged))

    if not chunks:
        raise ValueError("No valid knowledge chunks found in JSON.")

    return chunks


def tokenize(text: str) -> List[str]:
    return re.findall(r"[a-zA-Z0-9]+", text.lower())


def retrieve_context(question: str, chunks: List[Chunk], k: int = 4) -> List[Chunk]:
    q_tokens = set(tokenize(question))
    if not q_tokens:
        return chunks[:k]

    scored = []
    for chunk in chunks:
        c_tokens = set(tokenize(chunk.text + " " + chunk.topic))
        overlap = len(q_tokens.intersection(c_tokens))
        scored.append((overlap, chunk))

    scored.sort(key=lambda item: item[0], reverse=True)
    top = [chunk for score, chunk in scored if score > 0][:k]
    return top if top else chunks[:k]


def call_mistral(prompt: str) -> str:
    body = {
        "model": MISTRAL_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.3,
            "top_p": 0.9,
        },
    }

    data = json.dumps(body).encode("utf-8")
    req = urllib.request.Request(
        OLLAMA_API_URL,
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as response:
            payload = json.loads(response.read().decode("utf-8"))
            text = str(payload.get("response", "")).strip()
            if not text:
                return "Model returned an empty response."
            return text
    except urllib.error.URLError as exc:
        return f"Could not reach Ollama/Mistral endpoint: {exc}"
    except Exception as exc:  # noqa: BLE001
        return f"Unexpected model error: {exc}"


def build_prompt(question: str, context_chunks: List[Chunk]) -> str:
    context_text = "\n\n".join(
        f"Topic: {chunk.topic}\nDetails: {chunk.text}" for chunk in context_chunks
    )

    return (
        "You are an agronomy assistant specialized in oil palm cultivation.\n"
        "Answer clearly with practical steps.\n"
        "If the user asks about dose or chemical treatment, add a local agronomist validation caution.\n"
        "Use only the provided context plus safe agronomy reasoning.\n\n"
        f"Knowledge Context:\n{context_text}\n\n"
        f"User Question: {question}\n"
    )


def interactive_chat() -> None:
    print("Palm Oil Cultivation Chatbot (Mistral7B)")
    print(f"Model: {MISTRAL_MODEL}")
    print("Type 'exit' to quit.\n")

    chunks = load_knowledge()

    while True:
        question = input("You: ").strip()
        if question.lower() in {"exit", "quit"}:
            print("Assistant: Goodbye.")
            break

        if not question:
            continue

        context = retrieve_context(question, chunks)
        prompt = build_prompt(question, context)
        answer = call_mistral(prompt)
        print(f"Assistant: {answer}\n")


def main() -> int:
    try:
        interactive_chat()
        return 0
    except KeyboardInterrupt:
        print("\nAssistant: Session ended.")
        return 0
    except Exception as exc:  # noqa: BLE001
        print(f"Fatal error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
