package com.example.reservas.web;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.reservas.model.Persona;
import com.example.reservas.repository.PersonaRepository;
import com.example.reservas.security.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"}, allowCredentials = "true")  
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;  // 👈 AGREGAR

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Persona loginData) {
        System.out.println("🔹 Login attempt: " + loginData.getEmail());

        Optional<Persona> personaOpt = personaRepository.findByEmail(loginData.getEmail());
        
        if (personaOpt.isEmpty()) {
            System.out.println("❌ Usuario no encontrado");
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        Persona persona = personaOpt.get();
        System.out.println("🔹 Password from DB: " + persona.getPassword()); 
        System.out.println("🔹 Password provided: " + loginData.getPassword());
        
        // 🔐 Comparar con BCrypt
        if (!passwordEncoder.matches(loginData.getPassword(), persona.getPassword())) {
            System.out.println("❌ Contraseña incorrecta");
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        String token = jwtUtil.generarToken(persona.getEmail(), persona.getRol().name());
         System.out.println("✅ Login exitoso, token generado");
        return ResponseEntity.ok(token);
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Persona nueva) {
        if (personaRepository.findByEmail(nueva.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("El email ya está registrado");
        }
        
        // 🔐 Encriptar contraseña antes de guardar
        nueva.setPassword(passwordEncoder.encode(nueva.getPassword()));
        personaRepository.save(nueva);
        
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }
}