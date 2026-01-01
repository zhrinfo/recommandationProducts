package com.app.femme.repository;

import com.app.femme.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findTop10ByOrderByIdDesc();
}
