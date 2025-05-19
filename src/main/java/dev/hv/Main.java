package dev.hv;

import java.nio.file.Files;
import java.nio.file.Path;

import dev.hv.dao.DbConnection;
import dev.hv.services.CSVReader;

public class Main {
  public static void main(String[] args) {
    try {
      Files.createTempDirectory("hv").toFile().getAbsolutePath();
    } catch (Exception e) {
      throw new RuntimeException("Error creating temp directory", e);
    }
    DbConnection.getInstance().openConnection(DbConnection.getLoginProperties());
    DbConnection.getInstance().createAllTables();
    CSVReader.parseCustomer(Path.of("dateien/csv/kunden_utf8.csv"));
    CSVReader.parseReading(Path.of("dateien/csv/heizung.csv"));
    CSVReader.parseReading(Path.of("dateien/csv/strom.csv"));
    CSVReader.parseReading(Path.of("dateien/csv/wasser.csv"));
    Server.startServer("http://localhost:8080/");
  }
}
