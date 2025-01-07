import WebApp from '@twa-dev/sdk';
import { supabase } from "@/integrations/supabase/client";

interface TelegramTheme {
  text_color?: string;
  button_color?: string;
  button_text_color?: string;
}

export class TelegramService {
  private static instance: TelegramService;
  private botToken: string | null = null;

  private constructor() {
    // Initialize Telegram WebApp
    if (WebApp) {
      console.log("Initializing Telegram WebApp");
      WebApp.ready();
    }
  }

  public static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  public async getBotToken(): Promise<string | null> {
    try {
      const { data, error } = await supabase.functions.invoke('increment_participation_count');
      if (error) {
        console.error('Error getting bot token:', error);
        return null;
      }
      this.botToken = data?.token || null;
      return this.botToken;
    } catch (error) {
      console.error('Error getting bot token:', error);
      return null;
    }
  }

  public async sendMessage(chatId: number, text: string): Promise<boolean> {
    if (!this.botToken) {
      await this.getBotToken();
    }

    if (!this.botToken) {
      console.error('Bot token not available');
      return false;
    }

    try {
      const response = await fetch(`https://api.telegram.org/bot${this.botToken}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: 'HTML',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.ok;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  }

  public getThemeParams(): TelegramTheme {
    if (!WebApp) {
      return {};
    }

    return {
      text_color: WebApp.themeParams?.text_color || '#000000',
      button_color: WebApp.themeParams?.button_color || '#2481cc',
      button_text_color: WebApp.themeParams?.button_text_color || '#ffffff'
    };
  }

  public isInTelegramApp(): boolean {
    return !!WebApp;
  }

  public getTelegramUser() {
    if (!WebApp) return null;
    return WebApp.initDataUnsafe?.user || null;
  }
}

export const telegramService = TelegramService.getInstance();