import mongoose, { Schema } from 'mongoose';

const blogSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  image:{
    type:String
  },
  body:{
    type:String,
    required: true
  },
  createdBy:{
    type:Schema.Types.ObjectId,
    ref:'User'
  }
},{timestamps:true});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;