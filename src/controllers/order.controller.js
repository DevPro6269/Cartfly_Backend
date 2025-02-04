import User from "../models/user.module";
import ApiError from "../utilis/ApiError";
import Address from "../models/address.model.js";
import Product from "../models/prodcuts.module.js";
import Order from "../models/order.model.js";

export async function newOrder(req, res) {
  const { id } = req.user;
  if (!id)
    return res
      .status(400)
      .json(new ApiError(400, "please prove valid user id "));

  const user = await User.findById(id);
  if (!user) return res.status(404).json(new ApiError(404, "user not found"));

  const { AddressId, items } = req.body;
  if (!AddressId)
    return res
      .status(400)
      .json(new ApiError(400, "please provide a valid address"));

  const address = await Address.findById(AddressId);
  if (!address)
    return res.status(404).json(new ApiError(404, "Address not found"));

  if (!items || items.length == 0)
    return res
      .status(400)
      .json(new ApiError(400, "please provide items field"));

  let totalPayment = 0;
  let orderItem = [];

  for (let item of items) {
    let sampleItem = {};
    const product = await Product.findById(item.id);
    if (!product)
      return res.status(404).json(new ApiError(404, "product not found "));
    if (item.quantity > product.stock)
      return res
        .status(400)
        .json(
          new ApiError(400, `Not enough stock for product ${product.name}`)
        );
    product.stock -= item.quantity;
    await product.save();
    sampleItem.product = product.id;
    sampleItem.total = product.price * item.quantity;
    sampleItem.price = item.price;
    orderItem.push(sampleItem);

    totalPayment += sampleItem.total;
  }

  const newOrder = await Order.create({
    owner: user.id,
    items: orderItem,
    totalPayment,
    shippingAddress: address.id,
    paymentStatus: "Completed",
    status: "pending",
  });

  if (!newOrder)
    return res
      .status(500)
      .json(
        new ApiError(500, "internal server error while creating new order")
      );
  return res
    .status(201)
    .json(new ApiRespone(201, newOrder, "order placed successfully"));
}

export async function updateOrder(req, res) {
  const { orderId } = req.params;
  if (!orderId)
    return res.status(400).json(new ApiError(400, "please provide order id "));

  const order = await Order.findById(orderId);
  if (!order)
    return res
      .status(404)
      .json(new ApiError(404, "order not found with this id "));

  const { paymentStatus, status, AddressId } = req.body;

  const shippingAddress = await Address.findById(AddressId);

  if (!shippingAddress)
    return res
      .status(404)
      .json(
        new ApiError(404, `no address found with this ${AddressId} shipping id`)
      );

  const updatedOrder = await Order.findByIdAndUpdate(
    orderId,
    {
      paymentStatus,
      status,
      ...(AddressId && { shippingAddress: AddressId }), // Update address if provided
    },
    { new: true } // Ensure we get the updated order
  );

  if (!updatedOrder)
    return res.status(500).json(new ApiError(500, "internal server error"));
  return res
    .status(201)
    .json(new ApiRespone(201, updatedOrder, "order upadated succesfully"));
}

export async function getOrders(req, res) {
  const { status } = req.params;
  if (!status)
    return res
      .status(400)
      .json(new ApiError(400, "status is missing in parameter"));

  const orders = await Order.find({ status: status });
  if (orders.length == 0)
    return res.status(404).json(new ApiError(404, "Orders not found "));

  return res.status(200).json(new ApiRespone(200, orders, "success"));
}
