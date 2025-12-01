import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface UserTypes {
  fullName: string;
  username: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  password: string;
  role?: "user" | "admin";
}

export interface UserDoc extends UserTypes, mongoose.Document {
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<UserDoc>(
  {
    fullName: { type: String, required: true, trim: true },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNumber: { type: String, required: true, trim: true },
    birthDate: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password before saving
userSchema.pre("save", async function () {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<UserDoc>("User", userSchema);
