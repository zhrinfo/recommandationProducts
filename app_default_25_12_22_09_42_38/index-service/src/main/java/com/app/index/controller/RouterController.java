package com.app.index.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;


import java.util.*;
import java.util.stream.Collectors;



@RestController
@RequestMapping("/api/router")
@CrossOrigin("*")
public class RouterController {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${ml.service.url}")
    private String mlServiceUrl;

    @Value("${homme.service.url}")
    private String hommeServiceUrl;

    @Value("${femme.service.url}")
    private String femmeServiceUrl;

    

    @GetMapping("/products")
    public Object getRecommendedProducts(@RequestParam Long userId) {
        // 1. Call ML Service to get recommendation
        Map<String, Object> mlRequest = new HashMap<>();
        mlRequest.put("userId", userId);
        mlRequest.put("interactionCount", 10); // Simulated count
        Map<String, Object> prediction = restTemplate.postForObject(mlServiceUrl + "/predict", mlRequest, Map.class);
        String targetRaw = prediction != null && prediction.get("recommended_service") != null
                ? prediction.get("recommended_service").toString()
                : "";

        String targetLower = targetRaw.trim().toLowerCase();
        String targetUrl;
        if (targetLower.contains("homme") || targetLower.equals("male") || targetLower.equals("men")) {
            targetUrl = hommeServiceUrl;
        } else if (targetLower.contains("femme") || targetLower.equals("female") || targetLower.equals("women")) {
            targetUrl = femmeServiceUrl;
        } else {
            // default: if unclear (e.g., Unisexe), prefer femme service
            targetUrl = femmeServiceUrl;
        }

        return restTemplate.getForObject(targetUrl + "/api/products", Object.class);
    }

    @PostMapping("/products")
    public ResponseEntity<?> createProductAndRoute(@RequestBody Map<String, Object> product) {
        try {
            String name = product.get("name") != null ? product.get("name").toString() : "";
            String category = product.get("category") != null ? product.get("category").toString() : "";

            Map<String, Object> mlRequest = new HashMap<>();
            mlRequest.put("prod_name", name);
            mlRequest.put("product_type_name", "");
            mlRequest.put("product_group_name", category);
            mlRequest.put("purchase_count", 0);
            mlRequest.put("like_count", 0);
            mlRequest.put("cart_count", 0);

            Map<String, Object> prediction = restTemplate.postForObject(mlServiceUrl + "/predict", mlRequest, Map.class);
            String targetRaw = prediction != null && prediction.get("recommended_service") != null
                    ? prediction.get("recommended_service").toString()
                    : "";

            String targetLower = targetRaw.trim().toLowerCase();

            if (targetLower.contains("unis") || targetLower.contains("uni")) {
                Object probsObj = prediction != null ? prediction.get("probabilities") : null;
                if (probsObj instanceof Map) {
                    Map<?, ?> probs = (Map<?, ?>) probsObj;
                    double hommeP = readProb(probs, "Homme", "HOMME", "male", "men");
                    double femmeP = readProb(probs, "Femme", "FEMME", "female", "women");
                    targetLower = femmeP >= hommeP ? "femme" : "homme";
                }
            }

            String targetUrl;
            if (targetLower.contains("homme") || targetLower.equals("male") || targetLower.equals("men")) {
                targetUrl = hommeServiceUrl;
            } else if (targetLower.contains("femme") || targetLower.equals("female") || targetLower.equals("women")) {
                targetUrl = femmeServiceUrl;
            } else {
                targetUrl = femmeServiceUrl;
            }

            Object created = restTemplate.postForObject(targetUrl + "/api/products", product, Object.class);
            Map<String, Object> resp = new HashMap<>();
            resp.put("routed_to", targetUrl);
            resp.put("ml_prediction", prediction);
            resp.put("created_product", created);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'ajout produit: " + e.getMessage());
        }
    }

    private static double readProb(Map<?, ?> probs, String... keys) {
        for (String k : keys) {
            Object v = probs.get(k);
            if (v instanceof Number) {
                return ((Number) v).doubleValue();
            }
            if (v != null) {
                try {
                    return Double.parseDouble(v.toString());
                } catch (Exception ignored) {
                }
            }
        }
        return 0.0;
    }


    // ========== AGGREGATED PRODUCTS (homme + femme) ==========

   private List<Map<String, Object>> fetchProductsFrom(String baseUrl) {
    try {
        System.out.println("Tentative de récupération des produits depuis : " + baseUrl);
        ResponseEntity<List<Map<String, Object>>> resp = restTemplate.exchange(
                baseUrl + "/api/products",
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<List<Map<String, Object>>>() {}
        );
        System.out.println("Réponse reçue du service, statut : " + resp.getStatusCode());
        return resp.getBody() != null ? resp.getBody() : Collections.emptyList();
    } catch (Exception e) {
        System.err.println("Erreur lors de la récupération des produits depuis " + baseUrl + " : " + e.getMessage());
        e.printStackTrace();
        return Collections.emptyList();
    }
}

    @GetMapping("/products/all")
    public List<Map<String, Object>> getAllProducts() {
        List<Map<String, Object>> merged = new ArrayList<>();
        merged.addAll(fetchProductsFrom(hommeServiceUrl));
        merged.addAll(fetchProductsFrom(femmeServiceUrl));
        return merged;
    }

    @GetMapping("/products/search")
    public List<Map<String, Object>> searchProducts(@RequestParam String q) {
        List<Map<String, Object>> all = getAllProducts();
        if (q == null || q.isBlank()) return all;
        String ql = q.toLowerCase(Locale.ROOT);
        return all.stream()
                .filter(p -> {
                    Object name = p.get("name");
                    return name != null && name.toString().toLowerCase(Locale.ROOT).contains(ql);
                })
                .collect(Collectors.toList());
    }
//homme 80% et 20% femme
@GetMapping("/products/balanced")
public List<Map<String, Object>> getBalancedProducts() {
    List<Map<String, Object>> hommeProducts = fetchProductsFrom(hommeServiceUrl);
    List<Map<String, Object>> femmeProducts = fetchProductsFrom(femmeServiceUrl);
    
    // Trier les produits par ID décroissant (du plus récent au plus ancien)
    hommeProducts.sort((a, b) -> compareProductsById(a, b));
    femmeProducts.sort((a, b) -> compareProductsById(a, b));
    
    // Calculer le nombre de produits à prendre pour chaque catégorie
    int totalDesired = 10; // Nombre total de produits souhaités
    int hommeCount = (int) Math.ceil(totalDesired * 0.8); // 80% d'hommes
    int femmeCount = totalDesired - hommeCount; // 20% de femmes
    
    // Prendre les N premiers produits de chaque catégorie
    List<Map<String, Object>> selectedHomme = hommeProducts.subList(0, Math.min(hommeCount, hommeProducts.size()));
    List<Map<String, Object>> selectedFemme = femmeProducts.subList(0, Math.min(femmeCount, femmeProducts.size()));
    
    // Combiner les listes
    List<Map<String, Object>> result = new ArrayList<>();
    result.addAll(selectedHomme);
    result.addAll(selectedFemme);
    
    // Mélanger légèrement pour ne pas avoir tous les produits homme d'abord
    Collections.shuffle(result);
    
    return result;
}



//80% femme, 20% homme
@GetMapping("/products/balanced-femme")
public List<Map<String, Object>> getBalancedFemmeProducts(
    @RequestParam(defaultValue = "10") int total
) {
    List<Map<String, Object>> hommeProducts = fetchProductsFrom(hommeServiceUrl);
    List<Map<String, Object>> femmeProducts = fetchProductsFrom(femmeServiceUrl);
    
    // Trier les produits par ID décroissant (du plus récent au plus ancien)
    hommeProducts.sort(this::compareProductsById);
    femmeProducts.sort(this::compareProductsById);
    
    // Calculer le nombre de produits à prendre pour chaque catégorie
    int femmeCount = (int) Math.ceil(total * 0.8); // 80% de femmes
    int hommeCount = total - femmeCount; // 20% d'hommes
    
    // Prendre les N premiers produits de chaque catégorie
    List<Map<String, Object>> selectedFemme = femmeProducts.subList(
        0, Math.min(femmeCount, femmeProducts.size()));
    List<Map<String, Object>> selectedHomme = hommeProducts.subList(
        0, Math.min(hommeCount, hommeProducts.size()));
    
    // Combiner les listes
    List<Map<String, Object>> result = new ArrayList<>();
    result.addAll(selectedFemme);
    result.addAll(selectedHomme);
    
    // Mélanger légèrement pour ne pas avoir tous les produits femme d'abord
    Collections.shuffle(result);
    
    return result;
}

// Méthode utilitaire pour comparer les produits par ID
private int compareProductsById(Map<String, Object> a, Map<String, Object> b) {
    Long idA = a.get("id") != null ? Long.parseLong(a.get("id").toString()) : 0L;
    Long idB = b.get("id") != null ? Long.parseLong(b.get("id").toString()) : 0L;
    return idB.compareTo(idA); // Ordre décroissant
}
  
@GetMapping("/products/featured")
    public List<Map<String, Object>> getFeaturedProducts() {
        List<Map<String, Object>> hommeProducts = fetchProductsFrom(hommeServiceUrl);
        List<Map<String, Object>> femmeProducts = fetchProductsFrom(femmeServiceUrl);
        
        // Combine all products and sort by ID descending to get newest first
        List<Map<String, Object>> allProducts = new ArrayList<>();
        allProducts.addAll(hommeProducts);
        allProducts.addAll(femmeProducts);
        allProducts.sort((a, b) -> {
            Long idA = a.get("id") != null ? Long.parseLong(a.get("id").toString()) : 0L;
            Long idB = b.get("id") != null ? Long.parseLong(b.get("id").toString()) : 0L;
            return idB.compareTo(idA); // Descending order (newest first)
        });
        
        // Get 20% newest products from combined list
        int newCount = (int) Math.ceil(allProducts.size() * 0.20);
        List<Map<String, Object>> newProducts = allProducts.subList(0, Math.min(newCount, allProducts.size()));
        
        // Get 40% from homme-service
        int hommeCount = (int) Math.ceil(hommeProducts.size() * 0.40);
        List<Map<String, Object>> hommeSelection = hommeProducts.subList(0, Math.min(hommeCount, hommeProducts.size()));
        
        // Get 40% from femme-service
        int femmeCount = (int) Math.ceil(femmeProducts.size() * 0.40);
        List<Map<String, Object>> femmeSelection = femmeProducts.subList(0, Math.min(femmeCount, femmeProducts.size()));
        
        // Combine all selections (using Set to avoid duplicates)
        Set<Object> addedIds = new HashSet<>();
        List<Map<String, Object>> featured = new ArrayList<>();
        
        // Add new products first
        for (Map<String, Object> p : newProducts) {
            Object id = p.get("id");
            if (id != null && addedIds.add(id)) {
                featured.add(p);
            }
        }
        
        // Add homme products
        for (Map<String, Object> p : hommeSelection) {
            Object id = p.get("id");
            if (id != null && addedIds.add(id)) {
                featured.add(p);
            }
        }
        
        // Add femme products
        for (Map<String, Object> p : femmeSelection) {
            Object id = p.get("id");
            if (id != null && addedIds.add(id)) {
                featured.add(p);
            }
        }
        
        return featured;
    }
}
