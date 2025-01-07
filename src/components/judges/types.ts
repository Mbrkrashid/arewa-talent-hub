export interface Judge {
  id: string;
  profile_id: string | null;
  expertise: string | null;
  bio: string | null;
  status: 'online' | 'offline';
  profiles: {
    avatar_url: string | null;
    username: string | null;
  } | null;
}