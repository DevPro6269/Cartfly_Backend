import multer from "multer";

const storage = multer.diskStorage({
    destination:(req,res,cb)=>{
        cb(null, 'uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const upload = multer(
    {storage}
)

export default upload;