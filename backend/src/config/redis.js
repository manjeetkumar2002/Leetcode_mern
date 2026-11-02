const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    // store the redis pass into env
    password:process.env.REDIS_PASS,
    socket: {
        // you can also store host id into env
        host: 'redis-11613.c261.us-east-1-4.ec2.cloud.redislabs.com',
        port: 11613
    }
});

module.exports = redisClient

