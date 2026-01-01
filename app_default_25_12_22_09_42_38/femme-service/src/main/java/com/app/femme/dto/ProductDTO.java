package com.app.femme.dto;

import lombok.Data;

@Data
public class ProductDTO {
    private Long id;
    private String name;
    private Double price;
    private String category;
    private String imageUrl;
    
    // Constructeur par défaut pour la désérialisation
    public ProductDTO() {}
    
    public ProductDTO(Long id, String name, Double price, String category, String imageUrl) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.category = category;
        this.imageUrl = imageUrl;
    }
}
