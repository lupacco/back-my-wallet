import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Joi from "@hapi/joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { MongoClient, ObjectId } from "mongodb";

const schemaSignUp = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPwd: Joi.valid(Joi.ref("password")),
});

const schemaSignIn = Joi.object({
  email: Joi.string().min(1).required(),
  password: Joi.string().min(1).required(),
});

const schemaRegister = Joi.object({
  userId: Joi.string().required(),
  value: Joi.number().min(1).required(),
  description: Joi.string().min(1).required(),
  type: Joi.string().valid("in", "out").required(),
  date: Joi.string().min(1).required(),
});

dotenv.config();

let db;
const mongoClient = new MongoClient(process.env.DATABASE_URL);

mongoClient
  .connect()
  .then(() => {
    db = mongoClient.db();
  })
  .catch((err) =>
    console.log("Não foi possível se conectar ao Banco de dados...")
  );

const server = express();
server.use(express.json());
server.use(cors());

server.listen(process.env.PORT, () => {
  console.log(`Running on PORT ${process.env.PORT}`);
});

server.post("/cadastro", async (req, res) => {
  const { name, email, password, confirmPwd } = req.body;

  const hashPassword = bcrypt.hashSync(password, 10);

  try {
    const signupValidated = schemaSignUp.validate(req.body, {
      abortEarly: false,
    });

    if (signupValidated.error) return res.sendStatus(422);

    const emailInUse = await db.collection("users").findOne({ email });

    if (emailInUse) return res.sendStatus(409);

    await db
      .collection("users")
      .insertOne({ name, email, password: hashPassword });

    return res.sendStatus(201);
  } catch (err) {
    console.log(err);
    return res.sendStatus(500);
  }
});

server.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const signinValidated = schemaSignIn.validate(req.body, {
      abortEarly: false,
    });

    if (signinValidated.error) return res.sendStatus(422);

    const user = await db.collection("users").findOne({ email });

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = uuid();
      await db.collection("sessions").insertOne({ token, userID: user._id });

      delete user.password;

      return res.status(200).send({ ...user, token });
    } else {
      return res.sendStatus(401);
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

server.get("/home", async (req, res) => {
  const { authorization, userid } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const user = await db
      .collection("users")
      .findOne({ _id: ObjectId(userid) });

    if (!user) return res.sendStatus(404);

    const session = await db.collection("sessions").findOne({ token });

    if (!session) return res.sendStatus(401);

    const userTransactions = await db
      .collection("transactions")
      .find({ userId: userid })
      .toArray();

    console.log(userTransactions);

    return res.status(200).send(userTransactions);
    // const userExist = await db.collection('users').findOne(user)
  } catch (err) {}
});

server.post("/nova-entrada", async (req, res) => {
  const transactionRequest = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const registerValidation = schemaRegister.validate(transactionRequest, {
      abortEarly: false,
    });

    if (registerValidation.error) return res.sendStatus(422);

    const session = await db.collection("sessions").findOne({ token });

    if (!session) return res.sendStatus(401);

    await db.collection("transactions").insertOne({ ...transactionRequest });

    return res.sendStatus(201);
  } catch (err) {
    console.log("Deu ruim na entrada");
    return res.sendStatus(500);
  }
});

server.post("/nova-saida", async (req, res) => {
  const transactionRequest = req.body;
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const registerValidation = schemaRegister.validate(transactionRequest, {
      abortEarly: false,
    });

    if (registerValidation.error) return res.sendStatus(422);

    const session = await db.collection("sessions").findOne({ token });

    if (!session) return res.sendStatus(401);

    await db.collection("transactions").insertOne({ ...transactionRequest });

    return res.sendStatus(201);
  } catch (err) {
    console.log("Deu ruim na saida");
    return res.sendStatus(500);
  }
});

server.delete("/home", async (req, res) => {
  const { authorization, registerid } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    const session = await db.collection("sessions").findOne({ token });

    if (!session) return res.sendStatus(401);

    await db.collection("transactions").deleteOne({_id:ObjectId(registerid) });

    return res.sendStatus(200)
  } catch (err) {
    return res.sendStatus(500);
  }
});

// 200: Ok => Significa que deu tudo certo com a requisição
// 201: Created => Sucesso na criação do recurso
// 301: Moved Permanently => Significa que o recurso que você está tentando acessar foi movido pra outra URL
// 401: Unauthorized => Significa que você não tem acesso a esse recurso
// 404: Not Found => Significa que o recurso pedido não existe
// 409: Conflict => Significa que o recurso que você está tentando inserir já foi inserido
// 422: Unprocessable Entity => Significa que a requisição enviada não está no formato esperado
// 500: Internal Server Error => Significa que ocorreu algum erro desconhecido no servidor
