import request from "supertest";
import app from "../app"; // Import your app

describe("Folder API Tests", () => {
  it("should fetch all folders", async () => {
    const res = await request(app).get("/api/folders");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array); // Expecting an array of folders
  });

  it("should create a new folder", async () => {
    const res = await request(app).post("/api/folders").send({
      name: "Test Folder",
      parentId: null, // Creating a root-level folder
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("name", "Test Folder");
  });

  it("should delete a folder", async () => {
    const folderRes = await request(app).post("/api/folders").send({
      name: "Folder to Delete",
      parentId: null,
    });

    const folderId = folderRes.body._id;
    const deleteRes = await request(app).delete(`/api/folders/${folderId}`);
    expect(deleteRes.statusCode).toEqual(200);
    expect(deleteRes.body.message).toEqual("Folder deleted");
  });
});
