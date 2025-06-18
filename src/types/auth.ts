export interface LoginBody {
  email: string;
  password: string;
}

export interface GoogleLoginBody {
  idToken: string;
}

export interface GooglePayload {
  sub: string;
  email?: string;
  name?: string;
}

export interface RegisterBody {
  username: string;
  email: string;
  password: string;
  friendCode?: string;
  inGameName?: string;
}