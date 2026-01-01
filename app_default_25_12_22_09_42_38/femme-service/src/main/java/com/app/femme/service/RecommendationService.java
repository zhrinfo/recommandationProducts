package com.app.femme.service;

import com.app.femme.dto.ProductDTO;
import com.app.femme.model.Product;
import com.app.femme.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private ProductRepository productRepository;
    
    private final WebClient webClientHomme;
    private final WebClient webClientRecommandation;

    public RecommendationService() {
        this.webClientHomme = WebClient.create("http://localhost:8081");
        this.webClientRecommandation = WebClient.create("http://localhost:4000");
    }

    public List<ProductDTO> getRecommendations(Long userId) {
        List<ProductDTO> allProducts = new ArrayList<>();
        
        // 1. Récupérer 10% de produits homme
        List<ProductDTO> hommeProducts = getHommeProducts();
        int hommeCount = Math.max(1, (int) (hommeProducts.size() * 0.1));
        Collections.shuffle(hommeProducts);
        allProducts.addAll(hommeProducts.subList(0, Math.min(hommeCount, hommeProducts.size())));
        
        // 2. Récupérer 50% de produits femme
        List<ProductDTO> femmeProducts = getFemmeProducts();
        int femmeCount = Math.max(1, (int) (femmeProducts.size() * 0.5));
        Collections.shuffle(femmeProducts);
        allProducts.addAll(femmeProducts.subList(0, Math.min(femmeCount, femmeProducts.size())));
        
        // 3. Récupérer 20% des nouveaux produits femme
        List<ProductDTO> newFemmeProducts = getNewFemmeProducts();
        int newCount = Math.max(1, (int) (newFemmeProducts.size() * 0.2));
        allProducts.addAll(newFemmeProducts.subList(0, Math.min(newCount, newFemmeProducts.size())));
        
        // 4. Récupérer 20% des recommandations personnalisées
        if (userId != null) {
            List<ProductDTO> recommendedProducts = getPersonalizedRecommendations(userId);
            int recommendedCount = Math.max(1, (int) (recommendedProducts.size() * 0.2));
            allProducts.addAll(recommendedProducts.subList(0, Math.min(recommendedCount, recommendedProducts.size())));
        }
        
        // Mélanger la liste finale pour un meilleur mélange des sources
        Collections.shuffle(allProducts);
        return allProducts;
    }
    
    private List<ProductDTO> getHommeProducts() {
        try {
            ProductDTO[] products = webClientHomme.get()
                .uri("/api/products")
                .retrieve()
                .bodyToMono(ProductDTO[].class)
                .block();
            return products != null ? Arrays.asList(products) : Collections.emptyList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
    
    private List<ProductDTO> getFemmeProducts() {
        return productRepository.findAll().stream()
            .map(p -> new ProductDTO(p.getId(), p.getName(), p.getPrice(), p.getCategory(), p.getImageUrl()))
            .collect(Collectors.toList());
    }
    
    private List<ProductDTO> getNewFemmeProducts() {
        // Récupère les 10 derniers produits ajoutés
        List<Product> latestProducts = productRepository.findTop10ByOrderByIdDesc();
        return latestProducts.stream()
            .map(p -> new ProductDTO(p.getId(), p.getName(), p.getPrice(), p.getCategory(), p.getImageUrl()))
            .collect(Collectors.toList());
    }
    
    private List<ProductDTO> getPersonalizedRecommendations(Long userId) {
        try {
            ProductDTO[] products = webClientRecommandation.get()
                .uri("/api/recommendations/femme/" + userId)
                .retrieve()
                .bodyToMono(ProductDTO[].class)
                .block();
            return products != null ? Arrays.asList(products) : Collections.emptyList();
        } catch (Exception e) {
            return Collections.emptyList();
        }
    }
}
