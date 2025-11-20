/** @format */

import mongoose from "mongoose";

class Db {
  connect() {
    mongoose.connect(process.env.MONGO_URI);

    mongoose.connection.on("connected", () => {
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("Error connection failed:", err.message);
    });
  }
}

export { Db };
