import { randomInt } from 'crypto';

export function generateNumericOTP(length = 6): string {
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += randomInt(0, 10).toString();
  }

  return otp;
}
