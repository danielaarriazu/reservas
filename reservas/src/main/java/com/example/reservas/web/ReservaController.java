package com.example.reservas.web;

import java.util.List;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.reservas.model.Reserva;
import com.example.reservas.repository.ReservaRepository;
import com.example.reservas.service.CSVExportService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    private final ReservaRepository repo;
    private final CSVExportService csvExportService;

    public ReservaController(ReservaRepository repo, CSVExportService csvExportService) {
        this.repo = repo;
        this.csvExportService = csvExportService;
    }

    // ✅ Listar reservas según rol
    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN','USUARIO')")
    public List<Reserva> listarReservas(HttpServletRequest request) {
        String rol = (String) request.getAttribute("rol");
        String email = (String) request.getAttribute("email");

        if ("ADMIN".equals(rol)) {
            return repo.findAll();
        } else {
            return repo.findByPersonaEmail(email);
        }
    }

    // ✅ Crear reserva (solo USUARIO)
    @PostMapping
    @PreAuthorize("hasAuthority('USUARIO')")
    public Reserva crear(@RequestBody Reserva reserva) {
        csvExportService.generarCSVAsync(); // Exporta el CSV en segundo plano
        return repo.save(reserva);
    }

    // ✅ Obtener una reserva (ADMIN cualquiera / USUARIO la suya)
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN','USUARIO')")
     public Reserva obtener(@PathVariable Long id, HttpServletRequest request) {
        String rol = (String) request.getAttribute("rol");
        String email = (String) request.getAttribute("email");

        Reserva reserva = repo.findById(id).orElseThrow();

        if ("ADMIN".equals(rol) || reserva.getPersona().getEmail().equals(email)) {
            return reserva;
        } else {
            throw new RuntimeException("❌ No tienes permiso para ver esta reserva.");
        }
    }

    // ✅ Modificar una reserva (ADMIN cualquiera / USUARIO la suya)
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN','USUARIO')")
    public Reserva actualizar(@PathVariable Long id, @RequestBody Reserva datos, HttpServletRequest request) {
        String rol = (String) request.getAttribute("rol");
        String email = (String) request.getAttribute("email");

        Reserva reserva = repo.findById(id).orElseThrow();

        if (!"ADMIN".equals(rol) && !reserva.getPersona().getEmail().equals(email)) {
            throw new RuntimeException("❌ No tienes permiso para modificar esta reserva.");
        }

        reserva.setSala(datos.getSala());
        reserva.setArticulo(datos.getArticulo());
        reserva.setFechaHoraInicio(datos.getFechaHoraInicio());
        reserva.setFechaHoraFin(datos.getFechaHoraFin());

        csvExportService.generarCSVAsync(); // Exporta el CSV en segundo plano
        return repo.save(reserva);
    }
    
    // ✅ Eliminar reserva (ADMIN cualquiera / USUARIO la suya)
    @DeleteMapping("/{id}")
     @PreAuthorize("hasAnyAuthority('ADMIN','USUARIO')")
    public void eliminar(@PathVariable Long id, HttpServletRequest request) {
        String rol = (String) request.getAttribute("rol");
        String email = (String) request.getAttribute("email");

        Reserva reserva = repo.findById(id).orElseThrow();

        if (!"ADMIN".equals(rol) && !reserva.getPersona().getEmail().equals(email)) {
            throw new RuntimeException("❌ No tienes permiso para eliminar esta reserva.");
        }

        repo.deleteById(id);
        csvExportService.generarCSVAsync();
    }
}
