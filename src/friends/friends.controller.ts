import { Controller, Post, UseGuards } from '@nestjs/common';

import { FriendsService } from './friends.service';
import { AuthGuard } from '@/common/guard/auth.gaurd';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Friend')
@UseGuards(AuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendService: FriendsService) {}

  @Post('send-request')
  sendFriendRequest() {
    return 'Friend Request Sent';
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
