import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
}
} , { timestamps: true });

const Session = mongoose.model("Session", sessionSchema);
export default Session;
