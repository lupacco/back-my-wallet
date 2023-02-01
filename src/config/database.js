import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongoClient = new MongoClient(process.env.DATABASE_URL);

try{
    await mongoClient.connect()
    console.log('Database connected!')
} catch (err){
    console.log('Nçao foi possível se conectar ao banco de dados...')
    console.log(err.message)
}



export const db = mongoClient.db();