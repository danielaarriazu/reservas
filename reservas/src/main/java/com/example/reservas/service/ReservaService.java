package com.example.reservas.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.reservas.model.Articulo;
import com.example.reservas.model.Persona;
import com.example.reservas.model.Reserva;
import com.example.reservas.model.Sala;
import com.example.reservas.repository.ArticuloRepository;
import com.example.reservas.repository.PersonaRepository;
import com.example.reservas.repository.ReservaRepository;
import com.example.reservas.repository.SalaRepository;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;
    
    @Autowired
    private SalaRepository salaRepository;

    @Autowired
    private ArticuloRepository articuloRepository;

    @Autowired
    private PersonaRepository personaRepository;

    public List<Reserva> listarTodas() {
        return reservaRepository.findAll();
    }

    public List<Reserva> listarPorUsuario(Persona persona) {
        return reservaRepository.findByPersona(persona);
    }

     // 🔹 Crear reserva (valida disponibilidad y carga entidades completas)
    public Reserva guardar(Reserva reserva, String emailUsuario) {
        // Buscar entidades completas
        Sala sala = salaRepository.findById(reserva.getSala().getId())
                .orElseThrow(() -> new RuntimeException("Sala no encontrada"));
        Articulo articulo = articuloRepository.findById(reserva.getArticulo().getId())
                .orElseThrow(() -> new RuntimeException("Artículo no encontrado"));
        Persona persona = personaRepository.findByEmail(emailUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        reserva.setSala(sala);
        reserva.setArticulo(articulo);
        reserva.setPersona(persona);

        // Validar disponibilidad
        if (!estaDisponible(reserva)) {
            throw new RuntimeException("La sala no está disponible en ese horario");
        }

        return reservaRepository.save(reserva);
    }

    public Reserva obtenerPorId(Long id) {
        return reservaRepository.findById(id).orElse(null);
    }

     // 🔹 Modificar reserva (si pertenece al usuario o si es admin)
    public Reserva modificar(Long id, Reserva actualizada, Persona persona, boolean esAdmin) {
        Reserva existente = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        if (!esAdmin && !existente.getPersona().getId().equals(persona.getId())) {
            throw new RuntimeException("No tienes permiso para modificar esta reserva");
        }

        // Reasignar entidades completas
        Sala sala = salaRepository.findById(actualizada.getSala().getId())
                .orElseThrow(() -> new RuntimeException("Sala no encontrada"));
        Articulo articulo = articuloRepository.findById(actualizada.getArticulo().getId())
                .orElseThrow(() -> new RuntimeException("Artículo no encontrado"));

        existente.setSala(sala);
        existente.setArticulo(articulo);
        existente.setFechaHoraInicio(actualizada.getFechaHoraInicio());
        existente.setFechaHoraFin(actualizada.getFechaHoraFin());

        // Validar disponibilidad
        if (!estaDisponible(existente)) {
            throw new RuntimeException("La sala no está disponible en ese horario");
        }

        return reservaRepository.save(existente);
    }

   // 🔹 Eliminar reserva (solo si pertenece al usuario o es admin)
    public void eliminar(Long id, Persona persona, boolean esAdmin) {
        Reserva reserva = reservaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));

        if (!esAdmin && !reserva.getPersona().getId().equals(persona.getId())) {
            throw new RuntimeException("No tienes permiso para eliminar esta reserva");
        }

        reservaRepository.deleteById(id);
    }

    // 🔹 Verifica si una sala está disponible en el horario solicitado
    public boolean estaDisponible(Reserva reserva) {
        List<Reserva> reservasOcupadas = reservaRepository.findBySalaAndFechaHoraInicioLessThanEqualAndFechaHoraFinGreaterThanEqual(
                    reserva.getSala(),
                    reserva.getFechaHoraInicio(),
                    reserva.getFechaHoraFin());

        // Si ya hay reservas para esa sala, fecha y hora (excluyendo la misma en caso de modificación)
        return reservasOcupadas.stream()
                .allMatch(r -> r.getId().equals(reserva.getId()));
    }

    // 🔹 Verificar disponibilidad excluyendo una reserva específica (para edición)
    public boolean estaDisponibleParaModificar(Reserva reserva, Long idReservaActual) {
    // Validar que la sala esté disponible
    if (reserva.getSala() == null || !reserva.getSala().isDisponible()) {
        return false;
    }

    // Validar que el artículo esté disponible
    if (reserva.getArticulo() == null || !reserva.getArticulo().isDisponible()) {
        return false;
    }

    // Buscar solapamientos EXCLUYENDO la reserva que se está editando
    List<Reserva> reservasSuperpuestas = reservaRepository.findBySalaAndFechaHoraSolapadas(
        reserva.getSala().getId(),
        reserva.getFechaHoraInicio(),
        reserva.getFechaHoraFin()
    );

    // Filtrar para excluir la reserva actual
    reservasSuperpuestas = reservasSuperpuestas.stream()
        .filter(r -> !r.getId().equals(idReservaActual))
        .collect(Collectors.toList());

    System.out.println("🔍 Verificando disponibilidad para modificar reserva " + idReservaActual);
    System.out.println("   Sala: " + reserva.getSala().getNombre());
    System.out.println("   Inicio: " + reserva.getFechaHoraInicio());
    System.out.println("   Fin: " + reserva.getFechaHoraFin());
    System.out.println("   Solapamientos encontrados (sin contar la actual): " + reservasSuperpuestas.size());

    return reservasSuperpuestas.isEmpty();
}
}
