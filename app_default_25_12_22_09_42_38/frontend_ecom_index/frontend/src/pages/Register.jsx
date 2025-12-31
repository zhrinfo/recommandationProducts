import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, X } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    sex: "MALE" // Valeur par défaut, peut être "FEMALE"
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    // Validation du nom d'utilisateur (lettres uniquement)
    if (!formData.username.trim()) {
      newErrors.username = "Le nom d'utilisateur est requis";
    } else if (!/^[a-zA-ZÀ-ÿ\s]+$/.test(formData.username)) {
      newErrors.username = "Le nom d'utilisateur ne doit contenir que des lettres";
    }
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }
    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis";
    } else if (formData.password.length < 6) {
      newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }
    // No confirmPassword validation

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Appel API d'inscription
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          sex: formData.sex
        })
      });
      const data = await response.json();
      if (response.ok) {
        // Succès, rediriger vers la page de login
        navigate("/login");
      } else {
        // Afficher l'erreur retournée par l'API
        setErrorMessage(data.message || "Erreur lors de l'inscription");
      }
    } catch (error) {
      setErrorMessage("email ou nom d'utilisateur déjà utilisé");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-3xl font-bold tracking-tight">
            NEXUS
          </Link>
          <h1 className="font-display text-xl mt-6 mb-2">Créer un compte</h1>
          <p className="text-sm text-muted-foreground">
            Rejoignez-nous pour une expérience shopping unique
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <Alert variant="destructive" className="relative">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
              <button
                type="button"
                onClick={() => setErrorMessage("")}
                className="absolute top-2 right-2 p-1 hover:opacity-70 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </Alert>
          )}
                   

          <div className="space-y-2">
            <Label htmlFor="username">Nom d'utilisateur</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => {
                // Filtrer les chiffres, garder uniquement les lettres et espaces
                const value = e.target.value.replace(/[0-9]/g, "");
                setFormData({ ...formData, username: value });
              }}
              placeholder="Votre nom d'utilisateur"
              className={errors.username ? "border-destructive" : ""}
            />
            {errors.username && <p className="text-xs text-destructive">{errors.username}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="votre@email.com"
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>
             <div className="space-y-2">
                      <Label htmlFor="sex">Genre</Label>
                      <select
                        id="sex"
                        value={formData.sex}
                        onChange={e => setFormData({ ...formData, sex: e.target.value })}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="MALE">Homme</option>
                        <option value="FEMALE">Femme</option>
                      </select>
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


          {/* confirmPassword field removed */}

          <Button type="submit" className="w-full mt-6">
            Créer un compte
          </Button>
        </form>

        <p className="text-center mt-6 text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link to="/login" className="text-foreground underline hover:opacity-70 transition-opacity">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
