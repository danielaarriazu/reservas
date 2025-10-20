package com.example.reservas.service;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.example.reservas.tools.ExportReservas;

@Service
public class CSVExportService {

    private static final String JDBC_URL = "jdbc:h2:file:./data/reservasdb;AUTO_SERVER=TRUE";
    private static final String USER = "sa";
    private static final String PASS = "";
    private static final String OUT_PATH = "data/reservas.csv";

    @Async
    public void generarCSVAsync() {
        try {
            ExportReservas.exportToCSV(JDBC_URL, USER, PASS, OUT_PATH);
            System.out.println("✅ [ASYNC] CSV generado correctamente en: " + OUT_PATH);
        } catch (Exception e) {
            System.err.println("❌ [ASYNC] Error al generar CSV: " + e.getMessage());
            //e.printStackTrace();
        }
    }

    // Si en algún momento querés exponer la versión sincrónica:
    public void generarCSV() throws Exception {
        ExportReservas.exportToCSV(JDBC_URL, USER, PASS, OUT_PATH);
    }
}
