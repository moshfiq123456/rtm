import jwt from "jsonwebtoken";
import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import generateTokens from "../utility/generateToken";
import {
  signUpBodyValidation,
  logInBodyValidation,
  refreshTokenBodyValidation,
} from "../utility/validationSchema";
import { decodeToken } from "../helpers/decodeToken";
import User from "../model/user.model";
import verifyRefreshToken from "../utility/verifyRefreshToken";
import UserToken from "../model/userToken.model";

// signup
const SignUp = async (req: Request, res: Response) => {
  try {
    const { error } = signUpBodyValidation(req.body);
    if (error) {
      //   logger.error({ message: error.details[0].message, timestamp: new Date().toISOString() });
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      //   logger.error({ message: "User with given email already exists", email: req.body.email, timestamp: new Date().toISOString() });
      return res
        .status(400)
        .json({ error: true, message: "User with given email already exists" });
    }

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashPassword }).save();
    
    // logger.info({ message: "Account created successfully", email: req.body.email, timestamp: new Date().toISOString() });
    res
      .status(201)
      .json({ status: 201, message: `User ${req.body.userName} has been created successfully` });
  } catch (err:any) {
    // logger.error({ message: err.message, timestamp: new Date().toISOString() });
    
    res.status(500).json({ error: true, message: err.message });
  }
};

// login
const Login = async (req: Request, res: Response) => {
  try {
    const { error } = logInBodyValidation(req.body);
    if (error) {
      //   logger.error({ message: error.details[0].message, timestamp: new Date().toISOString() });
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      //   logger.error({ message: "User not found", email: req.body.email, timestamp: new Date().toISOString() });
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });
    }

    const verifiedPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!verifiedPassword) {
      //   logger.error({ message: "Incorrect password", email: req.body.email, timestamp: new Date().toISOString() });
      return res
        .status(401)
        .json({ error: true, message: "Invalid email or password" });
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    // logger.info({ message: "Logged in successfully", email: req.body.email, timestamp: new Date().toISOString() });
    res.status(200).json({
      error: false,
      accessToken,
      refreshToken,
      message: "Logged in successfully",
    });
  } catch (err) {
    // logger.error({ message: err.message, timestamp: new Date().toISOString() });
    console.log(err);
    res.status(500).json({ error: true, message: err });
  }
};

const UserList = async (req: Request, res: Response) => {
  const decodedToken: any = decodeToken(req.header("Authorization"));

  try {
    if (decodedToken?.roles === "super_admin") {
      const users = await User.find(
        {},
        { password:0 }
      );
      console.log(users);
      res.status(200).json( users );
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: err });
  }
};

const GetUser = async (req: Request, res: Response) => {
  try {
    const users = await User.findOne(
      { _id: { _id: req.params.id } },
      { password:0 }
    );
    console.log(users);
    res.status(200).json( users );
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: true, message: err });
  }
};

const DeleteUser = async (req: Request, res: Response) => {
  const decodedToken: any = decodeToken(req.header("Authorization"));
  try {
    if (decodedToken?.roles === "super_admin") {
      await User.deleteOne({ _id: { _id: req.params.id } });
      res.status(200).json(req.params.id );
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (err) {
    res.status(500).json({ error: true, message: err });
  }
};

const UpdatePassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the old password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(
      req.body.old_password,
      user.password
    );

    if (passwordMatch) {
      // Generate a new salt and hash for the new password
      const salt = await bcrypt.genSalt(Number(process.env.SALT));
      const newPassword = await bcrypt.hash(req.body.new_password, salt);

      // Update the user's password in the database
      user.password = newPassword;
      await user.save();

      res.status(200).json(user);
    } else {
      res.status(500).json({
        message: "Password doesn't match.",
      });
    }
  } catch (err) {
    res.status(500).send(err);
  }
};



const Logout = async (req: Request, res: Response) => {
  try {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error) {
      const errorMessage = `Validation error in token logout: ${error.details[0].message}`;
      //   logger.error(errorMessage);
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    const userToken = await UserToken.findOne({ token: req.body.refreshToken });
    if (!userToken) {
      //   logger.info('User already logged out');
      return res
        .status(200)
        .json({ error: false, message: "Logged Out Successfully" });
    }

    await userToken.deleteOne();
    // logger.info('User logged out successfully');
    res.status(200).json({ error: false, message: "Logged Out Successfully" });
  } catch (err) {
    const errorMessage = `Error in token logout: ${err}`;
    // logger.error(errorMessage);
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

const GetAccessToken = async (req: Request, res: Response) => {
  try {
    const { error } = refreshTokenBodyValidation(req.body);
    if (error) {
      const errorMessage = `Validation error in token refresh: ${error.details[0].message}`;
      
      //   logger.error(errorMessage);
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    verifyRefreshToken(req.body.refreshToken)
      .then(({ tokenDetails }: any) => {
        const payload = { _id: tokenDetails._id, roles: tokenDetails.roles };
        const accessToken = jwt.sign(
          payload,
          process.env.ACCESS_TOKEN_PRIVATE_KEY as any,
          { expiresIn: "1d" }
        );
        // logger.info('New access token generated successfully');
        res.status(200).json({
          error: false,
          accessToken,
          message: "Access token created successfully",
        });
      })
      .catch((err:any) => {
        const errorMessage = `Error in token refresh: ${err}`;
        console.log(errorMessage)
        // logger.error(errorMessage);
        res.status(400).json(err);
      });
  } catch (err) {
    const errorMessage = `Error in token refresh: ${err}`;
    // logger.error(errorMessage);
    console.log(err);
    res.status(500).json({ error: true, message: "Internal Server Error" });
  }
};

export {
  Login,
  SignUp,
  UserList,
  DeleteUser,
  UpdatePassword,
  Logout,
  GetAccessToken,
  GetUser
};
