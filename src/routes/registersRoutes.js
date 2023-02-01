import {
  deleteRegister,
  getRegisters,
  newEntry,
  newOut,
} from "../controllers/userController.js";
import { Router } from "express";

const registerRouter = Router()

registerRouter.get("/home", getRegisters);

registerRouter.post("/nova-entrada", newEntry);

registerRouter.post("/nova-saida", newOut);

registerRouter.delete("/home", deleteRegister);

export default registerRouter
