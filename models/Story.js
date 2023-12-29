const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema(
  {
    product: { type: Object, required: true },
    storeDetails: { type: Object, required: true },
    specialPrice: { type: String, required: true },
    viewersId: { type: Array },
    isSponsored: { type: Boolean },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("Story", StorySchema);
