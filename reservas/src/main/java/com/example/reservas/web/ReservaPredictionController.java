package com.example.reservas.web;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.reservas.service.ReservaPredictionService;

@RestController
@RequestMapping("/prediccion")
public class ReservaPredictionController {

    private final ReservaPredictionService predictionService;

    public ReservaPredictionController(ReservaPredictionService predictionService) {
        this.predictionService = predictionService;
    }

    /**
     * Predicción para una sala.
     *
     * Ejemplos:
     * GET /prediccion/1?method=moving&daysWindow=7
     * GET /prediccion/1?method=linear&daysWindow=14&end=2025-09-30
     */
    @GetMapping("/{idSala}")
    public ResponseEntity<?> predict(
            @PathVariable Long idSala,
            @RequestParam(defaultValue = "moving") String method, // moving|linear
            @RequestParam(defaultValue = "7") int daysWindow,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        LocalDate endDate = (end == null) ? LocalDate.now() : end;
        if (daysWindow <= 0) daysWindow = 7; // fallback

        Map<LocalDate, Long> history = predictionService.countReservationsPerDay(idSala, endDate.minusDays(daysWindow - 1), endDate);

        double prediction;
        if ("linear".equalsIgnoreCase(method)) {
            prediction = predictionService.linearRegressionPrediction(idSala, endDate, daysWindow);
        } else {
            prediction = predictionService.movingAveragePrediction(idSala, endDate, daysWindow);
        }

        // Respuesta simple
        var body = Map.of(
                "salaId", idSala,
                "method", method,
                "daysWindow", daysWindow,
                "endDate", endDate.toString(),
                "predictedNextDay", prediction,
                "history", history
        );

        return ResponseEntity.ok(body);
    }
}

