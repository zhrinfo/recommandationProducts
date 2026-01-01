package com.app.homme.service;

import com.app.homme.model.Product;
import com.app.homme.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecommendationService {

    @Autowired
    private ProductRepository productRepository;
    
    @Value("${recommendation.service.url}")
    private String recommendationServiceUrl;
    
    @Autowired
    private RestTemplate restTemplate;
    
    public List<Product> getPersonalizedRecommendations(Long userId) {
        // Get homme products (50%)
        List<Product> hommeProducts = productRepository.findAll();
        int hommeCount = (int) Math.ceil(hommeProducts.size() * 0.5);
        Collections.shuffle(hommeProducts);
        List<Product> selectedHomme = hommeProducts.stream().limit(hommeCount).collect(Collectors.toList());
        
        // Get femme products (10%)
        List<Product> femmeProducts = getFemmeProducts();
        int femmeCount = (int) Math.ceil(femmeProducts.size() * 0.1);
        Collections.shuffle(femmeProducts);
        List<Product> selectedFemme = femmeProducts.stream().limit(femmeCount).collect(Collectors.toList());
        
        // Get new products (20%)
        List<Product> newProducts = getNewProducts();
        int newCount = (int) Math.ceil(newProducts.size() * 0.2);
        Collections.shuffle(newProducts);
        List<Product> selectedNew = newProducts.stream().limit(newCount).collect(Collectors.toList());
        
        // Get recommendations from recommendation service (20%)
        List<Product> recommendedProducts = getRecommendedProducts(userId);
        int recommendedCount = (int) Math.ceil(recommendedProducts.size() * 0.2);
        Collections.shuffle(recommendedProducts);
        List<Product> selectedRecommended = recommendedProducts.stream().limit(recommendedCount).collect(Collectors.toList());
        
        // Combine all products and remove duplicates
        Set<Product> combined = new HashSet<>();
        combined.addAll(selectedHomme);
        combined.addAll(selectedFemme);
        combined.addAll(selectedNew);
        combined.addAll(selectedRecommended);
        
        return new ArrayList<>(combined);
    }
    
    private List<Product> getFemmeProducts() {
        try {
            String url = "http://localhost:8082/api/products";
            Product[] products = restTemplate.getForObject(url, Product[].class);
            return products != null ? Arrays.asList(products) : Collections.emptyList();
        } catch (Exception e) {
            // Log error and return empty list if femme service is not available
            return Collections.emptyList();
        }
    }
    
    private List<Product> getNewProducts() {
        // Get all products and sort by creation date (newest first)
        // For simplicity, we'll just return a random selection of products
        List<Product> allProducts = productRepository.findAll();
        Collections.shuffle(allProducts);
        return allProducts.stream()
                .limit(Math.min(10, allProducts.size()))
                .collect(Collectors.toList());
    }
    
    private List<Product> getRecommendedProducts(Long userId) {
        try {
            String url = String.format("%s/api/recommendations/homme/user/%d", recommendationServiceUrl, userId);
            Product[] products = restTemplate.getForObject(url, Product[].class);
            return products != null ? Arrays.asList(products) : Collections.emptyList();
        } catch (Exception e) {
            // Log error and return empty list if recommendation service is not available
            return Collections.emptyList();
        }
    }
}
