
export interface Article {
    _id: string;
    title: string;
    content: string;
    created_at?: Date;
    image_url: string;
    author_id?: string; // Optional, in case you need to track the author
    isSecond?: boolean;
  }

  export interface LeaderboardEntry {
    _id: string;
    rank: number;
    name: string;
    score?: number;
  }
  