package com.example.reservas.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.reservas.model.Sala;

public interface SalaRepository extends JpaRepository<Sala, Long> {
}
