import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserService } from '@/user/user.service';
import { FriendsRepository } from './friends.repository';
import {
  SendFriendRequest,
  UpdateFriendStatus,
} from './dto/friends.interfaces';
import { FRIEND_STATUS } from '@/utils/constants';

@Injectable()
export class FriendsService {
  constructor(
    private readonly friendRepository: FriendsRepository,
    private readonly userService: UserService,
  ) {}

  private async validateUserAndUpdateStatus({
    recieverId,
    senderId,
    status,
  }: UpdateFriendStatus) {
    if (senderId.toString() === recieverId.toString())
      throw new ConflictException('Unable to do action');

    const sender = await this.userService.findUserById(senderId);
    const reciever = await this.userService.findUserById(recieverId);

    if (!reciever || !sender) throw new NotFoundException('User Not Found');

    const existingStatus = await this.friendRepository.findExitingRecord({
      recieverId,
      senderId,
    });

    switch (status) {
      case FRIEND_STATUS.PENDING:
        if (existingStatus)
          throw new ConflictException('Already existing record');

        await this.friendRepository.create({
          data: {
            recipient: recieverId,
            requester: senderId,
            status,
          },
        });

        break;

      default:
        break;
    }
  }

  async sendFriendrequest({ recieverId, senderId }: SendFriendRequest) {
    await this.validateUserAndUpdateStatus({
      recieverId,
      senderId,
      status: FRIEND_STATUS.PENDING,
    });

    return 'Friend Request sent successfully!';
  }
}
