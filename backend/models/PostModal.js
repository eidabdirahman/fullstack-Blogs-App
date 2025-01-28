import mongoose from "mongoose";
const { Schema } = mongoose; // Corrected destructuring

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        return value.length <= 500;
      },
      message: 'Content should be up to 500 characters long',
    },
  },
  image: {
    type: String,
    default: null,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Post = mongoose.model('Post', postSchema);
export default Post;
