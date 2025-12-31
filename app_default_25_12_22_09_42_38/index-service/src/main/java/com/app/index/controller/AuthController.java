package com.app.index.controller;

import com.app.index.model.User;
import com.app.index.repository.UserRepository;
import com.app.index.security.JwtUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${HOMME_SERVICE_URL:http://homme-service:8081}")
    private String hommeServiceUrl;

    @Value("${FEMME_SERVICE_URL:http://femme-service:8082}")
    private String femmeServiceUrl;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            logger.info("Tentative d'enregistrement pour l'utilisateur: {}", user.getUsername());
            
            if (user.getSex() == null) {
                return ResponseEntity.badRequest().body("Le genre est obligatoire");
            }
            
            // Vérifier si le nom d'utilisateur existe déjà
            if (userRepository.findByUsername(user.getUsername()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Ce nom d'utilisateur est déjà utilisé");
            }
            
            // Vérifier si l'email existe déjà
            if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Cet email est déjà utilisé");
            }
            
            // Rediriger vers le service approprié selon le sexe
            String targetServiceUrl;
            if (user.getSex() == com.app.index.model.Gender.MALE) {
                targetServiceUrl = hommeServiceUrl + "/api/users/register";
                logger.info("Redirection vers homme-service pour l'utilisateur: {}", user.getUsername());
            } else {
                targetServiceUrl = femmeServiceUrl + "/api/users/register";
                logger.info("Redirection vers femme-service pour l'utilisateur: {}", user.getUsername());
            }
            
            // Appeler le service approprié
            ResponseEntity<Object> response = restTemplate.postForEntity(targetServiceUrl, user, Object.class);
            
            if (response.getStatusCode().is2xxSuccessful()) {
                // Sauvegarder dans index-service aussi
                user.setPassword(passwordEncoder.encode(user.getPassword()));
                user.setRole("ROLE_USER");
                User savedUser = userRepository.save(user);
                logger.info("Utilisateur enregistré avec succès dans les deux services: {}", savedUser.getUsername());
                
                return ResponseEntity.ok(savedUser);
            } else {
                return ResponseEntity.status(response.getStatusCode())
                        .body(response.getBody());
            }
            
        } catch (Exception e) {
            if (e instanceof DataIntegrityViolationException) {
                // Gérer les violations de contrainte d'intégrité
                if (e.getMessage() != null && e.getMessage().contains("email")) {
                    return ResponseEntity.status(HttpStatus.CONFLICT)
                            .body("Cet email est déjà utilisé");
                }
                logger.error("Erreur d'intégrité des données lors de l'enregistrement", e);
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("Une erreur est survenue : données en conflit");
            }
            logger.error("Erreur lors de l'enregistrement", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Une erreur est survenue lors de l'enregistrement: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            logger.info("Tentative de connexion pour l'utilisateur: {}", user.getUsername());
            
            User existingUser = userRepository.findByUsername(user.getUsername())
                    .orElseThrow(() -> {
                        logger.warn("Tentative de connexion échouée: utilisateur non trouvé - {}", user.getUsername());
                        return new RuntimeException("Nom d'utilisateur ou mot de passe incorrect");
                    });

            if (!passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
                logger.warn("Tentative de connexion échouée: mot de passe incorrect pour l'utilisateur - {}", user.getUsername());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body("Nom d'utilisateur ou mot de passe incorrect");
            }

            String token = jwtUtils.generateToken(existingUser.getUsername());
            Map<String, String> response = new HashMap<>();
            response.put("token", token);
            response.put("username", existingUser.getUsername());
            response.put("userId", existingUser.getId().toString());
            response.put("gender", existingUser.getSex().toString());  // Ajout du genre
response.put("role", existingUser.getRole());              // Ajout du rôle
            logger.info("Connexion réussie pour l'utilisateur: {}", existingUser.getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Erreur lors de la tentative de connexion", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Une erreur est survenue lors de la connexion: " + e.getMessage());
        }
    }
}
