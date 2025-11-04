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
//@CrossOrigin(origins = "*", allowCredentials = "true")
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
    
    // 🔹 Obtener todas las reservas para la API de Python (GET)
    @GetMapping("/datos")
    public ResponseEntity<List<Map<String, Object>>> getDatosReservas() {
        List<Reserva> reservas = reservaRepository.findAll();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        List<Map<String, Object>> datos = new ArrayList<>();

        for (Reserva r : reservas) {
            Map<String, Object> fila = new LinkedHashMap<>();
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

                if (r.getFechaHoraInicio() != null && r.getFechaHoraFin() != null) {
                    Duration d = Duration.between(r.getFechaHoraInicio(), r.getFechaHoraFin());
                    duracion = d.toMinutes() / 60.0;
                    fila.put("duracion_horas", duracion);
                }

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

    // 🔹 Listar reservas
    @GetMapping
    public ResponseEntity<List<Reserva>> listarReservas(Authentication authentication) {
        Persona persona = personaRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        List<Reserva> reservas;
        if (persona.getRol() == Rol.ADMIN) {
            reservas = reservaService.listarTodas();
            System.out.println("✅ Admin listando " + reservas.size() + " reservas");
        } else {
            reservas = reservaService.listarPorUsuario(persona);
            System.out.println("✅ Usuario listando " + reservas.size() + " reservas propias");
        }

        return ResponseEntity.ok(reservas);
    }

    // 🔹 Crear una reserva
    @PostMapping
    public ResponseEntity<?> crearReserva(@RequestBody Reserva reserva, Authentication authentication) {
        System.out.println("🔹 Intentando crear reserva | Usuario: " + authentication.getName());
        
        Persona persona = personaRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // 🔥 Validaciones básicas
        if (reserva.getSala() == null || reserva.getSala().getId() == null) {
            return ResponseEntity.badRequest().body("La sala es obligatoria");
        }
        
        if (reserva.getArticulo() == null || reserva.getArticulo().getId() == null) {
            return ResponseEntity.badRequest().body("El artículo es obligatorio");
        }
        
        if (reserva.getFechaHoraInicio() == null || reserva.getFechaHoraFin() == null) {
            return ResponseEntity.badRequest().body("Las fechas son obligatorias");
        }

        // 🔥 Determinar a quién asignar la reserva
        Persona personaAsignada;
        if (persona.getRol() == Rol.ADMIN && reserva.getPersona() != null && reserva.getPersona().getId() != null) {
            // Admin puede crear reservas para otros usuarios
            personaAsignada = personaRepository.findById(reserva.getPersona().getId())
                    .orElseThrow(() -> new RuntimeException("Usuario destino no encontrado"));
        } else {
            // Usuario normal solo puede crear reservas para sí mismo
            personaAsignada = persona;
        }

        // 🔥 Cargar entidades completas desde BD
        reserva.setSala(salaRepository.findById(reserva.getSala().getId())
                .orElseThrow(() -> new RuntimeException("Sala no encontrada")));
        
        reserva.setArticulo(articuloRepository.findById(reserva.getArticulo().getId())
                .orElseThrow(() -> new RuntimeException("Artículo no encontrado")));

        // 🔥 Verificar disponibilidad
        if (!reservaService.estaDisponible(reserva)) {
            return ResponseEntity.badRequest().body("La sala no está disponible en ese horario.");
        }

        try {
            Reserva nueva = reservaService.guardar(reserva, personaAsignada.getEmail());
            System.out.println("✅ Reserva creada: " + nueva.getId() + " para " + personaAsignada.getEmail());
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            System.err.println("❌ Error al crear reserva: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error al crear la reserva: " + e.getMessage());
        }
    }

    // 🔹 Modificar una reserva
    @PutMapping("/{id}")
    public ResponseEntity<?> modificarReserva(@PathVariable Long id, @RequestBody Reserva reservaActualizada, Authentication authentication) {
        System.out.println("🔹 Intentando modificar reserva: " + id + " | Usuario: " + authentication.getName());
        
        Persona persona = personaRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Reserva reserva = reservaService.obtenerPorId(id);
        
        if (reserva == null) {
            System.out.println("Reserva no encontrada: " + id);
            return ResponseEntity.notFound().build();
        }

        // 🔥 Control de permisos
        boolean esAdmin = persona.getRol() == Rol.ADMIN;
        if (!esAdmin && !reserva.getPersona().getId().equals(persona.getId())) {
            System.out.println("❌ Usuario sin permisos para modificar reserva: " + id);
            return ResponseEntity.status(403).body("No puedes modificar reservas de otros usuarios.");
        }

        // 🔥 Recuperar entidades completas
        if (reservaActualizada.getSala() != null && reservaActualizada.getSala().getId() != null) {
            reservaActualizada.setSala(salaRepository.findById(reservaActualizada.getSala().getId())
                    .orElseThrow(() -> new RuntimeException("Sala no encontrada")));
        }

        if (reservaActualizada.getArticulo() != null && reservaActualizada.getArticulo().getId() != null) {
            reservaActualizada.setArticulo(articuloRepository.findById(reservaActualizada.getArticulo().getId())
                    .orElseThrow(() -> new RuntimeException("Artículo no encontrado")));
        }

        // 🔥 Verificar disponibilidad
        if (!reservaService.estaDisponibleParaModificar(reservaActualizada, id)) {
        return ResponseEntity.badRequest().body("La sala no está disponible en ese horario.");
    }

        try {
            Reserva modificada = reservaService.modificar(id, reservaActualizada, persona, esAdmin);
            System.out.println("✅ Reserva modificada: " + modificada.getId());
            return ResponseEntity.ok(modificada);
        } catch (Exception e) {
            System.err.println("❌ Error al modificar reserva: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error al modificar la reserva: " + e.getMessage());
        }
    }

    // 🔹 Eliminar una reserva
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarReserva(@PathVariable Long id, Authentication authentication) {
        System.out.println("🔹 Intentando eliminar reserva: " + id + " | Usuario: " + authentication.getName());
        
        Persona persona = personaRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        
        Reserva reserva = reservaService.obtenerPorId(id);
        
        if (reserva == null) {
            System.out.println("❌ Reserva no encontrada: " + id);
            return ResponseEntity.notFound().build();
        }

        boolean esAdmin = persona.getRol() == Rol.ADMIN;
        if (!esAdmin && !reserva.getPersona().getId().equals(persona.getId())) {
            System.out.println("❌ Usuario sin permisos para eliminar reserva: " + id);
            return ResponseEntity.status(403).body("No puedes eliminar reservas de otros usuarios.");
        }

        try {
            reservaService.eliminar(id, persona, esAdmin);
            System.out.println("✅ Reserva eliminada: " + id);
            return ResponseEntity.ok("Reserva eliminada correctamente.");
        } catch (Exception e) {
            System.err.println("❌ Error al eliminar reserva: " + e.getMessage());
            return ResponseEntity.badRequest().body("Error al eliminar la reserva: " + e.getMessage());
        }
    }
}