package dev.hv.dao;
import dev.hv.Customer;
import dev.hv.dao.DbConnection;
import dev.hv.model.Gender;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.UUID;


public class CustomerDao implements IDao<Customer> {

   private Connection connection;

   public CustomerDao(){
       //TODO Insert Connection class method

       this.connection = connection;

   }

    @Override
    public void create(Customer customer) {
        //String sql ="INSERT INTO Customer (UUID, firstName, lastName, birthDate, gender) VALUES (UUID, firstName, lastName, birthDate, gender);";

        try (PreparedStatement statement = connection.prepareStatement("""
              INSERT INTO Customer (UUID, firstName, lastName, birthDate, gender)
              VALUES (?, ?, ?, ?, ? )
              """)) {
            statement.setObject(1, customer.getId());
            statement.setString(2, customer.getFirstName());
            statement.setString(3, customer.getLastName());
            statement.setObject(4, customer.getBirthDate());
            statement.setObject(5, customer.getGender());

            int rowsInserted = statement.executeUpdate();

            if (rowsInserted == 0) {
                // Handle the case where no rows were updated
                throw new RuntimeException("No Rows were inserted for your Input: Type or formating error");
            }

        } catch (SQLException e) {
            throw new RuntimeException("CustomerDao create Failure: " + e);
        }


    }

    @Override
    public Customer read(UUID id) {


        try (PreparedStatement statement = connection.prepareStatement("""
            SELECT *
            FROM Customer
            WHERE UUID = ?
            """)) {

            statement.setObject(1, id);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                    // Assuming your Customer class has the following fields: firstName, lastName, birthDate, gender
                    String firstName = resultSet.getString("firstName");
                    String lastName = resultSet.getString("lastName");
                    LocalDate birthDate = resultSet.getObject("birthDate", LocalDate.class);
                    String genderString = resultSet.getString("gender");
                    Gender gender = Gender.valueOf(genderString);

                    // Create and return the Customer object
                    return new Customer(id, firstName, lastName, gender, birthDate);
                } else {
                    // No customer found
                    return null;
                }
            }
        } catch (SQLException e) {
            throw new RuntimeException("CustomerDao read failure: " + e.getMessage(), e);
        }
    }

    @Override
    public void update(Customer customer) {
        //String sql ="";

        try (PreparedStatement statement = connection.prepareStatement("""
              UPDATE Customer
              SET firstName = ?, lastName = ?, birthDate = ?, gender = ?
              WHERE CustomerID = ?
              """)) {
            statement.setString(1, customer.getFirstName());
            statement.setString(2, customer.getLastName());
            statement.setObject(3, customer.getBirthDate());
            statement.setObject(4, customer.getGender());
            statement.setObject(5, customer.getId());

            int rowsUpdated = statement.executeUpdate();

            if (rowsUpdated == 0) {
                // Handle the case where no rows were updated
                throw new RuntimeException("No customer found with the provided ID: " + customer.getId());
            }
        } catch (SQLException e) {
            throw new RuntimeException("CustomerDao update Failure: " + e);
        }
    }

    @Override
    public void delete(UUID id) {
        //String sql ="DELETE FROM Customers WHERE CustomerName='Alfreds Futterkiste';";

        try (PreparedStatement statement = connection.prepareStatement("""
                DELETE * FROM Customer
                WHERE CustomerID = ?
                """)) {
            statement.setObject(1, id);

            int rowsUpdated = statement.executeUpdate();

            if (rowsUpdated == 0) {
                // Handle the case where no rows were updated
                throw new RuntimeException("No customer found with the provided ID");
            }
        } catch (SQLException e) {
            throw new RuntimeException("CustomerDao delete Failure: " + e);
        }
    }
}
