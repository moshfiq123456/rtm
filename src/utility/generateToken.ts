import jwt from "jsonwebtoken";
import UserToken from "../model/userToken.model";

const generateTokens = async (user:any) => {
  try {
    const payload = { _id: user._id, roles: user.roles };
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_PRIVATE_KEY as string,
      { expiresIn: "1d" } 
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_PRIVATE_KEY as string,
      { expiresIn: "30d" }
    );

    const userToken = await UserToken.findOne({ userId: user._id });
    if (userToken) await userToken.deleteOne();

    await new UserToken({ userId: user._id, token: refreshToken }).save();
    return Promise.resolve({ accessToken, refreshToken });
  } catch (err) {
    return Promise.reject(err);
  }
};

export default generateTokens;
