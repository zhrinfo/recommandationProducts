package com.app.homme.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Interaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long userId;
    private Long productId;
    private String type; // ADD_TO_CART, VIEW, PURCHASE
    private LocalDateTime createdAt = LocalDateTime.now();
}
