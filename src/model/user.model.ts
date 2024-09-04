import moment from "moment";
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: String,
    required: false,
    default: "employee",
  },

  createOn: {
    type: Date,
    default: moment().utc(true)
  },

  updateAt: {
    type: Date,
    default: moment().utc(true)
  }
  
});

const User = mongoose.model("User", userSchema);

export default User;
