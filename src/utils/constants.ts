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
