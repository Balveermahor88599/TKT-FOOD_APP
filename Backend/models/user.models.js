import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    Fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    mobile: {
      type: String,
      required: [false, "Mobile number is required"],
      minlength: 10,
      maxlength: 10,
      match: [/^[0-9]{10}$/, "Please enter a valid 10-digit mobile number"],
    },
    role: {
      type: String,
      enum: ["user", "owner", "deliveryBoy"],
      default: "user",
      required: true,
    },
    // GeoJSON Point Structure
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      // Spelling fixed: 'coordinates'
      coordinates: {
        type: [Number],
        default: [0, 0], // [longitude, latitude]
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexing for geospatial queries like $near or $geoWithin
userSchema.index({ location: "2dsphere" });

const User = mongoose.model("User", userSchema);
export default User;