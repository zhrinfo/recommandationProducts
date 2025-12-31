import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Login = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Le nom d'utilisateur est requis";
    }
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // POST request to login API
    fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: formData.email,
        password: formData.password
      })
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          setErrors({ api: errorData.message || "Erreur de connexion" });
          return;
        }
        // Success: handle login (e.g., redirect, store token, etc.)
        const data = await response.json();
        setErrors({});
        // Stocke le token si présent
        if (data.token) {
          localStorage.setItem("token", data.token);
        }
        // Stocke le gender si présent
        if (data.gender) {
          localStorage.setItem("gender", data.gender);
        }
        // Redirect based on gender to different ports
        if (data.gender === "FEMALE") {
          window.location.href = `http://localhost:8087/femme/${data.userId}`;
        } else if (data.gender === "MALE") {
          window.location.href = `http://localhost:8086/homme/${data.userId}`;
        } else {
          // fallback, go to home
          navigate("/");
        }
      })
      .catch(() => {
        setErrors({ api: "Erreur réseau. Veuillez réessayer." });
      });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl font-bold tracking-tight">
            NEXUS
          </Link>
          <h1 className="font-display text-xl mt-6 mb-2">Connexion</h1>
          <p className="text-sm text-muted-foreground">
            Connectez-vous à votre compte
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.api && (
                      <p className="text-xs text-destructive text-center">{errors.api}</p>
                    )}
          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              type="text"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="Votre nom d'utilisateur"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
          </div>

          <Button type="submit" className="w-full mt-6">
            Se connecter
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Vous n'avez pas de compte ?{" "}
          <Link to="/register" className="text-foreground underline hover:opacity-70 transition-opacity">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
