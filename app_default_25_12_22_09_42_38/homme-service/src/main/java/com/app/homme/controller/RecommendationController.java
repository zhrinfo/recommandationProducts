package com.app.homme.controller;

import com.app.homme.model.Product;
import com.app.homme.service.RecommendationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin("*")
public class RecommendationController {

    @Autowired
    private RecommendationService recommendationService;
    
    @GetMapping("/homme/user/{userId}")
    public List<Product> getRecommendations(@PathVariable Long userId) {
        return recommendationService.getPersonalizedRecommendations(userId);
    }
}
