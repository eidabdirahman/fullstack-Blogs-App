import Post from "../models/PostModal.js";
import cloudinary from '../Config/cloudinary.js';

const CreatePost = async (req, res) => {
    try {
        const currecntUser = req.user._id;
        const { title, content } = req.body;
        let result;
        if (req.file) {
            let encodedImage = `data:image/jpeg;base64,${req.file.buffer.toString('base64')}`;

            result = await cloudinary.uploader.upload(encodedImage, {
                resource_type: 'image',
                transformation: [{ width: 500, height: 500, crop: 'limit' }],
                encoding: 'base64'
            });
        }
        const post = new Post({
            title,
            content,
            image: result?.url || null,
            author: currecntUser
        });
        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (error) {
        console.log(error);
    }
}

const GetAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate({
            path: 'author',
            select: 'name email',
        }).sort({createdAt: -1});
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const GetPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


const UpdatePost = async (req, res) => {
    try {
        const { title, content } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Update fields
        post.title = title || post.title;
        post.content = content || post.content;

        if (req.file) {
            const encodedImage = `data:image/jpeg;base64,${req.file.buffer.toString('base64')}`;

            const result = await cloudinary.uploader.upload(encodedImage, {
                resource_type: 'image',
                transformation: [{ width: 500, height: 500, crop: 'limit' }],
                encoding: 'base64'
            });
            post.image = result?.url || post.image;
        }

        const updatedPost = await post.save();
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(`Error updating post with ID ${req.params.id}: `, error);
        res.status(500).json({ message: 'Server error' });
    }
};




const DeletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        await Post.deleteOne({ _id: req.params.id }); 
        res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        console.error(`Error deleting post with ID ${req.params.id}: `, error);
        res.status(500).json({ message: 'Server error' });
    }
};



export {
    CreatePost,
    GetAllPosts,
    GetPostById,
    UpdatePost,
    DeletePost
};
