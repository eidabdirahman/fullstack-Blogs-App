import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader } from "lucide-react";

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/posts/${id}`);
        setPost(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <p className="text-center text-gray-500"><Loader className="inline-block mr-2 animate-spin" /> Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!post) {
    return <p className="text-center">Post not found</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12">
          <div className="md:col-span-4">
            {post.image && (
              <img src={post.image} alt={post.title} className="w-full h-auto object-cover mb-4 rounded" />
            )}
          </div>
          <div className="md:col-span-8 p-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold mb-4">{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4 text-gray-700">{post.content}</CardDescription>
              <CardDescription className="text-sm text-gray-600">Author: {post.author.name}</CardDescription>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Post;
