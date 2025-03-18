// import { DB } from "../utils/connect.js";
import { eq } from "drizzle-orm";
import db from "../../config/db.js";
import { projects } from "../../schema/schema.js";

// CREATE A PROJECT
const create = async (newproject) => {
  try {
    const res = await db.insert(projects).values(newproject);

    console.log("New project created!");
    return { id: res.lastInsertRowid, data: newproject };
  } catch (error) {
    throw new Error(error);
  }
};

// UPDATE PROJECT USING ID
const update = async (id, projectData) => {
  if (projectData.is_favorite !== undefined) {
    projectData.is_favorite = projectData.is_favorite === true ? 1 : 0;
  }

  try {
    await db.update(projects).set(projectData).where(eq(id, projects.id));
    console.log("Project info updated!");

    return projectData;
  } catch (error) {
    throw new Error(error);
  }
};

// // DELETE PROJECT USING ID
const remove = async (id) => {
  try {
    return await db.delete(projects).where(eq(id, projects.id));
  } catch (error) {
    throw new Error(error);
  }
};

// // REMOVE ALL PROEJECTS
const removeAll = async () => {
  try {
    return await db.delete(projects);
  } catch (error) {
    throw new Error(error);
  }
};

// // GET A PROJECT BY ID
const findById = async (id) => {
  try {
    return await db.select().from(projects).where(eq(id, projects.id));
  } catch (error) {
    throw new Error(error);
  }
};

// // GET ALL PROJECTS
const findAll = async (req) => {
  let page = req.query["page"] ? Number(req.query["page"]) : 1;
  let limit = 1000;

  try {
    return await db
      .select()
      .from(projects)
      .limit(limit)
      .offset((page - 1) * limit);
  } catch (error) {
    throw new Error(error);
  }
};

export { create, remove, removeAll, update, findById, findAll };
