package com.example.reservas.web;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
public class SalaController {

    @Autowired
    private SalaRepository salaRepository;

    // ADMIN → ve todas las salas
    // USER → ve solo las disponibles
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USUARIO')")
    public ResponseEntity<List<Sala>> listarSalas() {
        List<Sala> salas = salaRepository.findAll();

        // Filtramos si el usuario es USER
        // (Spring Security gestiona el rol en el token)
        if (isUser()) {
            salas = salas.stream()
                         .filter(Sala::isDisponible)
                         .collect(Collectors.toList());
        }

        return ResponseEntity.ok(salas);
    }

    // Solo ADMIN puede crear una sala
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Sala> crear(@RequestBody Sala sala) {
        return ResponseEntity.ok(salaRepository.save(sala));
    }

    // Solo ADMIN puede modificar
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Sala> actualizar(@PathVariable Long id, @RequestBody Sala salaActualizada) {
        return salaRepository.findById(id)
                .map(s -> {
                    s.setNombre(salaActualizada.getNombre());
                    s.setCapacidad(salaActualizada.getCapacidad());
                    return ResponseEntity.ok(salaRepository.save(s));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Solo ADMIN puede eliminar
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        salaRepository.deleteById(id);
        return ResponseEntity.ok("Sala eliminada correctamente");
    }

    // ✅ Helper: verificar si el usuario actual es ROLE_USER
    private boolean isUser() {
        return org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(auth -> auth.getAuthority().equals("USUARIO"));
    }
}
