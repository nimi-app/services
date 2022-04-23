import { Document } from 'mongoose';
import { MongooseDocumentBase } from 'src/modules/shared/interfaces/request.interface';

export interface ITwitterUser extends MongooseDocumentBase, Document {
  id: string;
  name: string;
  description: string;
  username: string;
  verified: boolean;
  protected: boolean;
  location: string;
  url: string;
  followersCount: number;
  followingCount: number;
  profileImageUrl: string;
  twitterId: string;
}

export interface TwitterAPIUser {
  created_at: string;
  description: string;
  id: string;
  location: string;
  name: string;
  pinned_tweet_id: string;
  profile_image_url: string;
  protected: string;
  public_metrics: {
    followers_count: number;
    following_count: number;
  };
  url: string;
  username: string;
  verified: string;
  withheld: string;
}

