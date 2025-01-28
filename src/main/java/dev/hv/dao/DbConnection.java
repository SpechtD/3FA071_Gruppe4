package dev.hv.dao;

import dev.hv.model.IDatabaseConnection;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;

public class DbConnection implements IDatabaseConnection {

    private Connection connection;

    private static DbConnection INSTANCE;
    private static final String DB_Properties = "/db.properties";

    private DbConnection() {
    }

    public static DbConnection getInstance() {
        if (INSTANCE == null) {
            INSTANCE = new DbConnection();
        }
        return INSTANCE;
    }

    public static Properties getLoginProperties() {

        final Properties prop = new Properties();
        try {
            prop.load(DbConnection.class.getResourceAsStream(DB_Properties));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return prop;
    }

    public Connection getConnection() {
        return connection;
    }

    @Override
    public IDatabaseConnection openConnection(Properties properties) {
        //if (connection == null || connection.isClosed()) {

        String username = System.getProperty("user.name");

        String dbUrl = properties.getProperty(username + ".db.url");
        String dbUser = properties.getProperty(username + ".db.user");
        String dbPassword = properties.getProperty(username + ".db.psw", "");

        if (dbUrl == null || dbUser == null) {
            throw new RuntimeException("Database credentials not found for user: " + username);
        }

        try {
            connection = DriverManager.getConnection(dbUrl, dbUser, dbPassword);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        // }
        return this;
    }

    @Override
    public void createAllTables() {
        String createCustomer = "CREATE TABLE IF NOT EXISTS Customer " +
                "(id UUID PRIMARY KEY NOT NULL, " +
                "firstName VARCHAR(50) NOT NULL, " +
                "lastName VARCHAR(50) NOT NULL, " +
                "birthDate DATE, " +
                "gender VARCHAR(1))";
        String createReading = "CREATE TABLE IF NOT EXISTS Reading " +
                "(id UUID PRIMARY KEY NOT NULL," +
                "comment VARCHAR(255) NOT NULL," +
                "customer UUID NOT NULL," +
                "dateOfReading DATE DEFAULT CURRENT_DATE," +
                "kindOfMeter VARCHAR(50)," +
                "meterCount DOUBLE," +
                "meterId VARCHAR(50) NOT NULL," +
                "substitute BIT)";

        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate(createCustomer);
            stmt.executeUpdate(createReading);
        } catch (SQLException e) {
            throw new RuntimeException("createAllTables wasn't successful: " + e);
        }
    }

    @Override
    public void truncateAllTables() {
        String truncateAllTables =
                "TRUNCATE TABLE Reading, Customer";

        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate(truncateAllTables);
        } catch (SQLException e) {
            throw new RuntimeException("truncateAllTables wasn't successful: " + e);
        }
    }

    @Override
    public void removeAllTables() {
        String removeAllTables =
                "DROP TABLE IF EXISTS Reading, Customer";

        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate(removeAllTables);
        } catch (SQLException e) {
            throw new RuntimeException("removeAllTables wasn't successful: " + e);
        }
    }

    public void closeConnection() {
        try {
            connection.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}


