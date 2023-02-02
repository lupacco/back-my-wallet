import { db } from "../config/database.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function signUp(req, res) {
  const { name, email, password } = req.body;

  const hashPassword = bcrypt.hashSync(password, 10);

  try {
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
}

export async function signIn(req, res) {
  const { email, password } = req.body;

  try {
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
}
