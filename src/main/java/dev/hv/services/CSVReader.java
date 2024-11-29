package dev.hv.services;

import dev.hv.Customer;
import dev.hv.Reading;
import dev.hv.model.KindOfMeter;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Stream;

public class CSVReader {
    public CSVReader(){

    }

    public Reading[] parseReading(Stream<String> fileStream){

        try(fileStream){
            Customer customer;
            String zn;
            KindOfMeter kindOfMeter;
            fileStream.forEach(s -> {
                String line[] = s.split(";");

                Reading reading = new Reading();
                if (line.isEmpty()) return;
                switch (line.get(0)) {
                    case "Kunde" -> {
                        customer = Customer.find(UUID.fromString(line.get(1)));
                        return;
                    }
                    case "Zählernummer" -> {
                        reading.setMeterId(line.get(1));
                        return;
                    }
                    case "Datum" -> {
                        switch (line.get(1)) {
                            case "Zählerstand in MWh":
                                reading.setKindOfMeter(KindOfMeter.HEIZUNG);
                                break;
                            case "Zählerstand in m³":
                                reading.setKindOfMeter(KindOfMeter.WASSER);
                                break;
                            case "Zählerstand in kWh":
                                reading.setKindOfMeter(KindOfMeter.STROM);
                                break;
                            default:
                                reading.setKindOfMeter(KindOfMeter.UNBEKANNT);
                                break;
                        }
                        return;
                    }
                    default -> {
                        reading.setMeterCount(Double.valueOf(line.getFirst()));
                        reading.setDateOfReading(LocalDate.parse(line.getFirst()));
                    }
                }

            });
        }
        return new Reading[0];
    }
}
