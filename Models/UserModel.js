import mongoose from 'mongoose';

// * user schema definition 
const UserSchema = new mongoose.Schema({
    name: {
        type:String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    phone:{
        type:Number,
        length:10,
        unique: true
    },
    cart:{
        type:Array,
    },
    accountType:{
        type: Boolean,
        default: false
    },
});

const User = new mongoose.model('user', UserSchema);

export default User;
