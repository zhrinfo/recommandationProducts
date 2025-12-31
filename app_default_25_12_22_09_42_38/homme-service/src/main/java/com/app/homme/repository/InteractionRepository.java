package com.app.homme.repository;

import com.app.homme.model.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InteractionRepository extends JpaRepository<Interaction, Long> {
    List<Interaction> findByUserId(Long userId);
    List<Interaction> findByProductId(Long productId);
}
