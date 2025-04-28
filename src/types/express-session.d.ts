import { SessionData } from 'express-session';
import userAttributes from '../models/userAttributes';

declare module 'express-session' {
  interface SessionData {
    user?: userAttributes;
  }
}