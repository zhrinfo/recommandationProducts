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

  const fetchUserIdByUsername = async (username, gender) => {
    try {
      const baseUrl = gender === 'FEMALE' 
        ? 'http://localhost:8082/api/users/username' 
        : 'http://localhost:8081/api/users/username';
      
      console.log(`Fetching user ID for ${username} from ${baseUrl}`);
      const response = await fetch(`${baseUrl}/${username}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch user ID:', response.status, errorText);
        throw new Error(`Failed to fetch user ID: ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('User data received:', responseData);
      
      // Handle case where the response is directly the ID (number)
      if (typeof responseData === 'number') {
        return responseData.toString();
      }
      
      // Try different possible ID property names if response is an object
      if (typeof responseData === 'object' && responseData !== null) {
        const userId = responseData.id || responseData.userId || (responseData.data && responseData.data.id);
        if (userId) {
          return userId.toString();
        }
      }
      
      // If we get here, we couldn't find a valid ID
      console.error('No valid user ID found in response:', responseData);
      throw new Error('No valid user ID found in response');
    } catch (error) {
      console.error('Error in fetchUserIdByUsername:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
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

    try {
      // POST request to login API
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.email,
          password: formData.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setErrors({ api: errorData.message || "Erreur de connexion" });
        return;
      }

      // Success: handle login
      const data = await response.json();
      setErrors({});
      
      // Store token if present
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      
      // Store gender if present
      if (data.gender) {
        localStorage.setItem("gender", data.gender);
      }

      // Fetch user ID based on username and gender
      try {
        const userId = await fetchUserIdByUsername(formData.email, data.gender);
        
        // Redirect based on gender to different ports with the fetched user ID
        if (data.gender === "FEMALE") {
          window.location.href = `http://localhost:8087/femme/${userId}`;
        } else if (data.gender === "MALE") {
          window.location.href = `http://localhost:8086/homme/${userId}`;
        } else {
          // fallback, go to home
          navigate("/");
        }
      } catch (error) {
        console.error('Error during user ID fetch or redirect:', error);
        setErrors({ api: "Erreur lors de la récupération des informations utilisateur. Veuillez réessayer." });
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrors({ api: "Une erreur est survenue lors de la connexion. Veuillez réessayer." });
    }
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
