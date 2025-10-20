package com.example.reservas.tools;

import java.io.BufferedWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;

public class ExportReservas {

    public static void main(String[] args) {
        String jdbcUrl = "jdbc:h2:file:./data/reservasdb;AUTO_SERVER=TRUE";
        String user = "sa";
        String pass = "";
        String outPath = "data/reservas.csv";

        try {
            exportToCSV(jdbcUrl, user, pass, outPath);
            System.out.println("✅ CSV generado correctamente en: " + outPath);
        } catch (Exception e) {
            //e.printStackTrace();
        }
    }

    public static void exportToCSV(String jdbcUrl, String user, String pass, String outPath) throws Exception {
        Path dir = Paths.get("data");
        if (!Files.exists(dir)) Files.createDirectories(dir);

        String sql = "SELECT id, persona_id, sala_id, articulo_id, fecha_hora_inicio, fecha_hora_fin FROM reserva ORDER BY fecha_hora_inicio";

        try (Connection conn = DriverManager.getConnection(jdbcUrl, user, pass);
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery();
             BufferedWriter bw = Files.newBufferedWriter(Paths.get(outPath))) {

            bw.write("id,persona_id,sala_id,articulo_id,fecha_hora_inicio,fecha_hora_fin");
            bw.newLine();

            while (rs.next()) {
                int id = rs.getInt("id");
                int personaId = rs.getInt("persona_id");
                int salaId = rs.getInt("sala_id");
                Object articuloObj = rs.getObject("articulo_id");
                String articuloId = articuloObj == null ? "" : String.valueOf(rs.getInt("articulo_id"));
                Timestamp inicio = rs.getTimestamp("fecha_hora_inicio");
                Timestamp fin = rs.getTimestamp("fecha_hora_fin");

                String line = String.format("%d,%d,%d,%s,%s,%s",
                        id, personaId, salaId, articuloId, inicio, fin);
                bw.write(line);
                bw.newLine();
            }

            System.out.println("✅ Exportación finalizada correctamente.");
        }
    }
}
