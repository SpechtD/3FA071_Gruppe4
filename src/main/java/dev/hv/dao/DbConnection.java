package dev.hv.dao;

import java.io.IOException;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DbConnection {

    private String dbUrl;
    private String dbUser;
    private String dbPassword;
    private Connection connection;

    public DbConnection() {
        getLoginProperties();

    }

    private static final String DB_Properties = "/db.properties";

    public void getLoginProperties() {

        final String user_home = System.getProperty("user.home");

        final Properties prop = new Properties();
        try {
            prop.load(Main.class.getResourceAsStream(DB_Properties));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        String username = System.getProperty("user.name");

        dbUrl = prop.getProperty(username + ".db.url");
        dbUser = prop.getProperty(username + ".db.user");
        dbPassword = prop.getProperty(username + ".db.psw", "");

        System.out.println(dbUser);
        System.out.println(dbPassword);
        System.out.println(dbUrl);

        if (dbUrl == null || dbUser == null) {
            throw new RuntimeException("Database credentials not found for user: " + username);
        }

    }

    public Connection connectToDatabase() throws SQLException {
        //if (connection == null || connection.isClosed()) {
        connection = DriverManager.getConnection(dbUrl, dbUser, dbPassword);
        // }
        System.out.println(connection.isValid(10));
        return connection;
    }

    public void closeConnection() {
        try {
            connection.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}

