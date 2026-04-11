// Authentication Messages
export const AUTH_MESSAGES = {
  INVALID_CREDENTIALS: 'Identifiants invalides.',
  EMAIL_ALREADY_EXISTS: 'Cet email est déjà utilisé.',
  USERNAME_ALREADY_EXISTS: 'Ce nom d\'utilisateur est déjà utilisé.',
  REGISTRATION_SUCCESS: 'Inscription réussie. Veuillez vous connecter.',
  LOGIN_SUCCESS: 'Connexion réussie.',
  LOGOUT_SUCCESS: 'Déconnexion réussie.',
  UNAUTHORIZED: 'Non autorisé. Connectez-vous.',
  TOKEN_EXPIRED: 'Token invalide ou expiré.',
  INVALID_PASSWORD: 'Mot de passe invalide.',
  PASSWORD_TOO_WEAK: 'Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.',
  INCOMPLETE_GOOGLE_DATA: 'Informations Google incomplètes.',
  INVALID_GOOGLE_TOKEN: 'Token Google invalide.',
} as const;

// Card Messages
export const CARD_MESSAGES = {
  NOT_FOUND: 'Carte non trouvée.',
  ADDED_SUCCESS: 'Carte ajoutée à votre collection.',
  UPDATED_SUCCESS: 'Carte mise à jour.',
  REMOVED_SUCCESS: 'Carte supprimée de votre collection.',
  FETCH_ERROR: 'Erreur lors de la récupération des cartes.',
  INVALID_DATA: 'Données de carte invalides.',
  FETCH_DETAILS_ERROR: 'Erreur lors de la récupération des détails de la carte.',
} as const;

// User Messages
export const USER_MESSAGES = {
  NOT_FOUND: 'Utilisateur non trouvé.',
  PROFILE_FETCH_ERROR: 'Erreur lors de la récupération du profil utilisateur.',
  SEARCH_ERROR: 'Erreur lors de la recherche des utilisateurs.',
  INVALID_SEARCH_PARAM: 'Paramètre de recherche invalide.',
  ACCOUNT_DELETED: 'Compte supprimé avec succès.',
  DELETE_ERROR: 'Erreur lors de la suppression du compte.',
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELDS: 'Tous les champs obligatoires doivent être remplis.',
  INVALID_EMAIL: 'Veuillez entrer une adresse email valide.',
  INVALID_USERNAME: 'Le nom d\'utilisateur doit contenir entre 3 et 20 caractères (lettres, chiffres, underscores).',
  INVALID_PASSWORD_LENGTH: 'Le mot de passe doit contenir au moins 8 caractères.',
  INVALID_FRIEND_CODE: 'Le code ami doit être au format: XXXX-XXXX-XXXX',
  INVALID_GAME_NAME: 'Le pseudo doit contenir entre 3 et 20 caractères.',
} as const;

// Server Messages
export const SERVER_MESSAGES = {
  INTERNAL_ERROR: 'Erreur interne du serveur.',
  BAD_REQUEST: 'Requête invalide.',
  TOO_MANY_REQUESTS: 'Trop de requêtes. Réessayez plus tard.',
} as const;
