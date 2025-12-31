package com.app.homme.controller;

import com.app.homme.model.Interaction;
import com.app.homme.service.InteractionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;



@CrossOrigin(origins = "http://localhost:8086")

@RestController
@RequestMapping("/api/interactions")
public class InteractionController {

    @Autowired
    private InteractionService interactionService;

    @PostMapping
    public ResponseEntity<Interaction> createInteraction(@RequestBody Interaction interaction) {
        // Valider le type d'interaction
        if (!isValidInteractionType(interaction.getType())) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(interactionService.saveInteraction(interaction));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Interaction>> getUserInteractions(@PathVariable Long userId) {
        return ResponseEntity.ok(interactionService.getUserInteractions(userId));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<Interaction>> getProductInteractions(@PathVariable Long productId) {
        return ResponseEntity.ok(interactionService.getProductInteractions(productId));
    }

    private boolean isValidInteractionType(String type) {
        return type != null && 
               (type.equals("ADD_TO_CART") || 
                type.equals("VIEW") || 
                type.equals("PURCHASE"));
    }
}
