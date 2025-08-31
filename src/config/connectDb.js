import mongoose from "mongoose";

class connectDb {

    constructor() {
        this.connectDB();
    }

    connectDB() {
        mongoose.connect(process.env.MONGODB_URI);

        mongoose.connection.on("connected", () => { console.log("MongoDB connected successfully"); });

        mongoose.connection.on("error", (err) => {
            console.error("Error connection failed:", err.message);
        });
    }
}
export { connectDb };