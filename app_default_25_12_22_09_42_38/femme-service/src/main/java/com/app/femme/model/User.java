package com.app.femme.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users_local")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String username;
    private String email;
    private String password;
    private String role;
}
