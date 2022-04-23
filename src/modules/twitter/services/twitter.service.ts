import axios, { AxiosInstance } from 'axios';
import { TwitterAPIUser } from '../interfaces';

/**
 * Twitter Service
 */
export class TwitterService {
  private httpClient: AxiosInstance;

  constructor(beaerToken: string) {
    this.httpClient = axios.create({
      baseURL: 'https://api.twitter.com/2/',
      headers: {
        Authorization: `Bearer ${beaerToken}`,
      },
    });
  }

  /**
   * Fetches Twitter information for a given username
   */
  getUserByUsername(username: string) {
    return this.httpClient
      .get<{ data: TwitterAPIUser }>(`/users/by/username/${username}`, {
        params: {
          'user.fields': [
            'created_at',
            'description',
            'entities',
            'id',
            'location',
            'name',
            'pinned_tweet_id',
            'profile_image_url',
            'protected',
            'public_metrics',
            'url',
            'username',
            'verified',
            'withheld',
          ].join(','),
        },
      })
      .then(({ data }) => data.data);
  }
}

