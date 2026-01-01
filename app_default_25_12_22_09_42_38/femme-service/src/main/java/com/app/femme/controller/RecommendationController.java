package com.app.femme.controller;

import com.app.femme.dto.ProductDTO;
import com.app.femme.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin("*")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;

    @GetMapping("/femme/{userId}")
    public List<ProductDTO> getRecommendations(@PathVariable Long userId) {
        return recommendationService.getRecommendations(userId);
    }
    
    @GetMapping("/femme")
    public List<ProductDTO> getRecommendationsWithoutUser() {
        return recommendationService.getRecommendations(null);
    }
}
