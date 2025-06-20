import mongoose from 'mongoose';

const UseSchema = new mongoose.Schema({
    _id : {type: String, required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    image: {type: String, required: false},
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
},
{
    timestamps: true,}

)


const User = mongoose.models.User || mongoose.model('User', UseSchema);

export default User;