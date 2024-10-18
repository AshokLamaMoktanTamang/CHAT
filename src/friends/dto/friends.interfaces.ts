import { FRIEND_STATUS } from '@/utils/constants';

export interface SendFriendRequest {
  recieverId: string;
  senderId: string;
}

export interface UpdateFriendStatus extends SendFriendRequest {
  status: FRIEND_STATUS;
}

export interface FindExistingRequestRecord extends SendFriendRequest {}
