import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import DailogForm from "@/components/Dailog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Loader } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts/');
      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setTitle(post.title);
    setContent(post.content);
    setPreview(post.image);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setIsDeleteOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdatePost = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.put(`/api/posts/${selectedPost._id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Post updated successfully');
      setIsEditOpen(false);
      setSelectedPost(null);
      setTitle('');
      setContent('');
      setImage(null);
      setPreview('');
      fetchPosts();
    } catch (error) {
      console.error('Update operation error', error);
      toast.error(error.response?.data?.message || 'Failed to update post');
    }
  };

  const handleDeletePost = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(`/api/posts/${selectedPost._id}`);
      toast.success('Post deleted successfully');
      setIsDeleteOpen(false);
      setSelectedPost(null);
      fetchPosts();
    } catch (error) {
      console.error('Delete operation error', error);
      toast.error(error.response?.data?.message || 'Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <DailogForm fetchPosts={fetchPosts} />
      {loading && <p className="text-center text-gray-500"><Loader className="inline-block mr-2 animate-spin" /> Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {posts.map(post => (
          <Card key={post._id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <CardHeader className="p-4 bg-gray-100">
            <CardTitle className="text-lg font-bold">
               {post.title}
              </CardTitle>
            </CardHeader> 
            <CardContent className="p-4">
            <Link to={`/post/${post._id}`}> 
              {post.image && (
                <img src={post.image} alt={post.title} className="w-full h-48 object-cover mb-4"/>
              )}
              <CardDescription className="mb-2">{post.content}</CardDescription>
              <CardDescription className="text-sm text-gray-600">Author: {post.author.name}</CardDescription>
              </Link>
            </CardContent>
              <div className="flex justify-end space-x-2 mt-4">
                <Button variant="primary" onClick={() => handleEditClick(post)}>
                  <Pencil className="w-4 h-4 mr-1 text-green-600"/> 
                </Button>
                <Button variant="danger" onClick={() => handleDeleteClick(post)}>
                  <Trash className="w-4 h-4 mr-1 text-red-600"/> 
                </Button>
              </div>
            <CardFooter>

            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedPost && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
              <DialogDescription>
                Update the details of your post.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdatePost}>
              <div className="mb-4">
                <Label htmlFor="title" className="block text-sm font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 block w-full"
                  placeholder="Enter post title"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="content" className="block text-sm font-medium">
                  Content
                </Label>
                <Input
                  id="content"
                  name="content"
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-1 block w-full"
                  placeholder="Enter post content"
                />
              </div>
              <div className="mb-4">
                <Label htmlFor="image" className="block text-sm font-medium">
                  Image
                </Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  onChange={handleImageChange}
                  className="mt-1 block w-full"
                  accept="image/*"
                />
                {preview && (
                  <img
                    src={preview}
                    alt="Image Preview"
                    className="mt-2"
                    style={{ maxWidth: '100%', maxHeight: '200px' }}
                  />
                )}
              </div>
              <Button type="submit" className="text-green-400">
                Update Post
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {selectedPost && (
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Post</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this post?
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="secondary" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
              <Button variant="danger" onClick={handleDeletePost} disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : <><Trash className="w-4 h-4 mr-1 text-red-600" /> Delete</>}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Posts;
