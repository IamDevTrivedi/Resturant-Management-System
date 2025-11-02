import mongoose, { InferSchemaType } from 'mongoose';
const { Schema } = mongoose;

const menuSchema = new Schema(
    {
        resturantID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'resturant',
            required: true,
        },

        dishName: {
            type: String,
            required: true,
            minLength: 2,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
        },

        cuisine: {
            type: String,
            enum: [
                'South Indian',
                'North Indian',
                'Gujarati',
                'Chinese',
                'Italian',
                'Mexican',
                'Thai',
                'Japanese',
                'American',
                'Continental',
                'Mediterranean',
                'French',
                'Korean',
                'Vietnamese',
                'Middle Eastern',
                'Fusion',
                'Other',
            ],
            required: true,
        },

        ratingsSum: {
            type: Number,
            default: 0,
        },

        ratingsCount: {
            type: Number,
            default: 0,
        },

        foodType: {
            type: String,
            enum: ['veg', 'non-veg', 'vegan', 'egg'],
            required: true,
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        imageURL: {
            type: String,
            required: true,
            trim: true,
        },

        isAvailable: {
            type: Boolean,
            default: true,
        },

        category: {
            type: String,
            enum: [
                'Appetizer',
                'Main Course',
                'Dessert',
                'Beverage',
                'Snack',
                'Breakfast',
                'Salad',
                'Soup',
            ],
        },
    },
    {
        timestamps: true,
    },
);

const Menu = mongoose.model('menu', menuSchema);
export type IMenu = mongoose.Document & InferSchemaType<typeof menuSchema>;

export default Menu;
