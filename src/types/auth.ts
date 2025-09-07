export interface UserClinic {
  id: string;
  name: string;
  role: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  plan?: string | null;
  clinic?: {
    id: string;
    name: string;
  };
  clinics?: UserClinic[];
}
