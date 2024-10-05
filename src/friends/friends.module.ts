import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { FriendsRepository } from './friends.repository';
import { Friend, FriendSchema } from './dto/friends.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Friend.name, schema: FriendSchema}])],
  controllers: [FriendsController],
  providers: [FriendsService, FriendsRepository],
})
export class FriendsModule {}
