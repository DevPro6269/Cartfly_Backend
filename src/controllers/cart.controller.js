import Product from "../models/prodcuts.module";
import ApiError from "../utilis/ApiError";
import ApiRespone from "../utilis/ApiRespone";
import Cart from "../models/cart.model.js";

export async function addToCart(req, res) {
  const user = req.user;
  const { items } = req.body;

  if (!items || items.length == 0)
    return res.status(400).json(new ApiError(400, "items field  is missing"));

  let cartitem = [];
  for (let item of items) {
    if (!item.quantity || item.quantity <= 0) {
      return res
        .status(400)
        .json(new ApiError(400, `Invalid quantity for product with id ${id}`));
    }
    const product = await Product.findById(item.id);
    if (!product)
      return res
        .status(404)
        .json(`product is not found with this ${item.id} id`);
    if (product.stock < item.quantity)
      return res
        .status(400)
        .json(new ApiRespone(404, " Product Stock is not avilable"));
    product.stock -= item.quantity;
    await product.save();

    cartitem.push({
      product: product.id,
      quantity: item.quantity,
      price: item.price,
    });
  }

  let iscartExist = await Cart.findOne({ owner: user.id });
  if (iscartExist) {
    iscartExist.items.push(...cartitem);
    await iscartExist.save();
  } else {
    const cart = await Cart.create({
      owner: user.id,
      items: cartitem,
      totalAmount,
    });

    if (!cart)
      return res.status(500).json(new ApiError(500, "internal server error"));

    return res.status(201).json(new ApiRespone(200, cart, "success"));
  }
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
