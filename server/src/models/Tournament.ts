import mongoose, { Document, Schema } from "mongoose";

export interface IMatch {
  player1: mongoose.Types.ObjectId | null;
  player2: mongoose.Types.ObjectId | null;
  winner: mongoose.Types.ObjectId | null;
  roomId: string | null;
  status: "pending" | "in_progress" | "completed";
}

export interface IRound {
  roundNumber: number;
  matches: IMatch[];
}

export interface ITournament extends Document {
  name: string;
  creator: mongoose.Types.ObjectId;
  mode: "online" | "local";
  category: string;
  participants: mongoose.Types.ObjectId[];
  status: "registration" | "in_progress" | "finished";
  rounds: IRound[];
  currentRound: number;
  winner: mongoose.Types.ObjectId | null;
}

const MatchSchema = new Schema({
  player1: { type: Schema.Types.ObjectId, ref: "RegisteredUsers" },
  player2: { type: Schema.Types.ObjectId, ref: "RegisteredUsers" },
  winner: { type: Schema.Types.ObjectId, ref: "RegisteredUsers" },
  roomId: { type: String },
  status: { type: String, enum: ["pending", "in_progress", "completed"], default: "pending" },
});

const RoundSchema = new Schema({
  roundNumber: { type: Number, required: true },
  matches: [MatchSchema],
});

const TournamentSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "RegisteredUsers", required: true },
    mode: { type: String, enum: ["online", "local"], required: true },
    category: { type: String, required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "RegisteredUsers" }],
    status: { type: String, enum: ["registration", "in_progress", "finished"], default: "registration" },
    rounds: [RoundSchema],
    currentRound: { type: Number, default: 0 },
    winner: { type: Schema.Types.ObjectId, ref: "RegisteredUsers" },
  },
  { timestamps: true }
);

const Tournament = mongoose.model<ITournament>("Tournament", TournamentSchema);
export default Tournament;
