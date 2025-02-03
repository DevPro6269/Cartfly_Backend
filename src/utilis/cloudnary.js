import { log } from "console";
import cloudinary from "../configaration/cloudinary.config.js"
import fs from 'fs'

const uploadOnCloudinary = async (localFilePath) => {
    try {
        console.log(localFilePath);
        if (!localFilePath) return null
        //upload the file on cloudinary
        
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        fs.unlinkSync(localFilePath)
        return response;

    } catch (error) {
        console.log(error,"errr")
        fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
        return null;
    }
}



export {uploadOnCloudinary}