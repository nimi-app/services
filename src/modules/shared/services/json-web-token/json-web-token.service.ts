import {
  sign as signBase,
  verify as verifyBase,
  VerifyOptions,
  Secret,
  SignOptions,
} from 'jsonwebtoken';

export enum JwtSignOptions {
  EXPIRES_IN_24HR = '24h',
  EXPIRES_IN_12HR = '24h',
}

export class JsonWebTokenService {
  private secret: Secret;
  signOptions: SignOptions;

  /**
   * Create a new `JsonWebTokenService`
   * @param secret a secret to sign payload with, and then verify tokens
   */
  constructor(secret: Secret) {
    this.secret = secret;
  }

  async verify<R>(token: string, verifyOptions?: VerifyOptions): Promise<R> {
    return new Promise((resolve, reject) => {
      verifyBase(
        token,
        this.secret,
        verifyOptions,
        (err: unknown, decoded: unknown) => {
          if (err) {
            return reject(err);
          }
          return resolve(decoded as R);
        }
      );
    });
  }

  async sign(
    payload: string | Record<string, unknown> | Buffer,
    signOptions: SignOptions
  ) {
    return signBase(payload, this.secret, signOptions);
  }
}

