import { Router } from "express";
import {
  getFolders,
  createFolder,
  deleteFolder,
} from "../controllers/folderController";

const router = Router();

//  the routes and bind them to controller methods
router.get("/", getFolders);
router.post("/", createFolder);
router.delete("/:id", deleteFolder);

export default router;
