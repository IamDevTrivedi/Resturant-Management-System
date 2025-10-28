import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 2,
        },
        lastName: {
            type: String,
            minLength: 2,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            immutable: true,
            trim: true,
        },
        hashedPassword: {
            required: true,
            type: String,
        },
        role: {
            type: String,
            enum: ['owner', 'customer'],
        },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model('user', userSchema);
export default User;
