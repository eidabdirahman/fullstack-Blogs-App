import { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { UseUser } from "@/hooks/useUser"; 
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user } = UseUser();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleInputChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post('/api/users/register', formData);
      console.log(data);
      toast.success("User registered successfully");
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Fill in the details to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <Label htmlFor="name" className="block text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="mt-1 block w-full"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="email" className="block text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password" className="block text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 block w-full"
                placeholder="Enter your password"
              />
            </div>
            <Button className="w-full">{loading ? "registering..." : "register"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
