import { signIn, signUp } from "../controllers/authController.js";
import { Router } from "express";
import { validateSchema } from "../middlewares/validateSchema.js";
import { schemaSignIn, schemaSignUp } from "../schema/schemas.js";

const authRouter = Router();

authRouter.post("/cadastro",validateSchema(schemaSignUp), signUp);

authRouter.post("/", validateSchema(schemaSignIn), signIn);

export default authRouter;
