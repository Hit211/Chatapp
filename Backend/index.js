import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/lib/db.js";
import userRoute from "./src/routes/user.route.js";
import messageRoute from "./src/routes/message.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials:true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

connectDB();

app.use("/api/user",userRoute);
app.use("/api/message",messageRoute);

app.listen(PORT, ()=>{
  console.log("Server is running");
})