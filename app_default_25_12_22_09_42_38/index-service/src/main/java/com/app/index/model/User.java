package com.app.index.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "users", 
       uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true)
    private String username;
    private String password;
    @Column(nullable = false)
    private String email;
    private String role; // ROLE_USER
    
    @Enumerated(EnumType.STRING)
    private Gender sex;
}
