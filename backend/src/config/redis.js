const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    // store the redis pass into env
    password:process.env.REDIS_PASS,
    socket: {
        // you can also store host id into env
        host: 'redis-15419.crce281.ap-south-1-3.ec2.cloud.redislabs.com',
        port: 15419
    }
});

module.exports = redisClient