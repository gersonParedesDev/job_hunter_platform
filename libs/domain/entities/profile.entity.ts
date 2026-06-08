export type UUID = string;

export interface Profile {
  id: UUID;
  userId: UUID;
  profession: string;
  skills: string[];
  createdAt: Date;
}
