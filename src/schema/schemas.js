import Joi from "@hapi/joi";

export const schemaSignUp = Joi.object({
    name: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPwd: Joi.valid(Joi.ref("password")),
  });
  
export const schemaSignIn = Joi.object({
email: Joi.string().min(1).required(),
password: Joi.string().min(1).required(),
});

export const schemaRegister = Joi.object({
userId: Joi.string().required(),
value: Joi.number().min(1).required(),
description: Joi.string().min(1).required(),
type: Joi.string().valid("in", "out").required(),
date: Joi.string().min(1).required(),
});