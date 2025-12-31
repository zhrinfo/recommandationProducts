import { Facebook, Instagram, Twitter } from "lucide-react";

const HommeFooter = ({ language }) => {
  const texts = {
    fr: {
      newsletter: "Recevez 10% sur votre première commande",
      newsletterSub: "Inscrivez-vous pour des offres exclusives et des nouveautés.",
      email: "Entrez votre email",
      subscribe: "S'inscrire",
      help: "Aide & Info",
      helpLinks: ["Aide & FAQ", "Suivre ma commande", "Livraison & Retours", "Contactez-nous"],
      about: "À propos de NEXUS",
      aboutLinks: ["À propos", "Carrières", "Responsabilité", "Investisseurs"],
      more: "Plus de NEXUS",
      moreLinks: ["Application Mobile", "Cartes Cadeaux", "Réduction Étudiant", "Parrainage"],
      connect: "Suivez-nous",
      copyright: "© 2024 NEXUS. Tous droits réservés."
    },
    en: {
      newsletter: "Get 10% off your first order",
      newsletterSub: "Sign up for exclusive offers, news, and more.",
      email: "Enter your email",
      subscribe: "Subscribe",
      help: "Help & Info",
      helpLinks: ["Help & FAQs", "Track Order", "Delivery & Returns", "Contact Us"],
      about: "About NEXUS",
      aboutLinks: ["About Us", "Careers", "Corporate Responsibility", "Investors"],
      more: "More NEXUS",
      moreLinks: ["Mobile App", "Gift Cards", "Student Discount", "Refer a Friend"],
      connect: "Connect",
      copyright: "© 2024 NEXUS. All rights reserved."
    }
  };

  const t = texts[language];

  return (
    <footer className="bg-secondary mt-16">
      {/* Newsletter */}
      <div className="bg-foreground text-background py-8">
        <div className="container text-center">
          <h3 className="font-display text-xl md:text-2xl mb-2">{t.newsletter}</h3>
          <p className="text-sm opacity-80 mb-4">{t.newsletterSub}</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input 
              type="email" 
              placeholder={t.email}
              className="flex-1 px-4 py-3 bg-background/10 border border-background/20 text-background placeholder:text-background/60 text-sm"
            />
            <button className="px-6 py-3 bg-background text-foreground text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity">
              {t.subscribe}
            </button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide mb-4">{t.help}</h4>
            <ul className="space-y-2">
              {t.helpLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide mb-4">{t.about}</h4>
            <ul className="space-y-2">
              {t.aboutLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide mb-4">{t.more}</h4>
            <ul className="space-y-2">
              {t.moreLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide mb-4">{t.connect}</h4>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border py-6">
        <div className="container text-center text-xs text-muted-foreground">
          {t.copyright}
        </div>
      </div>
    </footer>
  );
};

export default HommeFooter;
