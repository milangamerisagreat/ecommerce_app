import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {

        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },  
        productImg:[
            {
                url: {type: String,required: true},
                public_id: {type: String,required: true}
            }
        ],
        productName: {type: String,required: true},
        productDesc: {type: String,required: true},
        productPrice: {type: Number,required: true},
        category: {type: String,required: true},
        brand: {type: String,required: true},


     },
    {timestamps: true}
)

export const Product = mongoose.model('Product', productSchema)