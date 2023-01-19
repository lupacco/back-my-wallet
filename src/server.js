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
    const {name, email, password} = req.body

    try{
        const emailInUse = await db.collection('users').findOne({email})

        if(emailInUse) return res.sendStatus(409)

        await db.collection('users').insertOne({name,email,password})
        
        return res.sendStatus(201)
    }catch(err){
        console.log(err)
        return res.sendStatus(500)
    }


})

// 200: Ok => Significa que deu tudo certo com a requisição
// 201: Created => Sucesso na criação do recurso
// 301: Moved Permanently => Significa que o recurso que você está tentando acessar foi movido pra outra URL
// 401: Unauthorized => Significa que você não tem acesso a esse recurso
// 404: Not Found => Significa que o recurso pedido não existe
// 409: Conflict => Significa que o recurso que você está tentando inserir já foi inserido
// 422: Unprocessable Entity => Significa que a requisição enviada não está no formato esperado
// 500: Internal Server Error => Significa que ocorreu algum erro desconhecido no servidor
