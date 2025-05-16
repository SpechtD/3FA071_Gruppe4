package dev.hv.test;
import dev.hv.dao.DbConnection;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.*;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Properties;

import static org.junit.jupiter.api.Assertions.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class DbConnectionTest {

    private DbConnection dbConnection;
    private Properties testProperties;

    @BeforeEach
    void setUp() {
        dbConnection = DbConnection.getInstance();
        String username = System.getProperty("user.name");
        
        // Setting DB Properties correctly
        testProperties = new Properties();
        testProperties.getProperty(username + ".db.url", "");  // Leave empty to trigger TestContainer
        testProperties.getProperty(username + ".db.user", ""); // Leave empty to trigger TestContainer
        testProperties.getProperty(username + ".db.psw", "");  // Leave empty to trigger TestContainer
        
        // Open DB Connection with user properties
        dbConnection.openConnection(testProperties);
    }

    @AfterEach
    void tearDown() {
        dbConnection.closeConnection();
    }

    @Test
    void testOpenConnection() {
        Connection connection = dbConnection.getConnection();
        assertNotNull(connection, "Connection should be established");
        try {
            assertFalse(connection.isClosed(), "Connection should be open");
        } catch (SQLException e) {
            fail("SQL Exception occurred while checking connection state: " + e.getMessage());
        }
    }

    @Test
    void testCreateAllTables() {
        dbConnection.createAllTables();

        // Array of expected table names
        String[] expectedTables = {"Customer", "Reading"}; 

        for (String tableName : expectedTables) {
            try (ResultSet rs = dbConnection.getConnection().getMetaData().getTables(
                    null, null, "%", new String[]{"TABLE"})) {
                boolean found = false;
                while (rs.next()) {
                    if (rs.getString("TABLE_NAME").equalsIgnoreCase(tableName)) {
                        found = true;
                        break;
                    }
                }
                assertTrue(found, "Table '" + tableName + "' should be created");
            } catch (SQLException e) {
                fail("SQL Exception occurred while checking table existence: " + e.getMessage());
            }
        }
    }

    @Test
    void testTruncateAllTables() {
        dbConnection.createAllTables();

        // Insert dummy data
        try (var stmt = dbConnection.getConnection().createStatement()) {
            stmt.executeUpdate("INSERT INTO Customer (id, firstName, lastName) VALUES (UUID(), 'John', 'Doe')");
        } catch (SQLException e) {
            fail("Failed to insert dummy data: " + e.getMessage());
        }

        // Executing Truncate
        dbConnection.truncateAllTables();

        // Verify that the table is empty
        try (var stmt = dbConnection.getConnection().createStatement();
             ResultSet rs = stmt.executeQuery("SELECT COUNT(*) FROM Customer")) {
            assertTrue(rs.next());
            assertEquals(0, rs.getInt(1), "Customer table should be empty after truncation");
        } catch (SQLException e) {
            fail("SQL Exception occurred while checking truncation: " + e.getMessage());
        }
    }

    @Test
    void testRemoveAllTables() {
        dbConnection.createAllTables();
        dbConnection.removeAllTables();

        // Check if tables are dropped
        try (ResultSet rs = dbConnection.getConnection().getMetaData().getTables(null, null, "CUSTOMER", null)) {
            assertFalse(rs.next(), "Customer table should be removed");
        } catch (SQLException e) {
            fail("SQL Exception occurred while checking table existence: " + e.getMessage());
        }
    }

    @Test
    void testCloseConnection() {
        dbConnection.closeConnection();
        try {
            assertTrue(dbConnection.getConnection().isClosed(), "Connection should be closed");
        } catch (SQLException e) {
            fail("SQL Exception occurred while checking connection state: " + e.getMessage());
        }
    }
}
