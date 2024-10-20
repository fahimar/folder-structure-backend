import mongoose, { Document, Schema } from "mongoose";

export interface IFolder extends Document {
  name: string;
  parentId: string | null;
  children: mongoose.Types.ObjectId[];
}

const FolderSchema: Schema = new Schema({
  name: { type: String, required: true },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  },
  children: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: [] },
  ],
});

const Folder = mongoose.model<IFolder>("Folder", FolderSchema);

export default Folder;
