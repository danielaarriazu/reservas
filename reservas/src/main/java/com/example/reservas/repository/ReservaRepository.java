package com.example.reservas.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.reservas.model.Persona;
import com.example.reservas.model.Reserva;
import com.example.reservas.model.Sala;

public interface ReservaRepository extends JpaRepository<Reserva, Long> {

    List<Reserva> findBySalaId(Long salaId);

    @Query("SELECT r FROM Reserva r WHERE r.sala.id = :salaId AND r.fechaHoraInicio BETWEEN :start AND :end")
    List<Reserva> findBySalaIdAndFechaHoraInicioBetween(
            @Param("salaId") Long salaId,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
    List<Reserva> findByPersonaEmail(String email);
    
    List<Reserva> findByPersona(Persona persona);
   List<Reserva> findBySalaAndFechaHoraInicioLessThanEqualAndFechaHoraFinGreaterThanEqual(
            Sala sala,
            LocalDateTime fechaHoraFin,
            LocalDateTime fechaHoraInicio
    );

     @Query("SELECT r FROM Reserva r WHERE r.sala.id = :salaId " +
           "AND ((r.fechaHoraInicio < :fin AND r.fechaHoraFin > :inicio))")
    List<Reserva> findBySalaAndFechaHoraSolapadas(
        @Param("salaId") Long salaId,
        @Param("inicio") LocalDateTime inicio,
        @Param("fin") LocalDateTime fin
    );
}
