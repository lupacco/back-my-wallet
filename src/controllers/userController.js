import {db} from "../config/database.js"
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { schemaRegister } from "../schema/schemas.js";

export async function getRegisters(req, res){
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
    } catch (err) {
        console.log(err.message)
    }
  }

export async function newEntry(req, res){
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
  }

export async function newOut(req, res){
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
  }

export async function deleteRegister(req, res){
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
  }