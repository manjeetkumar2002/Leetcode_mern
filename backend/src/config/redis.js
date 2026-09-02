const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    // store the redis pass into env
    password:process.env.REDIS_PASS,
    socket: {
        // you can also store host id into env
        host: 'redis-17149.crce286.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 17149
    }
});

module.exports = redisClient

