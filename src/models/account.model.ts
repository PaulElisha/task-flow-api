/** @format */

import mongoose, { Document, Schema, model } from "mongoose";
import { ProviderType, Provider } from "../enums/account-provider.enum.ts";

export interface AccountDocument extends Document {
  userId: mongoose.Types.ObjectId;
  provider: ProviderType;
  providerId: string;
  refreshToken: string | null;
  tokenExpiry: Date | null;
}

const accountSchema = new Schema<AccountDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: Object.values(Provider),
      required: true,
    },
    providerId: {
      type: String,
      required: true,
      unique: true,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    tokenExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export default model<AccountDocument>("Account", accountSchema);
