package com.app.index.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Date;

@Component
public class JwtUtils {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private SecretKey getSigningKey() {
        // S'assurer que la clé fait au moins 256 bits (32 caractères)
        String secret = jwtSecret;
        if (secret.length() < 32) {
            // Si la clé est trop courte, la compléter avec des caractères
            secret = String.format("%-32s", secret).substring(0, 32);
        } else if (secret.length() > 32) {
            // Si la clé est trop longue, la tronquer
            secret = secret.substring(0, 32);
        }
        
        // Encoder en Base64 pour s'assurer d'avoir une clé valide
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        String base64Key = Base64.getEncoder().encodeToString(keyBytes);
        
        // Créer une clé sécurisée
        return Keys.hmacShaKeyFor(base64Key.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}
