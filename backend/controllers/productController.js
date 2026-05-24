import {Product} from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";


export const addProduct = async (req, res) => {

    try{
        const {productName, productDesc, productPrice, category, brand} = req.body;
        const userId = req.id;
        if(!productName || !productDesc || !productPrice || !category || !brand){
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
    
  const productImg = req.files.map((file) => ({
    url: file.path,
    public_id: file.filename
}));
    
    // create a product in DB
    const newProduct = await Product.create({
        userId,
        productName,
        productDesc,
        productPrice,
        category,
        brand,
        productImg // arry of objects [{url, public_id}]
    })
return res.status(201).json({
    success: true,
    message: "Product added successfully",
    product: newProduct
})




   }
catch(error){
       return res.status(500).json({
        success: false,        
        message: "Error adding product",
        error: error.message
    })                

    }
}

export const getAllProduct = async (_, res) => {
try{
    const products = await Product.find()
    if(!products )
        {
            return res.status(404).json({
                success: false,
                message: "No products found",
                products: []
            })
         }
        
return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    products: products
})

        }catch(error){
        return res.status(500).json({
        success: false,        
        message: "Error fetching products",
        error: error.message
    })
}
}