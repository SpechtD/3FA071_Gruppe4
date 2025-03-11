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
    private static final Logger logger = LogManager.getLogger(DbConnection.class); //Hier werden meine Objekte instanziieren

    private DbConnection() { //Konstruktor
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
    public IDatabaseConnection openConnection(Properties properties) { //wieso nicht prop mitgegeben?
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


