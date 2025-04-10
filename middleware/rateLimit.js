const redisClient = redis.createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});
redisClient.connect().catch(console.error);

const RATE_LIMIT = 100;
const WINDOW_IN_SECONDS = 60 * 60;

const rateLimiter = async (req, res, next) => {
  try {
    const userKey = req.headers['x-api-key'] || req.ip;
    const redisKey = `rate_limit:${userKey}`;

    const current = await redisClient.incr(redisKey);

    if (current === 1) {
      await redisClient.expire(redisKey, WINDOW_IN_SECONDS);
    }

    if (current > RATE_LIMIT) {
      const ttl = await redisClient.ttl(redisKey);
      return res.status(429).json({
        error: 'Rate limit exceeded. Try again later.',
        retryAfterSeconds: ttl,
      });
    }

    next();
  } catch (err) {
    console.error('Rate limiter error:', err.message);
    next();
  }
};

module.exports = rateLimiter;