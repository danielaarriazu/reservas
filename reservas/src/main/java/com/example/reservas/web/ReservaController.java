package com.example.reservas.web;

import java.time.Duration;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.reservas.model.Persona;
import com.example.reservas.model.Reserva;
import com.example.reservas.model.Rol;
import com.example.reservas.repository.ArticuloRepository;
import com.example.reservas.repository.PersonaRepository;
import com.example.reservas.repository.ReservaRepository;
import com.example.reservas.repository.SalaRepository;
import com.example.reservas.service.ReservaService;


@RestController
@RequestMapping("/reservas")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @Autowired
    private PersonaRepository personaRepository;

    @Autowired
    private SalaRepository salaRepository;

    @Autowired
    private ArticuloRepository articuloRepository;

    @Autowired
    private ReservaRepository reservaRepository;
    
// 🔹 Obtener todas las reservas para la api de python(GET)
    @CrossOrigin(origins = {
    "http://localhost:8080/reservas/datos",
    "http://127.0.0.1:8000",     // para la API Python local
    "http://localhost:8000",     // alternativa
    "http://localhost:5174"      // frontend React (modo dev)
})
   @GetMapping("/datos")
    public ResponseEntity<List<Map<String, Object>>> getDatosReservas() {
    List<Reserva> reservas = reservaRepository.findAll();
    DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    List<Map<String, Object>> datos = new ArrayList<>();

    for (Reserva r : reservas) {
        Map<String, Object> fila = new LinkedHashMap<>();
        // Long personaId = null;
        // Long salaId = null;
        // Long articuloId = null;
         Double duracion = 0.0;
         String fechaIso = "";

        try {
             if (r.getSala() != null) {
                fila.put("salaId", r.getSala().getId());
                fila.put("salaNombre", r.getSala().getNombre());
                fila.put("salaCapacidad", Integer.valueOf(r.getSala().getCapacidad()));
            } else {
                fila.put("salaId", null);
                fila.put("salaNombre", null);
                fila.put("salaCapacidad", null);
            }

             if (r.getArticulo() != null) {
                fila.put("articuloId", r.getArticulo().getId());
                fila.put("articuloNombre", r.getArticulo().getNombre());
            } else {
                fila.put("articuloId", null);
                fila.put("articuloNombre", null);
            }

            // 🔹 Calcular duración si existen fechas
            if (r.getFechaHoraInicio() != null && r.getFechaHoraFin() != null) {
                Duration d = Duration.between(r.getFechaHoraInicio(), r.getFechaHoraFin());
                duracion = d.toMinutes() / 60.0; // convertir a horas
                fila.put("duracion_horas", duracion);
            }

            // 🔹 Usar la fecha de inicio como referencia
            if (r.getFechaHoraInicio() != null) {
                fechaIso = r.getFechaHoraInicio().format(fmt);
                fila.put("fecha", fechaIso);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

       datos.add(fila);
    }

    return ResponseEntity.ok(datos);
}

//     // 🔹 Obtener todas las reservas para la api de python(GET)
//     @GetMapping("/datos")
//     @PreAuthorize("hasAuthority('ADMIN')")
//     public List<ReservaDTO> getAllReservas() {
//         return reservaRepository.findAll()
//                 .stream()
//                 .map(this::convertToDTO)
//                 .collect(Collectors.toList());
//     }

// // 🔹 Conversión Entidad → DTO plano
//     private ReservaDTO convertToDTO(Reserva reserva) {
//         return new ReservaDTO(
//                 reserva.getId(),
//                 reserva.getPersona() != null ? reserva.getPersona().getId() : null,
//                 reserva.getPersona() != null ? reserva.getPersona().getNombre() : null,
//                 reserva.getSala() != null ? reserva.getSala().getId() : null,
//                 reserva.getSala() != null ? reserva.getSala().getNombre() : null,
//                 reserva.getArticulo() != null ? reserva.getArticulo().getId() : null,
//                 reserva.getArticulo() != null ? reserva.getArticulo().getNombre() : null,
//                 reserva.getFechaHoraInicio(),
//                 reserva.getFechaHoraFin()
//         );
//     }

    // 🔹 Listar reservas
    @GetMapping
    public ResponseEntity<List<Reserva>> listarReservas(Authentication authentication) {
        Persona persona = personaRepository.findByEmail(authentication.getName()).orElseThrow();

        if (persona.getRol() == Rol.ADMIN) {
            return ResponseEntity.ok(reservaService.listarTodas());
        } else {
            return ResponseEntity.ok(reservaService.listarPorUsuario(persona));
        }
    }

    // 🔹 Crear una reserva
    @PostMapping
    public ResponseEntity<?> crearReserva(@RequestBody Reserva reserva, Authentication authentication) {
        Persona persona = personaRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Asignar usuario logueado a la reserva
       // reserva.setPersona(persona);
        Persona personaAsignada;

    // Si es ADMIN y la reserva incluye un usuario explícito, asignar a ese usuario
     if (persona.getRol() == Rol.ADMIN && reserva.getPersona() != null && reserva.getPersona().getId() != null) {
        personaAsignada = personaRepository.findById(reserva.getPersona().getId())
                .orElseThrow(() -> new RuntimeException("Usuario destino no encontrado"));
    }  else {
        // Si no, asignar al usuario logueado (rol USUARIO)
        personaAsignada = persona;
    }

        // Recuperar entidades completas desde BD
        if (reserva.getSala() != null && reserva.getSala().getId() != null) {
        reserva.setSala(salaRepository.findById(reserva.getSala().getId()).orElse(null));
        }
        if (reserva.getArticulo() != null && reserva.getArticulo().getId() != null) {
        reserva.setArticulo(articuloRepository.findById(reserva.getArticulo().getId()).orElse(null));
         }

        // Verificar disponibilidad
        if (!reservaService.estaDisponible(reserva)) {
            return ResponseEntity.badRequest().body("La sala no está disponible en ese horario.");
        }

        Reserva nueva = reservaService.guardar(reserva, personaAsignada.getEmail());
        return ResponseEntity.ok(nueva);
    }

    // 🔹 Modificar una reserva
    @PutMapping("/{id}")
    public ResponseEntity<?> modificarReserva(@PathVariable Long id, @RequestBody Reserva reservaActualizada, Authentication authentication) {
        Persona persona = personaRepository.findByEmail(authentication.getName()).orElseThrow();
        Reserva reserva = reservaService.obtenerPorId(id);
        boolean esAdmin = persona.getRol() == Rol.ADMIN;

        if (reserva == null) {
            return ResponseEntity.notFound().build();
        }

        // Control de permisos
        if (persona.getRol() != Rol.ADMIN && !reserva.getPersona().getId().equals(persona.getId())) {
            return ResponseEntity.status(403).body("No puedes modificar reservas de otros usuarios.");
        }

        // Recuperar entidades completas antes de actualizar
        if (reservaActualizada.getSala() != null && reservaActualizada.getSala().getId() != null) {
            reservaActualizada.setSala(salaRepository.findById(reservaActualizada.getSala().getId()).orElse(null));
        }

        if (reservaActualizada.getArticulo() != null && reservaActualizada.getArticulo().getId() != null) {
            reservaActualizada.setArticulo(articuloRepository.findById(reservaActualizada.getArticulo().getId()).orElse(null));
        }

        // Verificar disponibilidad
        if (!reservaService.estaDisponible(reservaActualizada)) {
            return ResponseEntity.badRequest().body("La sala no está disponible en ese horario.");
        }

        Reserva modificada = reservaService.modificar(id, reservaActualizada, persona, esAdmin);
        return ResponseEntity.ok(modificada);
    }

    // 🔹 Eliminar una reserva
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarReserva(@PathVariable Long id, Authentication authentication) {
        Persona persona = personaRepository.findByEmail(authentication.getName()).orElseThrow();
        Reserva reserva = reservaService.obtenerPorId(id);
        boolean esAdmin = persona.getRol() == Rol.ADMIN;

        if (reserva == null) {
            return ResponseEntity.notFound().build();
        }

        if (persona.getRol() != Rol.ADMIN && !reserva.getPersona().getId().equals(persona.getId())) {
            return ResponseEntity.status(403).body("No puedes eliminar reservas de otros usuarios.");
        }

        reservaService.eliminar(id, persona, esAdmin);
        return ResponseEntity.ok("Reserva eliminada correctamente.");
    }
}
