export interface Token {
  accessToken: {
    id: number;
    name: string;
    abilities: string[],
    expires_at: string | null;
    tokenable_id: number;
    tokenable_type: string;
    updated_at: string;
    created_at: string;
  },
  plainTextToken: string;
}