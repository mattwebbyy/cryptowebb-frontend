export interface AuthResponse {
  token: string;
  refreshToken: string;
  type: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    avatarUrl?: string;
  };
}