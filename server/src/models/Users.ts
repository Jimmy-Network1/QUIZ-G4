import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  userName: string;
  email: string;
  password: string;
  totalScore: number;
  gamesPlayed: number;
}

const UserSchema: Schema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    totalScore: { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
  },
  { collection: "RegisteredUsers", timestamps: true }
);

const User = mongoose.model<IUser>("RegisteredUsers", UserSchema);
export default User;
