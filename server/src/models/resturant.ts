import mongoose, { InferSchemaType } from 'mongoose';
const { Schema } = mongoose;

const resturantSchema = new Schema(
    {
        resturantName: {
            type: String,
            required: true,
            minLength: 2,
        },
        address: {
            line1: {
                type: String,
                required: true,
                minLength: 3,
                trim: true,
            },
            line2: {
                type: String,
                required: true,
                minLength: 3,
                trim: true,
            },
            line3: {
                type: String,
                required: false,
                minLength: 3,
                trim: true,
            },
            zip: {
                type: String,
                required: true,
                trim: true,
            },
            city: {
                type: String,
                required: true,
                minLength: 2,
            },
            state: {
                type: String,
                required: true,
                minLength: 2,
            },
            country: {
                type: String,
                required: true,
                minLength: 2,
            },
        },

        ownerName: {
            type: String,
            required: true,
            minLength: 2,
            trim: true,
        },

        phoneNumber: {
            type: String,
            required: true,
            trim: true,
        },
        
        resturantEmail: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },

        websiteURL: {
            type: String,
            trim: true,
        },
        
        socialMedia: {
            facebook: {
                type: String,
                trim: true,
            },
            instagram: {
                type: String,
                trim: true,
            },
            twitter: {
                type: String,
                trim: true,
            },
        },
        
        openingHours: {
            weekend: {
                start: {
                    type: Date,
                    required: true,
                },
                end: {
                    type: Date,
                    required: true,
                },
            },
            weekday: {
                start: {
                    type: Date,
                    required: true,
                },
                end: {
                    type: Date,
                    required: true,
                },
            },
        },
        
        ratingsSum: {
            type: Number,
            default: 0,
        },
        
        ratingsCount: {
            type: Number,
            default: 0,
        },
        
        logoURL: {
            type: String,
            trim: true,
        },
        
        bannerURL: {
            type: String,
            trim: true,
        },
        
        about: {
            type: String,
            trim: true,
        },
        
        since: {
            type: Date,
        },
        
        slogan: {
            type: String,
            trim: true,
        },
        
        status: {
            isActive: {
                type: Boolean,
                default: true,
            },
            isVerified: {
                type: Boolean,
                default: false,
            },
            temporarilyClosed: {
                type: Boolean,
                default: false,
            },
        },
    },
    {
        timestamps: true,
    },
);

const Resturant = mongoose.model('resturant', resturantSchema);
export type IResturant = mongoose.Document & InferSchemaType<typeof resturantSchema>;
export default Resturant;
