package com.example.reservas.service;

import com.example.reservas.model.Reserva;
import com.example.reservas.repository.ReservaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class ReservaPredictionService {

    private final ReservaRepository reservaRepo;

    public ReservaPredictionService(ReservaRepository reservaRepo) {
        this.reservaRepo = reservaRepo;
    }

    /**
     * Cuenta reservas por día entre start (inclusive) y end (inclusive).
     */
    public Map<LocalDate, Long> countReservationsPerDay(Long salaId, LocalDate start, LocalDate end) {
        LocalDateTime startDt = start.atStartOfDay();
        LocalDateTime endDt = end.atTime(LocalTime.MAX);

        List<Reserva> reservas = reservaRepo.findBySalaIdAndFechaHoraInicioBetween(salaId, startDt, endDt);

        // Agrupar por fecha (solo la parte LocalDate) y contar
        Map<LocalDate, Long> counts = reservas.stream()
                .filter(r -> r.getFechaHoraInicio() != null && r.getSala() != null) // seguridad
                .collect(Collectors.groupingBy(r -> r.getFechaHoraInicio().toLocalDate(), Collectors.counting()));

        // Asegurar que cada día del rango aparezca (llenar con 0)
        Map<LocalDate, Long> full = new LinkedHashMap<>();
        for (LocalDate d = start; !d.isAfter(end); d = d.plusDays(1)) {
            full.put(d, counts.getOrDefault(d, 0L));
        }
        return full;
    }

    /**
     * Predicción por promedio móvil: toma la media simple de los últimos `windowDays` días.
     * Devuelve predicción para el siguiente día (double).
     */
    public double movingAveragePrediction(Long salaId, LocalDate endDate, int windowDays) {
        LocalDate startDate = endDate.minusDays(windowDays - 1); // incluye endDate
        Map<LocalDate, Long> counts = countReservationsPerDay(salaId, startDate, endDate);

        long sum = counts.values().stream().mapToLong(Long::longValue).sum();
        if (windowDays == 0) return 0.0;
        return ((double) sum) / windowDays;
    }

    /**
     * Predicción por regresión lineal simple: x = 0..n-1 (días), y = counts.
     * Devuelve predicción para x = n (el siguiente día).
     */
    public double linearRegressionPrediction(Long salaId, LocalDate endDate, int windowDays) {
        LocalDate startDate = endDate.minusDays(windowDays - 1);
        Map<LocalDate, Long> countsMap = countReservationsPerDay(salaId, startDate, endDate);

        List<Double> y = new ArrayList<>(countsMap.values()).stream()
                .map(Long::doubleValue).collect(Collectors.toList());
        int n = y.size();
        if (n == 0) return 0.0;
        if (n == 1) return y.get(0); // sin datos suficientes, devolvemos el valor conocido

        // X: 0,1,2,...,n-1
        double sumX = IntStream.range(0, n).sum();
        double sumY = y.stream().mapToDouble(Double::doubleValue).sum();
        double sumXY = IntStream.range(0, n).mapToDouble(i -> i * y.get(i)).sum();
        double sumX2 = IntStream.range(0, n).mapToDouble(i -> i * i).sum();

        double denominator = n * sumX2 - sumX * sumX;
        if (Math.abs(denominator) < 1e-9) { // evitar división por cero
            return y.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        }

        double slope = (n * sumXY - sumX * sumY) / denominator;
        double intercept = (sumY - slope * sumX) / n;

        double predictX = n; // siguiente día
        return slope * predictX + intercept;
    }
}
