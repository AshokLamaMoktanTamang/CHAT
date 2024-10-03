import { Controller, Post, Body, Param, Get } from '@nestjs/common';

import { FriendsService } from './friends.service';

@Controller('friends')
export class FriendshipController {
  constructor(private readonly friendService: FriendsService) {}

  @Post('send-request')
  sendFriendRequest(
    @Body('requesterId') requesterId: string,
    @Body('recipientId') recipientId: string,
  ) {
    return this.friendService.sendFriendRequest(requesterId, recipientId);
  }

  @Post('accept-request/:id')
  acceptFriendRequest(@Param('id') friendshipId: string) {
    return this.friendService.acceptFriendRequest(friendshipId);
  }

  @Post('block-user')
  blockUser(
    @Body('requesterId') requesterId: string,
    @Body('recipientId') recipientId: string,
  ) {
    return this.friendService.blockUser(requesterId, recipientId);
  }

  @Get('friends/:userId')
  getFriends(@Param('userId') userId: string) {
    return this.friendService.getFriends(userId);
  }

  @Get('blocked/:userId')
  getBlockedUsers(@Param('userId') userId: string) {
    return this.friendService.getBlockedUsers(userId);
  }
}
