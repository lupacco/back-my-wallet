import {
  deleteRegister,
  getRegisters,
  newEntry,
  newOut,
} from "../controllers/userController.js";
import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { schemaRegister } from "../schema/schemas.js";


const registerRouter = Router();

registerRouter.get("/home", getRegisters);

registerRouter.post("/nova-entrada", validateSchema(schemaRegister), newEntry);

registerRouter.post("/nova-saida", validateSchema(schemaRegister), newOut);

registerRouter.delete("/home", deleteRegister);

export default registerRouter;
