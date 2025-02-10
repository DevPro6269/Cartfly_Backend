import Product from "../models/prodcuts.module.js";
import ApiError from "../utilis/ApiError.js";
import ApiRespone from "../utilis/ApiRespone.js";
import Cart from "../models/cart.model.js";

export async function addToCart(req, res) {
  const user = req.user;
  const { items } = req.body;

  // Check if items array is missing or empty
  if (!items || items.length == 0)
    return res.status(400).json(new ApiError(400, "items field is missing"));

  let cartitem = [];
  let totalAmount = 0; // Initialize total amount to 0

  // Iterate over each item in the cart
  for (let item of items) {
    // Check if quantity is valid
    if (!item.quantity || item.quantity <= 0) {
      return res
        .status(400)
        .json(new ApiError(400, `Invalid quantity for product with id ${item.id}`));
    }

    // Fetch the product by its ID
    const product = await Product.findById(item.id);
    if (!product)
      return res
        .status(400)
        .json(new ApiError(400, `Product not found with this ID ${item.id}`));

    // Check if the product stock is sufficient
    if (product.stock < item.quantity)
      return res
        .status(400)
        .json(new ApiError(400, "Product stock is not available"));

    // Deduct the quantity from the product stock
    product.stock -= item.quantity;
    await product.save();

    // Calculate the price for the item
    const itemTotalPrice = item.price * item.quantity;
    totalAmount += itemTotalPrice;

    // Add the item to the cart items
    cartitem.push({
      product: product.id,
      quantity: item.quantity,
      price: item.price,
    });
  }

  // Check if the user already has a cart
  let iscartExist = await Cart.findOne({ owner: user.id });
  if (iscartExist) {
    // Add new items to the existing cart
    iscartExist.items.push(...cartitem);
    iscartExist.totalAmount += totalAmount; // Update the total amount
    await iscartExist.save();
  } else {
    // Create a new cart
    const cart = await Cart.create({
      owner: user.id,
      items: cartitem,
      totalAmount: totalAmount, // Set the total amount
    });

    if (!cart)
      return res.status(500).json(new ApiError(500, "Internal server error"));

    // Add the cart to the user's cart list
    user.cart.push(cart.id);
    await user.save();

    return res.status(201).json(new ApiRespone(200, cart, "Success"));
  }

  return res.status(200).json(new ApiRespone(200, iscartExist, "Success"));
}


export async function updateQuantity(req, res) {
  const { productId, cartId } = req.params;
  const { quantity } = req.body;
  const user = req.user;
  if (!productId || !cartId)
    return res
      .status(400)
      .json(new ApiRespone(400, "please provide  all required parameters"));
  if (!quantity || quantity <= 0)
    return res
      .status(400)
      .json(new ApiError(400, "please provide correct quantity"));
  const product = await Product.findById(productId);
  if (!product)
    return res.status(404).json(new ApiError(404, "Product not found"));

  const cart = await Cart.findById(cartId);
  if (!cart) return res.status(404).json(new ApiError(404, "Cart not found"));

  if (cart.owner.toString() !== user.id)
    return res
      .status(400)
      .json(new ApiError(400, "you are not authorized to process this route"));

  const itemToBeUpdated = cart.items.find(
    (item) => item.product.toString() == productId
  );
  if (!itemToBeUpdated)
    return res.status(404).json(new ApiError(404, "no prodcut in the cart"));
  if (product.stock < quantity) {
    return res
      .status(400)
      .json(new ApiError(400, `Not enough stock for product ${product.name}`));
  }
  itemToBeUpdated.quantity = quantity;

  await cart.save();
  return res
    .status(200)
    .json(new ApiRespone(200, cart, "Cart item quantity updated successfully"));
}

export async function deleteItemFromCart(req, res) {
  const { productId, cartId } = req.params;
  const user = req.user;
  if (!productId || !cartId)
    return res
      .status(400)
      .json(new ApiRespone(400, "please provide  all required parameters"));

  const product = await Product.findById(productId);
  if (!product)
    return res.status(404).json(new ApiError(404, "Product not found"));

  const cart = await Cart.findById(cartId);
  if (!cart) return res.status(404).json(new ApiError(404, "Cart not found"));

  if (cart.owner.toString() !== user.id)
    return res
      .status(400)
      .json(new ApiError(400, "you are not authorized to process this route"));

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  if (cart.items.length === 0) {
    cart.totalAmount = 0;
    await cart.save();
    return res.status(200).json(new ApiRespone(200, cart, "Cart is now empty"));
  }

  await cart.save();

  return res
    .status(201)
    .json(new ApiRespone(201, cart, "item removed from cart"));
}

export async function getCartDetails(req,res){
    const user = req.user;

    const cart = await Cart.findOne({owner:user.id}).populate("items.product");
    if(!cart)return res.status(404).json(new ApiRespone(404,"user does not have any cart"));

   return res.status(200).json(new ApiRespone(200,cart,"success"))

}