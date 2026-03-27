import { AlertCategory, SmsSubscription } from '@/lib/sms/types';

type LoginKeyRecord = {
  key: string;
  expiresAt: number;
  attempts: number;
};

const loginKeyStore = new Map<string, LoginKeyRecord>();
const sentAtStore = new Map<string, number>();
const subscriptionStore = new Map<string, SmsSubscription>();

export function getLoginKeyRecord(phoneNumber: string): LoginKeyRecord | undefined {
  return loginKeyStore.get(phoneNumber);
}

export function setLoginKeyRecord(phoneNumber: string, record: LoginKeyRecord): void {
  loginKeyStore.set(phoneNumber, record);
}

export function deleteLoginKeyRecord(phoneNumber: string): void {
  loginKeyStore.delete(phoneNumber);
}

export function getLastSentAt(phoneNumber: string): number {
  return sentAtStore.get(phoneNumber) ?? 0;
}

export function setLastSentAt(phoneNumber: string, value: number): void {
  sentAtStore.set(phoneNumber, value);
}

export function saveSmsSubscription(subscription: SmsSubscription): void {
  subscriptionStore.set(subscription.phoneNumber, subscription);
}

export function getSmsSubscription(phoneNumber: string): SmsSubscription | undefined {
  return subscriptionStore.get(phoneNumber);
}

export function listSmsSubscriptions(category: AlertCategory): SmsSubscription[] {
  return Array.from(subscriptionStore.values()).filter(
    (item) => item.alertsEnabled && item.categories.includes(category)
  );
}
