import { BaseRepository } from "@/common/repository/base.repository";
import { Injectable } from "@nestjs/common";
import { Friend, FriendSchema } from "./dto/friends.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class FriendsRepository extends BaseRepository<Friend>{
    constructor(@InjectModel(Friend.name) private readonly friendModel: Model<Friend>){
        super(friendModel)
    }
}