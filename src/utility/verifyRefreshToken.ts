import UserToken from "../model/userToken.model";
import jwt from "jsonwebtoken";

const verifyRefreshToken = async (refreshToken: any) => {
  const privateKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;

  try {
    const doc = await UserToken.findOne({ token: refreshToken });

    if (!doc) {
      throw { error: true, message: "Invalid refresh token" };
    }

    const tokenDetails = jwt.verify(refreshToken, privateKey as string);

    return {
      tokenDetails,
      error: false,
      message: "Valid refresh token",
    };
  } catch (err:any) {
    if (err.name === 'JsonWebTokenError') {
      throw { error: true, message: "Invalid refresh token" };
    }
    throw { error: true, message: err.message || "Invalid refresh token" };
  }
};

export default verifyRefreshToken;
