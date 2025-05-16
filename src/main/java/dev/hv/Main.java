package dev.hv;

import java.nio.file.Path;

import dev.hv.dao.DbConnection;
import dev.hv.services.CSVReader;

public class Main {
  public static void main(String[] args) {
    DbConnection.getInstance().openConnection(DbConnection.getLoginProperties());
    DbConnection.getInstance().createAllTables();
    CSVReader.parseCustomer(Path.of("dateien/csv/kunden_utf8.csv"));
    CSVReader.parseReading(Path.of("dateien/csv/heizung.csv"));
    CSVReader.parseReading(Path.of("dateien/csv/strom.csv"));
    CSVReader.parseReading(Path.of("dateien/csv/wasser.csv"));
    Server.startServer("http://localhost:8080/");
  }
}
