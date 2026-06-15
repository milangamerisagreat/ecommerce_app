import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.id;
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart) {
      return res.json({
        success: true,
        message: "Cart is empty",
        cart: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching cart",
      error: error.message,
    });
  }
}

export const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.body;

    //check if product exists
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    //find the users cart (if exists )
    let cart = await Cart.findOne({ userId });

    //if cart does not exist, create a new cart
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity: 1, price: product.productPrice }],
        totalPrice: product.productPrice,
      });
    } else {
      const itemIndex = cart.items.findIndex(
        item => item.productId.toString() === productId,
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += 1;
      } else {
        cart.items.push({
          productId,
          quantity: 1,
          price: product.productPrice,
        });
      }
    }

    //recalculate total price
    cart.totalPrice = cart.items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    await cart.save();


    //populate product products details before sending response
    const populatedCart = await Cart.findOne(cart._id ).populate("items.productId");

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: populatedCart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding to cart",
      error: error.message,
    });
  }
}

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.id;
        const { productId, type } = req.body;

        let cart = await Cart.findOne({ userId });
        if(!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
        return res.status(404).json({
            success: false,
            message: "Product not found in cart",
        });
    }
        if (type === "increase") {
            item.quantity += 1;
        }
        if (type === "decrease" && item.quantity > 1) {
            item.quantity -= 1;
        }


        cart.totalPrice = cart.items.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0,
        );
        
        await cart.save();
        cart = await cart.populate("items.productId");

        return res.status(200).json({
            success: true,
            message: "Quantity updated successfully",
            cart,
        });

    }catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating quantity",
            error: error.message,
        });
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.id;
        const { productId } = req.body;

        let cart = await Cart.findOne({ userId });
        if(!cart) {
            return res.status(404).json({
                success:false,
                message:"cart not found"
            })
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId)
        cart.totalPrice = cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
        await cart.save()

        return res.status(200).json({
          success:true,
          message:"item removed from cart",
          cart
        })
    }catch (error) {
        res.status(500).json({
            success: false,
            message: "Error removing from cart",
            error: error.message,
        });
    }
}