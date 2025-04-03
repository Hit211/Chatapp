import express from "express";
import dotenv from "dotenv";
import connectDB from "./src/lib/db.js";
import userRoute from "./src/routes/user.route.js";
import messageRoute from "./src/routes/message.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());

connectDB();

app.use("/api/user",userRoute);
app.use("/api/message",messageRoute);

app.listen(PORT, ()=>{
  console.log("Server is running");
})