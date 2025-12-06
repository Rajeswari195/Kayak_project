const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'kayak-app',
    brokers: ['localhost:9095'], // Using the exposed port
    retry: {
        initialRetryTime: 100,
        retries: 8
    }
});

const producer = kafka.producer();

const connectProducer = async () => {
    try {
        await producer.connect();
        console.log('Kafka Producer connected');
    } catch (error) {
        console.error('Error connecting Kafka Producer:', error);
    }
};

connectProducer();

module.exports = {
    kafka,
    producer
};
