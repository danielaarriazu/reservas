package com.example.reservas.web;

import java.util.List;

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
    private final SalaRepository repo;

    public SalaController(SalaRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<Sala> listar() {
        return repo.findAll();
    }

    @PostMapping
     @PreAuthorize("hasAuthority('ADMIN')")
    public Sala crear(@RequestBody Sala sala) {
        return repo.save(sala);
    }

    @GetMapping("/{id}")
     @PreAuthorize("hasAuthority('ADMIN')")
    public Sala obtener(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
     @PreAuthorize("hasAuthority('ADMIN')")
    public Sala actualizar(@PathVariable Long id, @RequestBody Sala sala) {
        sala.setId(id);
        return repo.save(sala);
    }

    @DeleteMapping("/{id}")
     @PreAuthorize("hasAuthority('ADMIN')")
    public void eliminar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}
