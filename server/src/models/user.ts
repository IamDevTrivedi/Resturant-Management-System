import mongoose, { InferSchemaType } from 'mongoose';
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
            required: true,
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
            required: true,
            enum: ['owner', 'customer'],
        },
    },
    {
        timestamps: true,
    },
);

const User = mongoose.model('user', userSchema);
export type IUser = mongoose.Document & InferSchemaType<typeof userSchema>;

export default User;
