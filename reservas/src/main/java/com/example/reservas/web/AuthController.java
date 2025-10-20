package com.example.reservas.web;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.reservas.model.Persona;
import com.example.reservas.repository.PersonaRepository;
import com.example.reservas.security.JwtUtil;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PersonaRepository personaRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Persona loginData) {
        Optional<Persona> personaOpt = personaRepository.findByEmail(loginData.getEmail());
        if (personaOpt.isEmpty() || !personaOpt.get().getPassword().equals(loginData.getPassword())) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        Persona persona = personaOpt.get();
        String token = jwtUtil.generarToken(persona.getEmail(), persona.getRol().name());
        return ResponseEntity.ok(token);
    }

     @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Persona nueva) {
        if (personaRepository.findByEmail(nueva.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("El email ya está registrado");
        }
        personaRepository.save(nueva);
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }
}
