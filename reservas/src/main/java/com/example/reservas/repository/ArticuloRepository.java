package com.example.reservas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.reservas.model.Articulo;

public interface ArticuloRepository extends JpaRepository<Articulo, Long> {
}
