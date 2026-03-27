export function normalizeIndianPhone(phoneInput: string): string | null {
  const trimmed = phoneInput.trim();
  if (!trimmed) {
    return null;
  }

  const digits = trimmed.replace(/[^\d+]/g, '');

  if (digits.startsWith('+')) {
    const onlyDigits = `+${digits.slice(1).replace(/\D/g, '')}`;
    return onlyDigits.length >= 11 && onlyDigits.length <= 16 ? onlyDigits : null;
  }

  const plain = digits.replace(/\D/g, '');
  if (plain.length === 10) {
    return `+91${plain}`;
  }
  if (plain.length === 12 && plain.startsWith('91')) {
    return `+${plain}`;
  }

  return null;
}

export function generatePrivateLoginKey(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function buildPrivateKeyMessage(key: string): string {
  return `TerraForge private login key: ${key}. Valid for 10 minutes. Do not share this code.`;
}
