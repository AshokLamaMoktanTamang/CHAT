import { Injectable } from '@nestjs/common';
import { FriendsRepository } from './friends.repository';

@Injectable()
export class FriendsService {
    constructor(private readonly friendRepository: FriendsRepository){}

    
}
