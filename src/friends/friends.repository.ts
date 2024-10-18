import { BaseRepository } from '@/common/repository/base.repository';
import { Injectable } from '@nestjs/common';
import { Friend } from './schema/friends.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { FindExistingRequestRecord } from './dto/friends.interfaces';

@Injectable()
export class FriendsRepository extends BaseRepository<Friend> {
  constructor(
    @InjectModel(Friend.name) private readonly friendModel: Model<Friend>,
  ) {
    super(friendModel);
  }

  async findExitingRecord({ recieverId, senderId }: FindExistingRequestRecord) {
    const requesterId = new Types.ObjectId(senderId);
    const recipientId = new Types.ObjectId(recieverId);

    return await this.findOne({
      filter: {
        $or: [
          { requester: requesterId, recipient: recipientId },
          { requester: recipientId, recipient: requesterId },
        ],
      },
    });
  }
}
