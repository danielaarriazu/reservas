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

import com.example.reservas.model.Articulo;
import com.example.reservas.repository.ArticuloRepository;

//gpt
@RestController
@RequestMapping("/articulos")
public class ArticuloController {

    @Autowired
    private ArticuloRepository articuloRepository;

    // ADMIN → ve todas los articulos
    // USER → ve solo las disponibles
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'USUARIO')")
    public ResponseEntity<List<Articulo>> listar() {
        List<Articulo> articulo = articuloRepository.findAll();

        // Filtramos si el usuario es USER
        // (Spring Security gestiona el rol en el token)
        if (isUser()) {
            articulo = articulo.stream()
                         .filter(Articulo::isDisponible)
                         .collect(Collectors.toList());
        }

        return ResponseEntity.ok(articulo);
    }

    // Solo ADMIN puede crear artículos
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Articulo> crear(@RequestBody Articulo articulo) {
        return ResponseEntity.ok(articuloRepository.save(articulo));
    }

    // Solo ADMIN puede modificar
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Articulo> actualizar(@PathVariable Long id, @RequestBody Articulo articuloActualizado) {
        return articuloRepository.findById(id)
                .map(a -> {
                    a.setNombre(articuloActualizado.getNombre());
                    a.setDisponible(articuloActualizado.isDisponible());
                    return ResponseEntity.ok(articuloRepository.save(a));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Solo ADMIN puede eliminar
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        articuloRepository.deleteById(id);
        return ResponseEntity.ok("Artículo eliminado correctamente");
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
