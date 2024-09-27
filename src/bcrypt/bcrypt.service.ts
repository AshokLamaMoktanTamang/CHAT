import { Injectable } from '@nestjs/common';
import { hash as bcryptHash, compare as bcryptCompare, genSalt } from 'bcrypt';

@Injectable()
export class BcryptService {
  async hash(content: string | Buffer) {
    const salt = await genSalt(10);
    const hashedContent = await bcryptHash(content, salt);

    return hashedContent;
  }

  async compare(content: string | Buffer, hashedContent: string) {
    const isMatch = await bcryptCompare(content, hashedContent);

    return isMatch;
  }
}
