package com.example.reservas.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.reservas.model.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findBySalaId(Long salaId);

    @Query("SELECT r FROM Reserva r WHERE r.sala.id = :salaId AND r.fechaHoraInicio BETWEEN :start AND :end")
    List<Reserva> findBySalaIdAndFechaHoraInicioBetween(
            @Param("salaId") Long salaId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
    List<Reserva> findByPersonaEmail(String email);
}
