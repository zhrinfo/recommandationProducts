package com.app.homme.controller;

import com.app.homme.model.User;
import com.app.homme.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.mindrot.jbcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("*")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Homme service is running");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            logger.info("Tentative d'enregistrement pour l'utilisateur homme: {}", user.getUsername());
            
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Ce nom d'utilisateur est déjà utilisé");
            }
            
            user.setPassword(BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()));
            user.setRole("ROLE_USER");
            User savedUser = userRepository.save(user);
            logger.info("Utilisateur homme enregistré avec succès: {}", savedUser.getUsername());
            
            return ResponseEntity.ok(savedUser);
        } catch (Exception e) {
            logger.error("Erreur lors de l'enregistrement", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Une erreur est survenue lors de l'enregistrement: " + e.getMessage());
        }
    }
     @GetMapping("/username/{username}")
    public ResponseEntity<?> getUserIdByUsername(@PathVariable String username) {
        try {
            logger.info("Recherche de l'ID pour l'utilisateur: {}", username);
            
            Optional<User> userOpt = userRepository.findByUsername(username);
            if (userOpt.isPresent()) {
                return ResponseEntity.ok(userOpt.get().getId());
            } else {
                logger.warn("Utilisateur non trouvé: {}", username);
                Map<String, String> response = new HashMap<>();
                response.put("message", "Utilisateur non trouvé avec le nom: " + username);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            logger.error("Erreur lors de la recherche de l'utilisateur: " + username, e);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Une erreur est survenue lors de la recherche de l'utilisateur: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
