const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, unique: true},
    password: { type: String },
    cart: { type: Array, default: []},
    pricing: { type: Object },
    savedAddresses: { type: Array, default: []},
    currentAddress: { type: Object, default: {}},
    password_reset_token: { type: String, trim: true },
}, {timestamps: true });

mongoose.models = {}
export default mongoose.model("User", UserSchema);