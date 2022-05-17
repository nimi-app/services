import { captureException } from '@sentry/node';
import dayjsUtcPlugin from 'dayjs/plugin/utc';
import Boom from '@hapi/boom';
import debug from 'debug';
import dayjs from 'dayjs';

dayjs.extend(dayjsUtcPlugin);

// Constants
import { TWITTER_API_V2_BEARER_TOKEN } from '../../config/config.service';
import { TwitterService } from '../services/twitter.service';
import { TwitterUserModel } from '../models/TwitterUser.model';
import { IRequest } from 'src/modules/shared/interfaces/request.interface';

const debugTwitterController = debug(
  'controllers:twitter:getTwitterProfileByUsername'
);

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
      username: { $regex: new RegExp(query.username, 'i') },
    }).exec();

    debugTwitterController(twitterUserFromMongo?.toJSON());

    // If results from Mongo are less than 20 minutes old, return them
    if (
      twitterUserFromMongo != null &&
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

    debugTwitterController(twitterUserFromAPI);

    if (!twitterUserFromAPI) {
      throw new Error('Twitter user not found');
    }

    // Save to database
    const twitterUserUpsertResult = await TwitterUserModel.findOneAndUpdate(
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
        returnDocument: 'after',
      }
    );

    return {
      data: twitterUserUpsertResult?.toJSON({
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

