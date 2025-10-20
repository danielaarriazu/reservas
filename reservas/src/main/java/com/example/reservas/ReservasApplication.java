package com.example.reservas;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

import com.example.reservas.service.CSVExportService;

@SpringBootApplication
@EnableAsync  // 🔹 Habilita ejecución asíncrona en toda la app
public class ReservasApplication implements CommandLineRunner{

	private final CSVExportService csvExportService;

    public ReservasApplication(CSVExportService csvExportService) {
        this.csvExportService = csvExportService;
    }

	public static void main(String[] args) {
		SpringApplication.run(ReservasApplication.class, args);
	}

	@Override
    public void run(String... args) throws Exception {
        System.out.println("🚀 Aplicación iniciada, generando CSV inicial...");
        csvExportService.generarCSVAsync();
        System.out.println("✅ CSV generado automáticamente al iniciar la app.");
    }
}
