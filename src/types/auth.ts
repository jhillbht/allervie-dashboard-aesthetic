export interface UserRole {
  role: 'admin' | 'user';
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole['role'];
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
}