import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./database/db.js";
import router from "./routes/userRoute.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
  
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const startServer = async () => {
  try {
    await connectDB();

    app.use("/api/v1/user", router);

    app.get("/", (req, res) => {
      res.send("");
    });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();