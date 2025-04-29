import { Session } from 'express-session';
import userAttributes from '../models/userAttributes';

// Déclare un module pour étendre l'interface Session d'Express
declare module 'express-session' {
  interface Session {
    user: userAttributes;
  }
}