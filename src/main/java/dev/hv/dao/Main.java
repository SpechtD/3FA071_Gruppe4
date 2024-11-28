package dev.hv.dao;


import java.sql.SQLException;


public class Main {
    public static void main(String[] args) {
        // Instanz von DbConnection erstellen
        DbConnection.getInstance().openConnection(DbConnection.getLoginProperties());

        DbConnection.getInstance().closeConnection();
    }
}