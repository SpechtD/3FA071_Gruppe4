package dev.hv;

import dev.hv.dao.DbConnection;
import dev.hv.services.CSVReader;
import java.nio.file.Path;


public class Main {

    public static void main(String[] args) {
        
        DbConnection.getInstance().openConnection(DbConnection.getLoginProperties());
        DbConnection.getInstance().createAllTables();
        CSVReader.parseCustomer(Path.of("src/main/resources/customers.csv"));
        CSVReader.parseReading(Path.of("dateien//csv"));
        CSVReader.parseReading(Path.of("dateien/csv"));
        CSVReader.parseReading(Path.of("dateien/csv"));
    
        Server.startServer("https://localhost:8080");
    }
    
}
