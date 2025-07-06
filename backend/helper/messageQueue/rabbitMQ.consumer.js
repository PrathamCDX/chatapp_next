import amqp from "amqplib";
import userModel_V2 from "../../models/v2/user_v2.js";

import dotenv from "dotenv";
dotenv.config();

const rabbitMQurl = String(process.env.RABBIT_URL);

const useConsumer = async (size = 20) => {
  try {
    const connection = await amqp.connect(rabbitMQurl);
    const channel = await connection.createChannel();
    const queue = "hello";
    try {
      const queueDetails = await channel.assertQueue(queue, {
        durable: false,
      });
      if (queueDetails.messageCount < 1) {
        console.log("No messages to to be processed ");
        return;
      }
      const lengthOfQueue = Math.min(queueDetails.messageCount, size);
      let operations = [];

      for (let i = 0; i < lengthOfQueue; i++) {
        let msg = await channel.get(queue, { noAck: true });
        if (!msg) continue; // skip if no message

        let data_ = undefined;
        try {
          data_ = await JSON.parse(msg.content.toString());
        } catch (e) {
          console.error("Invalid JSON in message:", e);
          continue;
        }

        if (!data_) {
          throw new Error("Invalid message format:", data_);
        }

        let newOperation = data_;

        // check newOperaton and then push
        if (newOperation) {
          operations.push(newOperation);
        } else {
          throw new Error("undefined newOperation ");
        }

        // console.log(" new operation : ", newOperation);
      }
      console.log("no of entries : ", operations.length);
      const result = await userModel_V2.bulkWrite(operations);
      console.log("Bulk write operation successful:", result);

      return;
    } catch (error) {
      console.log("error in mq consumer ", error);
      return;
    } finally {
      if (channel) await channel.close();
      if (connection) await connection.close();
    }
  } catch (error) {
    console.log("error connecting to the message queue ");
  }
};

export default useConsumer;
