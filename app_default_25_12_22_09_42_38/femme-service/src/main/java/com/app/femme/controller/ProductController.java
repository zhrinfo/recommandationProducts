package com.app.femme.controller;

import com.app.femme.model.Product;
import com.app.femme.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.Arrays;

@RestController
@RequestMapping("/api/products")
@CrossOrigin("*")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @PostConstruct
    public void init() {
        if (productRepository.count() == 0) {
            productRepository.saveAll(Arrays.asList(
                new Product(null, "Robe d'été Fleurie", 45.00, "Vêtements", "https://images.unsplash.com/photo-1572804013307-a9a111ddae88?w=400"),
                new Product(null, "Sac à main", 120.00, "Accessoires", "https://images.unsplash.com/photo-1584917033794-c735e946b991?w=400"),
                new Product(null, "Escarpins", 75.00, "Chaussures", "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400")
            ));
        }
    }

    @GetMapping
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    @PostMapping
    public Product create(@RequestBody Product product) {
        product.setId(null);
        return productRepository.save(product);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'ID : " + id));
    }
}
