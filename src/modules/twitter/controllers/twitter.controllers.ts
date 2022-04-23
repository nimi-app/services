import { captureException } from '@sentry/node';
import dayjs from 'dayjs';
import dayjsUtcPlugin from 'dayjs/plugin/utc';
import Boom from '@hapi/boom';

dayjs.extend(dayjsUtcPlugin);

// Constants
import { TWITTER_API_V2_BEARER_TOKEN } from '../../config/config.service';
import { TwitterService } from '../services/twitter.service';
import { TwitterUserModel } from '../models/TwitterUser.model';
import { IRequest } from 'src/modules/shared/interfaces/request.interface';

/**
 * Fetches Twitter information for a given username
 */
export async function getTwitterProfileByUsername(req: IRequest) {
  try {
    const { query } = req;
    // Services
    const twitterService = new TwitterService(TWITTER_API_V2_BEARER_TOKEN);
    // Fetch from mongo
    const twitterUserFromMongo = await TwitterUserModel.findOne({
      username: query.username,
    });

    if (
      twitterUserFromMongo != null &&
      twitterUserFromMongo.username != null &&
      dayjs().utc().diff(twitterUserFromMongo.updatedAt) < 1000 * 60 * 20 // 20 minutes
    ) {
      return {
        data: twitterUserFromMongo.toJSON({
          virtuals: true,
          versionKey: false,
        }),
      };
    }

    const twitterUserFromAPI = await twitterService.getUserByUsername(
      query.username
    );

    console.log({ twitterUserFromAPI });

    if (!twitterUserFromAPI) {
      throw new Error('Twitter user not found');
    }

    // Update the local cache
    await TwitterUserModel.updateOne(
      { username: twitterUserFromAPI.username },
      {
        $set: {
          ...twitterUserFromAPI,
          followersCount: twitterUserFromAPI.public_metrics.followers_count,
          followingCount: twitterUserFromAPI.public_metrics.following_count,
          profileImageUrl: twitterUserFromAPI.profile_image_url.replace(
            '_normal',
            '_400x400'
          ),
          twitterId: twitterUserFromAPI.id,
        },
      },
      {
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    const twitterUserFromMongoAfterUpdate = await TwitterUserModel.findOne({
      username: query.username,
    });

    return {
      data: twitterUserFromMongoAfterUpdate?.toJSON({
        virtuals: true,
        versionKey: false,
      }),
    };
  } catch (e) {
    console.log(e?.response);
    captureException(e);
    throw Boom.badRequest(e);
  }
}

