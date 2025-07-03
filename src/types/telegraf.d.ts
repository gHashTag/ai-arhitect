import { Context } from 'telegraf';

declare module 'telegraf' {
  interface Context {
    session?: {
      language: 'lt' | 'ru' | 'en';
    };
  }
}
