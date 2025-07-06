import amqp from "amqplib";

import dotenv from "dotenv";
dotenv.config();

const rabbitMQurl = String(process.env.RABBIT_URL);

const useProducer = async (message) => {
  try {
    const connection = await amqp.connect(rabbitMQurl);
    const channel = await connection.createChannel();
    const queue = "hello";
    try {
      if (typeof message !== "string") {
        throw new Error("message queue can only accept string as input");
      }

      await channel.assertQueue(queue, {
        durable: false,
      });

      channel.sendToQueue(queue, Buffer.from(message));
      console.log(" [x] Sent %s");
    } catch (error) {
      console.log("error in producer :", error);
    } finally {
      if (channel) await channel.close();
      if (connection) await connection.close();
    }
  } catch (error) {
    console.log("error in MQ connection");
  }
};

export default useProducer;
