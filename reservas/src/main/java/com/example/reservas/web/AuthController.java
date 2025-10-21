package com.example.reservas.web;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
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
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Persona loginData) {
        Optional<Persona> personaOpt = personaRepository.findByEmail(loginData.getEmail());
        if (personaOpt.isEmpty()) {
            return ResponseEntity.status(401).body("Email o contraseña inválidos");
        }

        //Persona persona = personaOpt.get();

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginData.getEmail(), loginData.getPassword()
                )
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginData.getEmail());
        final String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok(token);
    }

    // ✅ REGISTRO
    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Persona nueva) {
        // 1️⃣ Verificar que no exista otro usuario con ese email
        if (personaRepository.findByEmail(nueva.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("El email ya está registrado");
        }

        // 2️⃣ Encriptar contraseña
        nueva.setPassword(passwordEncoder.encode(nueva.getPassword()));

        // 3️⃣ Guardar nuevo usuario
        personaRepository.save(nueva);

        return ResponseEntity.ok("Usuario registrado exitosamente");
    }
}
