import { ApiTags } from '@nestjs/swagger';
import { Controller, Param, Post, UseGuards } from '@nestjs/common';

import { FriendsService } from './friends.service';

import { AuthGuard } from '@/common/guard/auth.gaurd';
import { MongoIdValidationPipe } from '@/common/pipe/mongoidValidation.pipe';
import { User } from '@/common/decorator/userParamDecorator';

@ApiTags('Friend')
@UseGuards(AuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendService: FriendsService) {}

  @Post('send-request/:recieverId')
  sendFriendRequest(
    @User('_id') senderId: string,
    @Param('recieverId', MongoIdValidationPipe) recieverId: string,
  ) {
    return this.friendService.sendFriendrequest({ recieverId, senderId });
  }

  // @Post('accept-request/:id')
  // acceptFriendRequest(@Param('id') friendshipId: string) {
  //   return this.friendService.acceptFriendRequest(friendshipId);
  // }

  // @Post('block-user')
  // blockUser(
  //   @Body('requesterId') requesterId: string,
  //   @Body('recipientId') recipientId: string,
  // ) {
  //   return this.friendService.blockUser(requesterId, recipientId);
  // }

  // @Get('friends/:userId')
  // getFriends(@Param('userId') userId: string) {
  //   return this.friendService.getFriends(userId);
  // }

  // @Get('blocked/:userId')
  // getBlockedUsers(@Param('userId') userId: string) {
  //   return this.friendService.getBlockedUsers(userId);
  // }
}
