
import {Schema,model} from "mongoose";

const subCategorySchema = new Schema({
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category"
    },
    subCategory:{
        type:String,
        required:true,
        unique:true
    }
},{
    timestamps:true
})

const SubCategory = model("SubCategory",subCategorySchema);

export default SubCategory;