package com.example.reservas.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.example.reservas.model.Reserva;
import com.example.reservas.repository.ReservaRepository;

@Service
public class ReservaService {

    private final ReservaRepository reservaRepo;

    public ReservaService(ReservaRepository reservaRepo) {
        this.reservaRepo = reservaRepo;
    }

    /**
     * Crea una reserva validando que la sala no esté ocupada en ese rango de horario.
     */
    public Reserva crearReserva(Reserva nueva) {
        LocalDateTime inicio = nueva.getFechaHoraInicio();
        LocalDateTime fin = nueva.getFechaHoraFin();
        Long salaId = nueva.getSala().getId();

        // 1️⃣ Buscar reservas que se solapen con el rango pedido
        List<Reserva> solapadas = reservaRepo.findBySalaIdAndFechaHoraInicioBetween(
                salaId,
                inicio.minusMinutes(1), // margen de seguridad
                fin.plusMinutes(1)
        );

        // 2️⃣ Validar si hay conflicto
        boolean existeConflicto = solapadas.stream().anyMatch(r ->
                r.getFechaHoraInicio().isBefore(fin) &&
                r.getFechaHoraFin().isAfter(inicio)
        );

        if (existeConflicto) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "La sala ya está reservada en ese horario."
            );
        }

        // 3️⃣ Guardar la reserva si está todo bien
        return reservaRepo.save(nueva);
    }

    /**
     * Devuelve todas las reservas.
     */
    public List<Reserva> listar() {
        return reservaRepo.findAll();
    }

    /**
     * Devuelve una reserva por ID.
     */
    public Reserva obtener(Long id) {
        return reservaRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reserva no encontrada"));
    }

    /**
     * Elimina una reserva.
     */
    public void eliminar(Long id) {
        reservaRepo.deleteById(id);
    }
}

