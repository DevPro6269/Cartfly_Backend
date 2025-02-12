import Product from "../models/prodcuts.module.js";
import ApiError from "../utilis/ApiError.js";
import ApiRespone from "../utilis/ApiRespone.js";
import Cart from "../models/cart.model.js";

// Function to add a product to the cart
export async function addToCart(req, res) {
  const user = req.user; // Assuming the user is populated via authentication middleware
  const { productId, price } = req.body;
  const quantity = req.body.quantity || 1; // Default quantity is 1 if not provided

  // Check if productId is missing in the request
  if (!productId) {
    return res.status(400).json(new ApiError(400, "Product field is missing"));
  }

  // Find the product by productId in the database
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json(new ApiError(404, "Product not found"));
  }

  // Check if the user already has a cart
  let cart = await Cart.findOne({ owner: user.id });

  if (cart) {
    // If the product is already in the cart, update its quantity
    const existingProduct = cart.items.find(item => item.product.toString() === productId.toString());
    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      // Otherwise, add the product to the cart
      cart.items.push({
        product: productId,
        quantity,
        price
      });
    }

    // Update the totalAmount of the cart
    cart.totalAmount = cart.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
    
    // Save the updated cart
    await cart.save();
    return res.status(200).json(new ApiRespone(200, cart, "Product added to cart"));
  } else {
    // If no cart exists for the user, create a new cart
    const newCart = new Cart({
      owner: user.id,
      items: [{
        product: productId,
        quantity,
        price
      }],
    });

    // Calculate the totalAmount of the new cart
    newCart.totalAmount = newCart.items.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);

    // Save the new cart to the database
    await newCart.save();

    // Link the cart to the user and save the user
    user.cart.push(newCart.id);
    await user.save();

    return res.status(201).json(new ApiRespone(201, newCart, "Cart created and product added"));
  }
}

// Function to update the quantity of a product in the cart
export async function updateQuantity(req, res) {
  const { productId, cartId } = req.params;
  const { quantity } = req.body;
  console.log(productId, cartId);

  const user = req.user;

  // Ensure both productId and cartId are provided in the request
  if (!productId || !cartId)
    return res.status(400).json(new ApiRespone(400, "Please provide all required parameters"));

  // Ensure the quantity is valid
  if (!quantity || quantity <= 0)
    return res.status(400).json(new ApiError(400, "Please provide a correct quantity"));

  // Find the product by productId
  const product = await Product.findById(productId);
  if (!product)
    return res.status(404).json(new ApiError(404, "Product not found"));

  // Find the cart by cartId
  const cart = await Cart.findById(cartId);
  if (!cart) return res.status(404).json(new ApiError(404, "Cart not found"));

  // Ensure the cart belongs to the authenticated user
  if (cart.owner.toString() !== user.id)
    return res.status(400).json(new ApiError(400, "You are not authorized to process this route"));

  // Find the item to update in the cart
  const itemToBeUpdated = cart.items.find(item => item.product.toString() == productId);
  if (!itemToBeUpdated)
    return res.status(404).json(new ApiError(404, "No product in the cart"));

  // Check if the stock is sufficient for the requested quantity
  if (product.stock < quantity) {
    return res.status(400).json(new ApiError(400, `Not enough stock for product ${product.name}`));
  }

  // Update the item's quantity in the cart
  itemToBeUpdated.quantity += quantity;

  // Save the updated cart
  await cart.save();

  return res.status(200).json(new ApiRespone(200, cart, "Cart item quantity updated successfully"));
}

// Function to delete an item from the cart
export async function deleteItemFromCart(req, res) {
  const { productId, cartId } = req.params;
  const user = req.user;

  // Ensure both productId and cartId are provided in the request
  if (!productId || !cartId)
    return res.status(400).json(new ApiRespone(400, "Please provide all required parameters"));

  // Find the product by productId
  const product = await Product.findById(productId);
  if (!product)
    return res.status(404).json(new ApiError(404, "Product not found"));

  // Find the cart by cartId
  const cart = await Cart.findById(cartId);
  if (!cart) return res.status(404).json(new ApiError(404, "Cart not found"));

  // Ensure the cart belongs to the authenticated user
  if (cart.owner.toString() !== user.id)
    return res.status(400).json(new ApiError(400, "You are not authorized to process this route"));

  // Remove the product from the cart's items
  cart.items = cart.items.filter(item => item.product.toString() !== productId);

  // If the cart is empty after removal, reset the totalAmount to 0
  if (cart.items.length === 0) {
    cart.totalAmount = 0;
    await cart.save();
    return res.status(200).json(new ApiRespone(200, cart, "Cart is now empty"));
  }

  // Save the updated cart
  await cart.save();

  return res.status(201).json(new ApiRespone(201, cart, "Item removed from cart"));
}

// Function to get the details of the cart for the authenticated user
export async function getCartDetails(req, res) {
  const user = req.user;
  // Find the user's cart and populate the product details of the cart items
  const cart = await Cart.findOne({ owner: user.id }).populate("items.product");

  // If no cart exists for the user, return a 404 error
  if (!cart) return res.status(404).json(new ApiRespone(404, "User does not have any cart"));

  return res.status(200).json(new ApiRespone(200, cart, "Success"));
}
