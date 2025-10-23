package com.example.reservas.model;

import java.time.LocalDateTime;

/**
 * DTO para exponer los datos de la entidad Reserva en formato plano y legible.
 * Incluye IDs y nombres de Persona, Sala y Artículo.
 */
public class ReservaDTO {

    private Long id;

    private Long personaId;
    private String personaNombre;

    private Long salaId;
    private String salaNombre;

    private Long articuloId;
    private String articuloNombre;

    private LocalDateTime fechaHoraInicio;
    private LocalDateTime fechaHoraFin;

    public ReservaDTO() {}

    public ReservaDTO(Long id,
                      Long personaId, String personaNombre,
                      Long salaId, String salaNombre,
                      Long articuloId, String articuloNombre,
                      LocalDateTime fechaHoraInicio, LocalDateTime fechaHoraFin) {
        this.id = id;
        this.personaId = personaId;
        this.personaNombre = personaNombre;
        this.salaId = salaId;
        this.salaNombre = salaNombre;
        this.articuloId = articuloId;
        this.articuloNombre = articuloNombre;
        this.fechaHoraInicio = fechaHoraInicio;
        this.fechaHoraFin = fechaHoraFin;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPersonaId() { return personaId; }
    public void setPersonaId(Long personaId) { this.personaId = personaId; }

    public String getPersonaNombre() { return personaNombre; }
    public void setPersonaNombre(String personaNombre) { this.personaNombre = personaNombre; }

    public Long getSalaId() { return salaId; }
    public void setSalaId(Long salaId) { this.salaId = salaId; }

    public String getSalaNombre() { return salaNombre; }
    public void setSalaNombre(String salaNombre) { this.salaNombre = salaNombre; }

    public Long getArticuloId() { return articuloId; }
    public void setArticuloId(Long articuloId) { this.articuloId = articuloId; }

    public String getArticuloNombre() { return articuloNombre; }
    public void setArticuloNombre(String articuloNombre) { this.articuloNombre = articuloNombre; }

    public LocalDateTime getFechaHoraInicio() { return fechaHoraInicio; }
    public void setFechaHoraInicio(LocalDateTime fechaHoraInicio) { this.fechaHoraInicio = fechaHoraInicio; }

    public LocalDateTime getFechaHoraFin() { return fechaHoraFin; }
    public void setFechaHoraFin(LocalDateTime fechaHoraFin) { this.fechaHoraFin = fechaHoraFin; }
}
 