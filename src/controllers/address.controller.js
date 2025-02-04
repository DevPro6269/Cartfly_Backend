import ApiError from "../utilis/ApiError";
import User from "../models/user.module.js";
import { addressValidateSchema } from "../../Schema.js";
import Address from "../models/address.model.js";
import ApiResponse from "../utilis/ApiRespone.js";

export async function addNewAddress(req, res) {
  const user = req.user;

  const { error } = addressValidateSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((e) => e.message).join(" ");
    return res.status(400).json(new ApiError(400, errMsg));
  }

  const {
    recipientName,
    streetAddress,
    city,
    state,
    country,
    postalCode,
    phoneNumber,
  } = req.body;

  const address = await Address.create({
    owner: user.id,
    recipientName,
    streetAddress,
    city,
    state,
    country,
    postalCode,
    phoneNumber,
  });

  if (!address)
    return res.status(500).json(new ApiError(500, "failed to create address"));

  return res.status(201).json(new ApiResponse(201, address, "success"));
}

export async function updateAddress(req, res) {
  const { addressId } = req.params;
  const user = req.user;
  if (!addressId)
    return res.status(400).json(new ApiError(400, "please provide address id"));

  const address = await Address.findById(addressId);
  if (!address)
    return res.status(404).json(new ApiError(404, "no address found"));

  if (user.id !== address.owner.toString())
    return res
      .status(403)
      .json(new ApiError(403, "you are not authorized to acces this routes"));

  const {
    recipientName,
    streetAddress,
    city,
    state,
    country,
    postalCode,
    phoneNumber,
  } = req.body;

  const updatedAddress = Address.findByIdAndUpdate(addressId, {
    recipientName,
    state,
    streetAddress,
    city,
    phoneNumber,
    postalCode,
    country,
  },{new:true});

  if (!updatedAddress)
    return res.status(500).json(new ApiError(500, "internal server error"));

  return res
    .status(201)
    .json(201, updateAddress, "address updated succesfully");
}

export async function deleteAddress(req,res) {
    const { addressId } = req.params;
    const user = req.user;
    if (!addressId)
      return res.status(400).json(new ApiError(400, "please provide address id"));
  
    const address = await Address.findById(addressId);
    if (!address)
      return res.status(404).json(new ApiError(404, "no address found"));
  
    if (user.id !== address.owner.toString())
      return res
        .status(403)
        .json(new ApiError(403, "you are not authorized to acces this routes"));

    user.address= user.addresses.filter((add)=>add.toString()!==addressId)  
   await user.save();
   
   const deletedAddress = await Address.findByIdAndDelete(addressId);
    
   if(!deleteAddress)return res.status(500).json(new ApiError(500,"internal server error"))

    return res.status(201).json(new ApiResponse(201,null,"address deleted succesfully"))
}