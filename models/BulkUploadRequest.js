const mongoose = require("mongoose");

const BulkUploadRequestSchema = new mongoose.Schema(
  {
    storeId: { type: String, required: true },
    storeName: { type: String },
    filePath: { type: String },
    approved: { type: String, default: false },
    requestProducts: { type: Array, default: [] },
  },
  { timestamps: true }
);

mongoose.models = {};
export default mongoose.model("BulkUploadRequest", BulkUploadRequestSchema);
