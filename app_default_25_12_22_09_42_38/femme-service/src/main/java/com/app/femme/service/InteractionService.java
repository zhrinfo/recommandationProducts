package com.app.femme.service;

import com.app.femme.model.Interaction;
import com.app.femme.repository.InteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InteractionService {

    private final InteractionRepository interactionRepository;

    public InteractionService(InteractionRepository interactionRepository) {
        this.interactionRepository = interactionRepository;
    }

    public Interaction createInteraction(Interaction interaction) {
        // You can add validation here if needed
        return interactionRepository.save(interaction);
    }

    public List<Interaction> getUserInteractions(Long userId) {
        return interactionRepository.findByUserId(userId);
    }

    public List<Interaction> getProductInteractions(Long productId) {
        return interactionRepository.findByProductId(productId);
    }
}
