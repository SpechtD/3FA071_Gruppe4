package dev.hv.services;

import dev.hv.Customer;
import dev.hv.Reading;
import dev.hv.model.Gender;
import dev.hv.model.KindOfMeter;

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

public class CSVReader {

    public static List<Reading> parseReading(Path filePath) {

        List<List<String>> lines;
        List<Reading> readings = new ArrayList<>();

        Customer customer = null;
        String meterId = "";
        KindOfMeter kindOfMeter = KindOfMeter.UNBEKANNT;

        // Read the file and split the lines into rows and columns and remove double quotes
        try (BufferedReader reader = Files.newBufferedReader(filePath)) {
            lines = reader.lines()
                    .map(line -> Arrays.asList(line.replace("\"", "").split(";", 3)))
                    .toList();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        for (List<String> reading : lines) {
            if (reading.getFirst().isEmpty()) continue; // Skip empty lines
            if (reading.get(2).contains("Zählertausch: neue Nummer ")) // Check if the comment mentions meter replacement
                meterId = reading.get(2).split(" ")[3]; // Extract the new meter id by splitting the comment and taking the last part

            // Check the first column of the row to determine if it's a special row
            switch (reading.get(0)) {
                case "Kunde" -> {
                    customer = Customer.find(UUID.fromString(reading.get(1)));
                }
                case "Zählernummer" -> {
                    meterId = reading.get(1);
                }
                case "Datum" -> {
                    kindOfMeter = switch (reading.get(1)) {
                        case "Zählerstand in MWh" -> KindOfMeter.HEIZUNG;
                        case "Zählerstand in m³" -> KindOfMeter.WASSER;
                        case "Zählerstand in kWh" -> KindOfMeter.STROM;
                        default -> KindOfMeter.UNBEKANNT;
                    };
                }
                // If the row is not special, create a new Reading object
                default -> readings.add(new Reading(
                        reading.get(2),
                        customer,
                        LocalDate.parse(reading.get(0), DateTimeFormatter.ofPattern("dd.MM.yyyy")), // Without DateTimeFormatter, the date is parsed as yyyy-MM-dd
                        kindOfMeter,
                        Double.parseDouble(reading.get(1).replace(",", ".")), // Replace comma with dot because what the fuck is a kilometer 🦅🦅🦅
                        meterId,
                        false
                ));
            }
        }
        return readings;
    }

    public static List<Customer> parseCustomer(Path filePath) {

        List<Customer> customers;

        try (BufferedReader reader = Files.newBufferedReader(filePath)) {
            customers = reader.lines()
                    .filter(line -> !line.split(",")[0].equals("UUID")) // Filter out the column names
                    .map(line -> { // Lambda executed on every line
                        String[] cells = line.split(",");
                        return new Customer(
                                UUID.fromString(cells[0]),
                                cells[2],
                                cells[3],
                                switch (cells[1]) {
                                    case "Herr" -> Gender.M;
                                    case "Frau" -> Gender.D;
                                    default -> Gender.U;
                                },
                                cells.length == 5 ? LocalDate.parse(cells[4], DateTimeFormatter.ofPattern("dd.MM.yyyy")) : null); // If the date is missing, set it to null
                    })
                    .toList();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return customers;
    }
}
