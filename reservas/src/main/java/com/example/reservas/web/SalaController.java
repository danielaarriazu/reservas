package com.example.reservas.web;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.reservas.model.Sala;
import com.example.reservas.repository.SalaRepository;

@RestController
@RequestMapping("/salas")
//@CrossOrigin(origins = "*", allowCredentials = "true")
public class SalaController {

    @Autowired
    private SalaRepository salaRepository;

    @GetMapping
    public ResponseEntity<List<Sala>> listarSalas(Authentication authentication) {
        List<Sala> salas = salaRepository.findAll();
        
        // 🔥 Solo filtrar si el usuario NO es ADMIN
        if (authentication != null && !isAdmin(authentication)) {
            salas = salas.stream()
                         .filter(Sala::isDisponible)
                         .collect(Collectors.toList());
        }

        System.out.println("✅ Listando " + salas.size() + " salas");
        return ResponseEntity.ok(salas);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> crear(@RequestBody Sala sala, Authentication authentication) {
        System.out.println("🔹 Intentando crear sala: " + sala.getNombre() + " | Usuario: " + authentication.getName());
        
        if (sala.getNombre() == null || sala.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El nombre es obligatorio");
        }
        
        Sala nueva = salaRepository.save(sala);
        System.out.println("✅ Sala creada: " + nueva.getId() + " - " + nueva.getNombre());
        
        return ResponseEntity.ok(nueva);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Sala salaActualizada, Authentication authentication) {
        System.out.println("🔹 Intentando actualizar sala: " + id + " | Usuario: " + authentication.getName());
        
        return salaRepository.findById(id)
                .map(s -> {
                    s.setNombre(salaActualizada.getNombre());
                    s.setCapacidad(salaActualizada.getCapacidad());
                    s.setDisponible(salaActualizada.isDisponible());
                    Sala actualizada = salaRepository.save(s);
                    System.out.println("✅ Sala actualizada: " + actualizada.getId());
                    return ResponseEntity.ok(actualizada);
                })
                .orElseGet(() -> {
                    System.out.println("❌ Sala no encontrada: " + id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id, Authentication authentication) {
        System.out.println("🔹 Intentando eliminar sala: " + id + " | Usuario: " + authentication.getName());
        
        if (!salaRepository.existsById(id)) {
            System.out.println("❌ Sala no encontrada: " + id);
            return ResponseEntity.notFound().build();
        }
        
        salaRepository.deleteById(id);
        System.out.println("✅ Sala eliminada: " + id);
        
        return ResponseEntity.ok("Sala eliminada correctamente");
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
    }
}