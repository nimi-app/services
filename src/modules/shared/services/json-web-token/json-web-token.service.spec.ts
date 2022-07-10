import { sign } from 'jsonwebtoken';
import { JsonWebTokenService } from './json-web-token.service';

describe('JsonWebTokenService', () => {
  const secret = 'test';
  const jwtService = new JsonWebTokenService(secret);
  const payload = {
    test: 'test',
  };

  test('Should create correct JWT', async () => {
    const actualToken = await jwtService.sign(payload, {});
    const expectedToken = sign(payload, secret);
    // Compare again underhood library
    expect(actualToken).toEqual(expectedToken);
  });
  test('Should create correct JWT', async () => {
    const token = await jwtService.sign(payload, {});
    const actualPayload = await jwtService.verify(token);
    expect(actualPayload).toEqual(
      expect.objectContaining({
        test: 'test',
        iat: expect.any(Number),
      })
    );
  });
});
