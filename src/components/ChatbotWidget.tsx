'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, MessageCircle, Send, X } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { normalizeAppLanguage } from '@/lib/language';

type Language = 'en' | 'bn';
type Role = 'user' | 'bot';

type ChatMessage = {
  id: number;
  role: Role;
  content: string;
};

const uiText = {
  en: {
    title: 'Farm Assistant',
    subtitle: 'English / Bengali',
    placeholder: 'Ask about crop, market, finance...',
    send: 'Send',
    open: 'Open assistant',
    quickLabel: 'Quick help',
    quickReplies: ['Crop disease', 'Market price', 'Loan support', 'Weather tips'],
    welcome: 'Hello! I can help with crop advice, market info, finance basics, and weather tips. How can I help today?',
  },
  bn: {
    title: 'ফার্ম সহায়ক',
    subtitle: 'ইংরেজি / বাংলা',
    placeholder: 'ফসল, বাজার, ঋণ বা আবহাওয়া নিয়ে প্রশ্ন করুন...',
    send: 'পাঠান',
    open: 'সহায়ক খুলুন',
    quickLabel: 'দ্রুত সহায়তা',
    quickReplies: ['রোগ শনাক্ত', 'বাজার দর', 'ঋণ সহায়তা', 'আবহাওয়া টিপস'],
    welcome: 'হ্যালো! আমি ফসল পরামর্শ, বাজার তথ্য, ঋণের প্রাথমিক তথ্য এবং আবহাওয়া টিপস দিতে পারি। কী জানতে চান?',
  },
};

export function ChatbotWidget() {
  const pathname = usePathname();
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, role: 'bot', content: uiText.en.welcome },
  ]);

  const hiddenPaths = useMemo(() => new Set(['/', '/login']), []);
  const shouldHideChatbot = hiddenPaths.has(pathname) || pathname.startsWith('/buyer');

  const normalizedLanguage = normalizeAppLanguage(language);
  const uiLanguage: Language = normalizedLanguage === 'bn' ? 'bn' : 'en';
  const text = uiText[uiLanguage];

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 0) {
        return [{ id: Date.now(), role: 'bot', content: uiText[uiLanguage].welcome }];
      }

      const last = prev[prev.length - 1];
      if (last.role === 'bot' && last.content === uiText[uiLanguage].welcome) {
        return prev;
      }

      return [...prev, { id: Date.now(), role: 'bot', content: uiText[uiLanguage].welcome }];
    });
  }, [uiLanguage]);

  const submitMessage = async (message?: string) => {
    const value = (message ?? input).trim();
    if (!value || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: value,
    };

    const historyForRequest = [...messages, userMsg].slice(-7).map((msg) => ({
      role: msg.role === 'bot' ? 'assistant' : 'user',
      content: msg.content,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: value,
          language: normalizedLanguage,
          history: historyForRequest,
        }),
      });

      if (!response.ok) {
        throw new Error('Chat request failed');
      }

      const payload = (await response.json()) as { reply?: string };
      const reply = payload.reply?.trim();

      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'bot',
        content: reply || (uiLanguage === 'bn'
          ? 'দুঃখিত, এখন উত্তর পাওয়া যাচ্ছে না। অনুগ্রহ করে আবার চেষ্টা করুন।'
          : 'Sorry, I could not generate a response right now. Please try again.'),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'bot',
        content: uiLanguage === 'bn'
          ? 'এই মুহূর্তে সার্ভারের সাথে সংযোগ করা যাচ্ছে না। পরে আবার চেষ্টা করুন।'
          : 'I am unable to connect to the AI server at the moment. Please try again shortly.',
      };

      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submitMessage();
  };

  const handleLanguageChange = (next: Language) => {
    setLanguage(next);
  };

  if (shouldHideChatbot) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3">
      {isOpen && (
        <section className="w-[min(92vw,380px)] rounded-2xl border border-border bg-card shadow-2xl">
          <header className="flex items-center justify-between rounded-t-2xl border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <div>
              <h2 className="text-sm font-semibold">{text.title}</h2>
              <p className="text-xs opacity-90">{text.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 transition hover:bg-white/15"
              aria-label="Close chatbot"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                uiLanguage === 'en' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('bn')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                uiLanguage === 'bn' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
              }`}
            >
              বাংলা
            </button>
          </div>

          <div className="h-72 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'ml-auto bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                {msg.content}
              </div>
            ))}
          </div>

          <div className="border-t border-border px-3 pb-3 pt-2">
            <p className="mb-2 text-xs text-muted-foreground">{text.quickLabel}</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {text.quickReplies.map((reply) => (
                <button
                  key={reply}
                  type="button"
                  onClick={() => { void submitMessage(reply); }}
                  disabled={isSubmitting}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-foreground transition hover:bg-secondary"
                >
                  {reply}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-10 flex-1 rounded-xl border border-input bg-background px-3 text-sm outline-none ring-primary/30 transition focus:ring-2"
                placeholder={text.placeholder}
                disabled={isSubmitting}
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10 items-center gap-1 rounded-xl bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:opacity-90"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">{isSubmitting ? '...' : text.send}</span>
              </button>
            </form>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="inline-flex h-14 items-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-xl transition hover:scale-[1.02]"
        aria-label={text.open}
      >
        {isOpen ? <Bot className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span>{isOpen ? text.title : 'Chat'}</span>
      </button>
    </div>
  );
}
