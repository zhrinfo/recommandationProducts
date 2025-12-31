package com.app.homme.controller;

import com.app.homme.model.Product;
import com.app.homme.repository.ProductRepository;
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
                new Product(null, "Costume Homme Slim", 299.99, "Vêtements", "https://images.unsplash.com/photo-1594932224828-b4b059b6f684?w=400"),
                new Product(null, "Montre Luxe", 150.00, "Accessoires", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"),
                new Product(null, "Chaussures Cuir", 89.00, "Chaussures", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400")
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
            .orElseThrow(() -> new RuntimeException("Produit non trouvé avec l'id: " + id));
    }
}
