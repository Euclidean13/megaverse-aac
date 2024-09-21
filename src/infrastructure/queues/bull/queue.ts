import Bull from 'bull';

const buildQueue = new Bull('buildQueue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10),
  },
});

export default buildQueue;
