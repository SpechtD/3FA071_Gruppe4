package dev.hv.dao;


import java.sql.SQLException;


public class Main {
    public static void main(String[] args) {
        // Instanz von DbConnection erstellen
        DbConnection dbConnection = new DbConnection();

        try {
            // Lade und drucke die Datenbankverbindungseigenschaften
            dbConnection.connectToDatabase();
        } catch (SQLException e) {
            System.err.println("Fehler beim Laden der Eigenschaften: " + e.getMessage());
        } finally {
            dbConnection.closeConnection();
        }
    }
}