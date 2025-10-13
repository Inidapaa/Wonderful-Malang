import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "../../supabase-client";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);

    if (error) return setError(error.message);

    navigate("/dashboard");
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Login sebagai admin</CardTitle>
        <CardDescription>Isilah email dan password di bawah</CardDescription>
        {error && (
          <p className="error text-red-500 text-lg text-center">
            Masukkan email dan password dengan benar
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="emailkamu@gmail.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <CardFooter className="mt-5">
            <Button
              type="submit"
              className="w-full bg-blue-400 hover:bg-blue-500"
              disabled={loading}
            >
              {loading ? "Tunggu..." : "Login"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default Login;
