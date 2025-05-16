package dev.hv.services;

import dev.hv.dao.DbConnection;
import dev.hv.model.Gender;
import dev.hv.model.KindOfMeter;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class CSVReader {

    private static final Logger logger = LogManager.getLogger(CSVReader.class);

    public static int parseReading(Path filePath) {

        long startTime = System.currentTimeMillis();
        int rowsAffected;

        Connection con = DbConnection.getInstance().getConnection();

        String query = "INSERT INTO Reading (id, comment, customer, dateOfReading, kindOfMeter, meterCount, meterId, substitute) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        logger.debug("Importing {}", filePath.toString());
        // Read the file and split the lines into rows and columns and remove double quotes
        try (BufferedReader reader = Files.newBufferedReader(filePath);
             PreparedStatement preparedStatement = con.prepareStatement(query)) {
            reader.lines()
                    .forEach(line -> {

                        try {
                            String[] cells = line.replace("\"", "").split(";", 3);
                            if (cells[0].isEmpty()) return; // Skip empty lines
                            if (cells[2].contains("Zählertausch: neue Nummer ")) // Check if the comment mentions meter replacement
                                preparedStatement.setString(7, cells[2].split(" ")[3]); // Extract the new meter id by splitting the comment and taking the last part

                            // Check the first column of the row to determine if it's a special row
                            switch (cells[0]) {
                                case "Kunde" -> preparedStatement.setObject(3, UUID.fromString(cells[1]));

                                case "Zählernummer" -> preparedStatement.setObject(7, cells[1]);

                                case "Datum" -> preparedStatement.setObject(5, (switch (cells[1]) {
                                    case "Zählerstand in MWh" -> KindOfMeter.HEIZUNG;
                                    case "Zählerstand in m³" -> KindOfMeter.WASSER;
                                    case "Zählerstand in kWh" -> KindOfMeter.STROM;
                                    default -> KindOfMeter.UNBEKANNT;
                                }).name()); // Kind of meter


                                default -> {
                                    preparedStatement.setObject(1, UUID.randomUUID()); // ID
                                    preparedStatement.setObject(2, cells[2]); // Comment
                                    preparedStatement.setObject(4, LocalDate.parse(cells[0], DateTimeFormatter.ofPattern("dd.MM.yyyy"))); // Date
                                    preparedStatement.setObject(6, Double.parseDouble(cells[1].replace(",", "."))); // Meter count
                                    preparedStatement.setObject(8, false); // Substitute
                                    preparedStatement.addBatch();
                                }
                            }
                        } catch (SQLException e) {
                            throw new RuntimeException(e);
                        }
                    });

            rowsAffected = Arrays.stream(preparedStatement.executeBatch()).sum();
            logger.debug("Imported {} rows in {} ms", rowsAffected, System.currentTimeMillis() - startTime);
            return rowsAffected;
        } catch (IOException | SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public static int parseCustomer(Path filePath) {

        Connection con = DbConnection.getInstance().getConnection();

        String query = """
                INSERT INTO Customer (id, firstName, lastName, birthDate, gender)
                VALUES (?, ?, ?, ?, ? )
                """;

        try (BufferedReader reader = Files.newBufferedReader(filePath);
             PreparedStatement preparedStatement = con.prepareStatement(query)) {
            reader.lines()
                    .filter(line -> !line.split(",")[0].equals("UUID")) // Filter out the column names
                    .forEach(line -> { // Lambda executed on every line
                        String[] cells = line.split(",");

                        try {
                            preparedStatement.setObject(1, UUID.fromString(cells[0]));
                            preparedStatement.setString(2, cells[2]);
                            preparedStatement.setString(3, cells[3]);
                            preparedStatement.setString(5,
                                    (switch (cells[1]) {
                                        case "Herr" -> Gender.M;
                                        case "Frau" -> Gender.D;
                                        default -> Gender.U;
                                    }).toString());
                            preparedStatement.setObject(4,
                                    cells.length == 5 ? LocalDate.parse(cells[4], DateTimeFormatter.ofPattern("dd.MM.yyyy")) : null); // If the date is missing, set it to null
                            preparedStatement.addBatch();
                        } catch (SQLException e) {
                            throw new RuntimeException(e);
                        }
                    });

            return Arrays.stream(preparedStatement.executeBatch()).sum();

        } catch (IOException | SQLException e) {
            throw new RuntimeException(e);
        }

    }
}