import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    help: ["Help & FAQs", "Track Order", "Delivery & Returns", "Contact Us"],
    about: ["About MODO", "Careers", "Corporate Responsibility", "Investors"],
    more: ["Mobile App", "Gift Cards", "Student Discount", "Refer a Friend"],
  };

  return (
    <footer className="bg-secondary mt-16">
      {/* Newsletter */}
      <div className="bg-foreground text-background py-8">
        <div className="container text-center">
          <h3 className="font-display text-xl md:text-2xl mb-2">Get 10% off your first order</h3>
          <p className="text-sm opacity-80 mb-4">Sign up for exclusive offers, news, and more.</p>
          <div className="flex max-w-md mx-auto gap-2">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-background/10 border border-background/20 text-background placeholder:text-background/60 text-sm"
            />
            <button className="px-6 py-3 bg-background text-foreground text-sm font-bold uppercase tracking-wide hover:opacity-90 transition-opacity">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide mb-4">Help & Info</h4>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide mb-4">About MODO</h4>
            <ul className="space-y-2">
              {footerLinks.about.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide mb-4">More MODO</h4>
            <ul className="space-y-2">
              {footerLinks.more.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wide mb-4">Connect</h4>
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
          © 2024 MODO. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
