// /app/models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Clerk User ID
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String },
}, 
    {timestamps: true}
);

const User = mongoose.models.User || mongoose.model('User', UserSchema);
export default User;
