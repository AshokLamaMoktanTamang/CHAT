export const QUEUES = {
  mail: {
    name: 'mail',
    jobs: {
      signup: 'signup',
      verifyOtp: 'verifyOtp',
    },
  },
};

export const REDIS_CLIENT = {
  name: 'chat-cache-db',
  providerKey: 'IO-redis-key',
};

export enum FRIEND_STATUS {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  BLOCKED = 'BLOCKED',
}
