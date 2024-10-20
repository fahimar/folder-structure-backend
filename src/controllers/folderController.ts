import { NextFunction, Request, Response } from "express";
import Folder from "../models/Folder";
import mongoose from "mongoose";

// GET /api/folders - Get the entire folder structure
export const getFolders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const folders = await Folder.find();
    res.json(folders);
  } catch (error) {
    next(error);
  }
};

// POST /api/folders - Create a new folder
export const createFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, parentId } = req.body;

  try {
    const newFolder = new Folder({
      name,
      parentId: parentId || null,
      children: [],
    });

    await newFolder.save();

    if (parentId) {
      // Find parent folder
      const parentFolder = await Folder.findById(parentId);
      if (!parentFolder) {
        res.status(404).json({ message: "Parent folder not found" });
        return;
      }

      // Add new folder's _id as ObjectId to parent's children array
      parentFolder.children.push(newFolder._id as mongoose.Types.ObjectId); // Cast _id to ObjectId
      await parentFolder.save();
    }

    res.status(201).json(newFolder);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/folders/:id - Delete a folder
export const deleteFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: "Invalid folder ID format" });
    return;
  }

  try {
    const folder = await Folder.findById(id);
    if (!folder) {
      res.status(404).json({ message: "Folder not found" });
      return;
    }

    // Prevent deletion of root folder
    if (!folder.parentId) {
      res.status(403).json({ message: "Root folder cannot be deleted" });
      return;
    }

    await deleteFolderRecursive(id);

    // Remove the folder from its parent's children array
    if (folder.parentId) {
      const parentFolder = await Folder.findById(folder.parentId);
      if (parentFolder) {
        parentFolder.children = parentFolder.children.filter(
          (childId) => childId.toString() !== id
        );
        await parentFolder.save();
      }
    }

    res.json({ message: "Folder and its subfolders deleted successfully" });
  } catch (error) {
    console.error("Error deleting folder:", error);
    res.status(500).json({ message: "Failed to delete folder" });
    return;
  }
};

// Helper function to recursively delete folder and its children
const deleteFolderRecursive = async (
  folderId: mongoose.Types.ObjectId | string
): Promise<void> => {
  const folder = await Folder.findById(folderId);
  if (folder) {
    for (const childId of folder.children) {
      await deleteFolderRecursive(childId);
    }

    await Folder.findByIdAndDelete(folderId);
  }
};
