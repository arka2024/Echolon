export type AlertCategory = 'weather' | 'government';

export type SmsSubscription = {
  phoneNumber: string;
  name?: string;
  preferredLanguage?: string;
  alertsEnabled: boolean;
  categories: AlertCategory[];
};
