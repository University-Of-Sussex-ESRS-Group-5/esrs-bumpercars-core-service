import * as jwt from 'jsonwebtoken';

export class JWTUtils {
  static verifyAsync(token: string, key: string, options?: jwt.VerifyOptions) {
    return new Promise<any>((resolve, reject) => {
      if (!token) return reject('JWT is undefined');
      jwt.verify(token, key, options, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  }
  static signAsync(payload: any, key: string, options: jwt.SignOptions = {}) {
    return new Promise<string>((resolve, reject) => {
      jwt.sign(payload, key, options, (error, encoded) => {
        if (error) {
          reject(error);
        } else {
          resolve(encoded ?? '');
        }
      });
    });
  }
}
