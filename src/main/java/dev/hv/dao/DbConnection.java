package dev.hv.dao;

import dev.hv.model.IDatabaseConnection;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.utility.DockerImageName;

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
    static MariaDBContainer<?> mariaDb;

    private static final Logger logger = LogManager.getLogger(DbConnection.class);

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
            logger.debug("db.url or db.user not set! Using Testcontainers.");
            mariaDb = new MariaDBContainer<>(
                    DockerImageName.parse("library/mariadb:11.4.4").asCompatibleSubstituteFor("mariadb")
            );
            mariaDb.start();
            dbUrl = mariaDb.getJdbcUrl();
            dbUser = mariaDb.getUsername();
            dbPassword = mariaDb.getPassword();
        }

        try {
            logger.info(dbUrl);
            connection = DriverManager.getConnection(dbUrl, dbUser, dbPassword);
            logger.debug("Successfully connected to database at: {} as {}", dbUrl, dbPassword);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        // }
        return this;
    }

    @Override
    public void createAllTables() {
        if (connection == null) {
            logger.error("Database connection is null");
            throw new RuntimeException("Database connection is not established");
        }
        
        try (Statement stmt = connection.createStatement()) {
            String createCustomer =
                "CREATE TABLE IF NOT EXISTS Customer (" +
                "id VARCHAR(255) PRIMARY KEY NOT NULL, " +
                "firstName VARCHAR(50) NOT NULL, " +
                "lastName VARCHAR(50) NOT NULL, " +
                "birthDate DATE, " +
                "gender CHAR(1))";
            String createReading =
                "CREATE TABLE IF NOT EXISTS Reading (" +
                "id VARCHAR(255) PRIMARY KEY NOT NULL, " +
                "comment VARCHAR(255) NOT NULL, " +
                "customer VARCHAR(255) NOT NULL, " +
                "dateOfReading DATE DEFAULT CURRENT_DATE, " +
                "kindOfMeter VARCHAR(50) NOT NULL, " +
                "meterCount DOUBLE, " +
                "substitute BIT, " +
                "type VARCHAR(50), " +
                "FOREIGN KEY (customer) REFERENCES Customer(id))";
            logger.info("Creating Customer table...");
            stmt.executeUpdate(createCustomer);
            logger.info("Customer table created successfully");
            
            logger.info("Creating Reading table...");
            stmt.executeUpdate(createReading);
            logger.info("Reading table created successfully");
        } catch (SQLException e) {
            logger.error("Failed to create tables: {}", e.getMessage());
            throw new RuntimeException("createAllTables wasn't successful: " + e);
        }
    }

    @Override
    public void truncateAllTables() {
        String truncatealltables = 
            "SET FOREIGN_KEY_CHECKS=0; " +
            "TRUNCATE TABLE Customer; " +
            "TRUNCATE TABLE Reading; " +
            "SET FOREIGN_KEY_CHECKS=1;";

        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate(truncatealltables);
        } catch (SQLException e) {
            throw new RuntimeException("truncateAllTables wasn't successful: " + e);
        }
    }

    @Override
    public void removeAllTables() {
        String removealltables = 
                "DROP TABLE IF EXISTS Reading, Customer";

        try (Statement stmt = connection.createStatement()) {
            stmt.executeUpdate(removealltables);
        } catch (SQLException e) {
            throw new RuntimeException("removealltables wasn't successful: " + e);
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


