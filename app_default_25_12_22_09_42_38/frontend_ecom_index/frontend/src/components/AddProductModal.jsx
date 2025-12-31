import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const productTypes = [
  "Accessories set", "Alice band", "Baby Bib", "Backpack", "Bag", "Ballerinas", "Beanie", "Belt",
  "Bikini top", "Blazer", "Blouse", "Bodysuit", "Bootie", "Boots", "Bra", "Bra extender",
  "Bracelet", "Braces", "Bucket hat", "Bumbag", "Cap", "Cap/peaked", "Cardigan", "Chem. cosmetics",
  "Coat", "Costumes", "Cross-body bag", "Cushion", "Dog Wear", "Dress", "Dungarees", "Earring",
  "Earrings", "Eyeglasses", "Felt hat", "Fine cosmetics", "Flat shoe", "Flat shoes", "Flip flop",
  "Garment Set", "Giftbox", "Gloves", "Hair clip", "Hair string", "Hair ties", "Hair/alice band",
  "Hairband", "Hat/beanie", "Hat/brim", "Headband", "Heeled sandals", "Heels", "Hoodie", "Jacket",
  "Jeans", "Jumpsuit/Playsuit", "Kids Underwear top", "Leg warmers", "Leggings/Tights", "Long John",
  "Mobile case", "Moccasins", "Necklace", "Night gown", "Nightwear", "Nipple covers", "Other accessories",
  "Other shoe", "Outdoor overall", "Outdoor trousers", "Outdoor Waistcoat", "Polo shirt", "Pre-walkers",
  "Pumps", "Pyjama bottom", "Pyjama jumpsuit/playsuit", "Pyjama set", "Ring", "Robe", "Sandals",
  "Sarong", "Scarf", "Shirt", "Shorts", "Skirt", "Sleeping sack", "Slippers", "Sneakers", "Socks",
  "Soft Toys", "Straw hat", "Sunglasses", "Sweater", "Sweatshirt", "Swimsuit", "Swimwear bottom",
  "Swimwear set", "Swimwear top", "Tailored Waistcoat", "Tie", "Top", "Toy", "Trousers", "T-shirt",
  "Umbrella", "Underdress", "Underwear", "Underwear body", "Underwear bottom", "Underwear corset",
  "Underwear set", "Underwear Tights", "Unknown", "Vest top", "Wallet", "Watch", "Waterbottle",
  "Wedge", "Weekend/Gym bag", "Wireless earphone case"
];

const productGroups = [
  "Accessories", "Bags", "Cosmetic", "Fun", "Garment Full body", "Garment Lower body",
  "Garment Upper body", "Interior textile", "Nightwear", "Shoes", "Socks & Tights",
  "Sportswear", "Swimwear", "Underwear", "Underwear/nightwear"
];

const AddProductModal = () => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    prod_name: "",
    product_type_name: "",
    product_group_name: "",
    price: "",
    imageUrl: ""
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!formData.prod_name.trim()) {
      newErrors.prod_name = "Le nom du produit est requis";
    }
    if (!formData.product_type_name) {
      newErrors.product_type_name = "Le type de produit est requis";
    }
    if (!formData.product_group_name) {
      newErrors.product_group_name = "Le groupe de produit est requis";
    }
    if (!formData.price || isNaN(Number(formData.price))) {
      newErrors.price = "Le prix est requis et doit être un nombre";
    }
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "L'URL de l'image est requise";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const body = {
      name: formData.prod_name,
      price: Number(formData.price),
      category: formData.product_group_name,
      imageUrl: formData.imageUrl
    };

    try {
      const response = await fetch("http://localhost:8080/api/router/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      if (!response.ok) {
        throw new Error("Erreur lors de l'ajout du produit");
      }
      const data = await response.json();
      const genre = data?.ml_prediction?.recommended_service || "Inconnu";
      const prix = data?.created_product?.price;
      alert(`Produit ajouté avec succès !\nPrix: ${prix} €\nGenre: ${genre}`);
      setFormData({ prod_name: "", product_type_name: "", product_group_name: "", price: "", imageUrl: "" });
      setErrors({});
      setOpen(false);
    } catch (error) {
      alert(error.message || "Erreur inconnue");
    }
  };

  const handleCancel = () => {
    setFormData({ prod_name: "", product_type_name: "", product_group_name: "" });
    setErrors({});
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-xs text-muted-foreground hover:text-foreground transition-colors underline">
          Ajouter un produit
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Ajouter un produit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="prod_name">Nom du produit</Label>
            <Input
              id="prod_name"
              type="text"
              value={formData.prod_name}
              onChange={(e) => setFormData({ ...formData, prod_name: e.target.value })}
              placeholder="Entrez le nom du produit"
              className={errors.prod_name ? "border-destructive" : ""}
            />
            {errors.prod_name && <p className="text-xs text-destructive">{errors.prod_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_type_name">Type de produit</Label>
            <Select
              value={formData.product_type_name}
              onValueChange={(value) => setFormData({ ...formData, product_type_name: value })}
            >
              <SelectTrigger className={errors.product_type_name ? "border-destructive" : ""}>
                <SelectValue placeholder="Sélectionnez un type" />
              </SelectTrigger>
              <SelectContent className="bg-background max-h-60">
                {productTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.product_type_name && <p className="text-xs text-destructive">{errors.product_type_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="product_group_name">Groupe de produit</Label>
            <Select
              value={formData.product_group_name}
              onValueChange={(value) => setFormData({ ...formData, product_group_name: value })}
            >
              <SelectTrigger className={errors.product_group_name ? "border-destructive" : ""}>
                <SelectValue placeholder="Sélectionnez un groupe" />
              </SelectTrigger>
              <SelectContent className="bg-background max-h-60">
                {productGroups.map((group) => (
                  <SelectItem key={group} value={group}>
                    {group}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.product_group_name && <p className="text-xs text-destructive">{errors.product_group_name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Prix (€)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="Entrez le prix"
              className={errors.price ? "border-destructive" : ""}
            />
            {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL de l'image</Label>
            <Input
              id="imageUrl"
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              placeholder="Entrez l'URL de l'image"
              className={errors.imageUrl ? "border-destructive" : ""}
            />
            {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl}</p>}
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Ajouter
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1">
              Annuler
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductModal;
