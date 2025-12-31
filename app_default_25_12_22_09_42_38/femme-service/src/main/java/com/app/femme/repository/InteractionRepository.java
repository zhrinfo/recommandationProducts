package com.app.femme.repository;

import com.app.femme.model.Interaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, Long> {
    List<Interaction> findByUserId(Long userId);
    List<Interaction> findByProductId(Long productId);
}
