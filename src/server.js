import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "@hapi/joi";
import bcrypt from "bcrypt";
import { MongoClient, ObjectId } from "mongodb";

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

server.post('/cadastro', async (req, res) =>{
    const {name, email, password, confirmPwd} = req.body

    console.log(name)
    console.log(email)
    console.log(password)
    console.log(confirmPwd)
    return res.sendStatus(201)
})
