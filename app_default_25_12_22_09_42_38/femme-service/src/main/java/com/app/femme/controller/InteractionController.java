package com.app.femme.controller;

import com.app.femme.model.Interaction;
import com.app.femme.service.InteractionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@CrossOrigin(origins = "http://localhost:8087")
@RestController
@RequestMapping("/api/interactions")
public class InteractionController {

    private final InteractionService interactionService;

    public InteractionController(InteractionService interactionService) {
        this.interactionService = interactionService;
    }

    @PostMapping
    public ResponseEntity<Interaction> createInteraction(@RequestBody Interaction interaction) {
        // Validate interaction type
        String type = interaction.getType();
        if (!isValidInteractionType(type)) {
            return ResponseEntity.badRequest().build();
        }
        
        Interaction createdInteraction = interactionService.createInteraction(interaction);
        return ResponseEntity.ok(createdInteraction);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Interaction>> getUserInteractions(@PathVariable Long userId) {
        List<Interaction> interactions = interactionService.getUserInteractions(userId);
        return ResponseEntity.ok(interactions);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Interaction>> getProductInteractions(@PathVariable Long productId) {
        List<Interaction> interactions = interactionService.getProductInteractions(productId);
        return ResponseEntity.ok(interactions);
    }

    private boolean isValidInteractionType(String type) {
        return type != null && 
               (type.equals("ADD_TO_CART") || 
                type.equals("VIEW") || 
                type.equals("PURCHASE"));
    }
}
