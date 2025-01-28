import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { UseUser } from "@/hooks/useUser"; 

const Login = () => {
  const navigate = useNavigate();
  const { login, user } = UseUser();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

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
      const { data } = await axios.post('/api/users/login', formData);
      console.log(data);
      toast.success("User logged in successfully");
      login(data, data.expiresIn);
      navigate('/');
      setFormData({
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
          <CardTitle>Login</CardTitle>
          <CardDescription>Fill in the details to log in</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleFormSubmit}>
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
            <Button className="w-full">{loading ? "logging in..." : "login"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
