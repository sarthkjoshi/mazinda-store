const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
  {
    storeId: { type: String, required: true },
    product: { type: Object },
    storeDetails: { type: String, required: true },
    specialPrice: { type: String },
    viewersId: { type: Array },
    isSponsored: { type: Boolean },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("Story", StorySchema);
