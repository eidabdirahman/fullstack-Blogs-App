import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "axios";
import toast from "react-hot-toast";

const DailogForm = ({ fetchPosts }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    if (name === "content") setContent(value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post("/api/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setContent("");
      setImage(null);
      setPreview("");
      toast.success("Post created successfully");
      setOpen(false);
      fetchPosts(); // Refresh the list of posts
    } catch (error) {
      console.error("Post operation error", error);
      toast.error(error.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>Create a Post</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new post.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <Label htmlFor="title" className="block text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
                style={{ maxWidth: "100%", maxHeight: "200px" }}
              />
            )}
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Post"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DailogForm;
