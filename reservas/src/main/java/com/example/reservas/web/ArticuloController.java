package com.example.reservas.web;

import java.util.List;

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
public class ArticuloController {
    private final ArticuloRepository repo;

    public ArticuloController(ArticuloRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Articulo> listar() {
        return repo.findAll();
    }

    @PostMapping
    public Articulo crear(@RequestBody Articulo articulo) {
        return repo.save(articulo);
    }

    @GetMapping("/{id}")
    public Articulo obtener(@PathVariable Long id) {
        return repo.findById(id).orElseThrow();
    }

    @PutMapping("/{id}")
    public Articulo actualizar(@PathVariable Long id, @RequestBody Articulo articulo) {
        articulo.setId(id);
        return repo.save(articulo);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        repo.deleteById(id);
    }
}

