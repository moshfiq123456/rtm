import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const signUpBodyValidation = (body:any) => {
  const schema = Joi.object({
    userName: Joi.string().required().label("User Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    roles: Joi.string().label("Roles"),
  });
  return schema.validate(body);
};

const logInBodyValidation = (body:any) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(body);
};

const refreshTokenBodyValidation = (body:any) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label("Refresh Token"),
  });
  return schema.validate(body);
};

export {
  signUpBodyValidation,
  logInBodyValidation,
  refreshTokenBodyValidation,
};
