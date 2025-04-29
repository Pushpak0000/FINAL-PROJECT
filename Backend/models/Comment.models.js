import mongoose, {Schema} from "mongoose";

const commentSchema = new mongoose.Schema({
  message:{
    type:String,
    required:true
  },
  blogId:{
    type:Schema.Types.ObjectId,
    ref:'Blog'
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User'
  }
},{timestamps:true});


const Comment = mongoose.model('Comment', commentSchema);
export default Comment;