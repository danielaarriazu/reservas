package com.example.reservas.web;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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

@RestController
@RequestMapping("/articulos")
//@CrossOrigin(origins = "*", allowCredentials = "true")
public class ArticuloController {

    @Autowired
    private ArticuloRepository articuloRepository;

    @GetMapping
    public ResponseEntity<List<Articulo>> listar(Authentication authentication) {
        List<Articulo> articulos = articuloRepository.findAll();

        // 🔥 Solo filtrar si el usuario NO es ADMIN
        if (authentication != null && !isAdmin(authentication)) {
            articulos = articulos.stream()
                         .filter(Articulo::isDisponible)
                         .collect(Collectors.toList());
        }

        System.out.println("✅ Listando " + articulos.size() + " artículos");
        return ResponseEntity.ok(articulos);
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> crear(@RequestBody Articulo articulo, Authentication authentication) {
        System.out.println("🔹 Intentando crear artículo: " + articulo.getNombre() + " | Usuario: " + authentication.getName());
        
        if (articulo.getNombre() == null || articulo.getNombre().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("El nombre es obligatorio");
        }
        
        Articulo nuevo = articuloRepository.save(articulo);
        System.out.println("✅ Artículo creado: " + nuevo.getId() + " - " + nuevo.getNombre());
        
        return ResponseEntity.ok(nuevo);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Articulo articuloActualizado, Authentication authentication) {
        System.out.println("🔹 Intentando actualizar artículo: " + id + " | Usuario: " + authentication.getName());
        
        return articuloRepository.findById(id)
                .map(a -> {
                    a.setNombre(articuloActualizado.getNombre());
                    a.setDisponible(articuloActualizado.isDisponible());
                    Articulo actualizado = articuloRepository.save(a);
                    System.out.println("✅ Artículo actualizado: " + actualizado.getId());
                    return ResponseEntity.ok(actualizado);
                })
                .orElseGet(() -> {
                    System.out.println("❌ Artículo no encontrado: " + id);
                    return ResponseEntity.notFound().build();
                });
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> eliminar(@PathVariable Long id, Authentication authentication) {
        System.out.println("🔹 Intentando eliminar artículo: " + id + " | Usuario: " + authentication.getName());
        
        if (!articuloRepository.existsById(id)) {
            System.out.println("❌ Artículo no encontrado: " + id);
            return ResponseEntity.notFound().build();
        }
        
        articuloRepository.deleteById(id);
        System.out.println("✅ Artículo eliminado: " + id);
        
        return ResponseEntity.ok("Artículo eliminado correctamente");
    }

    private boolean isAdmin(Authentication authentication) {
        return authentication.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ADMIN"));
    }
}