import mongoose from "mongoose";

const querySchema = new mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  phone: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Query", querySchema);
