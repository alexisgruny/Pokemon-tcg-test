import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      email: string;
      password?: string | null;
      friendCode: string | null;
      inGameName: string | null;
      googleId?: string;
      provider?: 'google' | 'local';
      createdAt?: Date;
      updatedAt?: Date;
    };
  }
}