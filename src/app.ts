import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import folderRoutes from "./routes/folderRoutes";

// Load environment variables
dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/folders", folderRoutes);

export default app;
