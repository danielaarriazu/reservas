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
import com.example.reservas.model.Rol;
import com.example.reservas.repository.PersonaRepository;
import com.example.reservas.security.JwtUtil;

@RestController
@RequestMapping("/auth")
//@CrossOrigin(origins = "*", allowCredentials = "true")
public class AuthController {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Persona loginData) {
        System.out.println("🔹 Intento de login: " + loginData.getEmail());

        Optional<Persona> personaOpt = personaRepository.findByEmail(loginData.getEmail());
        
        if (personaOpt.isEmpty()) {
            System.out.println("❌ Usuario no encontrado: " + loginData.getEmail());
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        Persona persona = personaOpt.get();
        
        // 🔐 Comparar con BCrypt
        if (!passwordEncoder.matches(loginData.getPassword(), persona.getPassword())) {
            System.out.println("❌ Contraseña incorrecta para: " + loginData.getEmail());
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }

        String token = jwtUtil.generarToken(persona.getEmail(), persona.getRol().name());
        System.out.println("✅ Login exitoso: " + persona.getEmail() + " | Rol: " + persona.getRol());
        
        return ResponseEntity.ok(token);
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody Persona nueva) {
        System.out.println("🔹 Intento de registro: " + nueva.getEmail());
        
        // 🔥 Validar que venga el email
        if (nueva.getEmail() == null || nueva.getEmail().trim().isEmpty()) {
            System.out.println("❌ Email vacío");
            return ResponseEntity.badRequest().body("El email es obligatorio");
        }

        // 🔥 Validar que venga la contraseña
        if (nueva.getPassword() == null || nueva.getPassword().trim().isEmpty()) {
            System.out.println("❌ Contraseña vacía");
            return ResponseEntity.badRequest().body("La contraseña es obligatoria");
        }

        // 🔥 Verificar si el email ya existe
        if (personaRepository.findByEmail(nueva.getEmail()).isPresent()) {
            System.out.println("❌ Email ya registrado: " + nueva.getEmail());
            return ResponseEntity.badRequest().body("El email ya está registrado");
        }

        // 🔥 Asignar rol por defecto si no viene
        if (nueva.getRol() == null) {
            nueva.setRol(Rol.USUARIO);
        }

        // 🔥 Validar que el nombre no esté vacío
        if (nueva.getNombre() == null || nueva.getNombre().trim().isEmpty()) {
            nueva.setNombre(nueva.getEmail().split("@")[0]); // Usar email como nombre
        }
        
        // 🔐 Encriptar contraseña antes de guardar
        nueva.setPassword(passwordEncoder.encode(nueva.getPassword()));
        
        Persona guardada = personaRepository.save(nueva);
        System.out.println("✅ Usuario registrado: " + guardada.getEmail() + " | Rol: " + guardada.getRol());
        
        return ResponseEntity.ok("Usuario registrado exitosamente");
    }
}