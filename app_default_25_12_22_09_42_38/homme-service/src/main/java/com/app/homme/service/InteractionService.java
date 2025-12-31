package com.app.homme.service;

import com.app.homme.model.Interaction;
import com.app.homme.repository.InteractionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InteractionService {

    @Autowired
    private InteractionRepository interactionRepository;

    public Interaction saveInteraction(Interaction interaction) {
        return interactionRepository.save(interaction);
    }

    public List<Interaction> getUserInteractions(Long userId) {
        return interactionRepository.findByUserId(userId);
    }

    public List<Interaction> getProductInteractions(Long productId) {
        return interactionRepository.findByProductId(productId);
    }
}
