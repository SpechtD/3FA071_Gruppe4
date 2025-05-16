package dev.hv.dao;

import dev.hv.Customer;
import dev.hv.Reading;
import dev.hv.model.Gender;
import dev.hv.model.KindOfMeter;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ReadingDao implements IDao<Reading> {

  private final Connection connection = DbConnection.getInstance().getConnection();

  // use PreparedStatement to avoid SQLException
  @Override
  public void create(Reading reading) {
    String sql = "INSERT INTO Reading (id, comment, customer, dateOfReading, kindOfMeter, meterCount, meterId, substitute) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

    try (PreparedStatement statement = connection.prepareStatement(sql)) { // PreparedStatement checks sql command to
                                                                           // avoid sql injections
      statement.setObject(1, reading.getId());
      statement.setString(2, reading.getComment());
      statement.setObject(3, reading.getCustomer());
      statement.setObject(4, reading.getDateOfReading());
      statement.setObject(5, reading.getKindOfMeter());
      statement.setDouble(6, reading.getMeterCount());
      statement.setString(7, reading.getMeterId());
      statement.setBoolean(8, reading.getSubstitute());

      int insertedRows = statement.executeUpdate(); // indicates the number of rows affected
      if (insertedRows != 1) {
        throw new RuntimeException("Null or more than one rows would be changed."); // to console a RuntimeError when
                                                                                    // null or more than one rows are
                                                                                    // changed
      }
    } catch (SQLException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public Reading read(UUID id) {
    String sql = "SELECT Reading.id, " +
        "Reading.comment, " +
        "Reading.customer, " +
        "Reading.dateOfReading, " +
        "Reading.kindOfMeter, " +
        "Reading.meterCount, " +
        "Reading.meterId, " +
        "Reading.substitute, " +
        "Customer.id, " +
        "Customer.firstName, " +
        "Customer.lastName, " +
        "Customer.birthDate, " +
        "Customer.gender " +
        "FROM Reading " +
        "JOIN Customer ON Reading.customer=Customer.id " +
        "WHERE Reading.id = ?";

    try (PreparedStatement statement = connection.prepareStatement(sql)) {
      statement.setObject(1, id);

      try (ResultSet resultSet = statement.executeQuery()) {
        // logger.debug("Search for {} returned {} rows", id,
        // resultSet.getString("kindOfMeter"));
        if (resultSet.next()) {
          return new Reading(
              resultSet.getObject("Reading.id", UUID.class),
              resultSet.getString("Reading.comment"),
              new Customer(resultSet.getObject(
                  "Customer.id", UUID.class),
                  resultSet.getString("Customer.firstName"),
                  resultSet.getString("Customer.lastName"),
                  Gender.valueOf(resultSet.getString("Customer.gender")),
                  resultSet.getObject("Customer.birthDate", LocalDate.class)),
              resultSet.getObject("Reading.dateOfReading", LocalDate.class),
              KindOfMeter.valueOf(resultSet.getString("Reading.kindOfMeter")),
              resultSet.getDouble("Reading.meterCount"),
              resultSet.getString("Reading.meterId"),
              resultSet.getBoolean("Reading.substitute"));
        } else {
          return null;
        }
      }
    } catch (SQLException e) {
      throw new RuntimeException(e);
    }
  }

  @Override
  public void update(Reading reading) {
    String sql = "UPDATE Reading SET comment = ?, customer = ?, dateOfReading = ?, kindOfMeter = ?, meterCount = ?, meterId = ?, substitute = ? WHERE id = ?";

    try (PreparedStatement statement = connection.prepareStatement(sql)) {
      statement.setString(1, reading.getComment());
      statement.setObject(2, reading.getCustomer());
      statement.setObject(3, reading.getDateOfReading());
      statement.setObject(4, reading.getKindOfMeter());
      statement.setDouble(5, reading.getMeterCount());
      statement.setString(6, reading.getMeterId());
      statement.setBoolean(7, reading.getSubstitute());
      statement.setObject(8, reading.getId());

      int insertedRows = statement.executeUpdate();
      if (insertedRows != 1) {
        throw new RuntimeException("Null or more than one rows would be changed.");
      }

    } catch (SQLException e) {
      throw new RuntimeException(e);
    }

  }

  @Override
  public void delete(UUID id) {
    String sql = "DELETE FROM Reading WHERE id=?";

    try (PreparedStatement statement = connection.prepareStatement(sql)) {
      statement.setObject(1, id);

      int insertedRows = statement.executeUpdate();
      if (insertedRows != 1) {
        throw new RuntimeException("Null or more than one rows would be changed.");
      }

    } catch (SQLException e) {
      throw new RuntimeException(e);
    }
  }

  public List<Reading> find(UUID customerId, LocalDate startDate, LocalDate endDate, KindOfMeter kindOfMeter) {
    List<Reading> results = new ArrayList<>();
    StringBuilder sql = new StringBuilder(
        "SELECT Reading.id, " +
            "Reading.comment, " +
            "Reading.customer, " +
            "Reading.dateOfReading, " +
            "Reading.kindOfMeter, " +
            "Reading.meterCount, " +
            "Reading.meterId, " +
            "Reading.substitute, " +
            "Customer.id, " +
            "Customer.firstName, " +
            "Customer.lastName, " +
            "Customer.birthDate, " +
            "Customer.gender " +
            "FROM Reading " +
            "JOIN Customer ON Reading.customer=Customer.id ");

    List<Object> parameters = new ArrayList<>();
    boolean hasCondition = false;

    if (customerId != null) {
      sql.append(hasCondition ? "AND " : "WHERE ");
      sql.append("Reading.customer = ? ");
      parameters.add(customerId);
      hasCondition = true;
    }
    if (startDate != null) {
      sql.append(hasCondition ? "AND " : "WHERE ");
      sql.append("Reading.dateOfReading >= ? ");
      parameters.add(startDate);
      hasCondition = true;
    }
    if (endDate != null) {
      sql.append(hasCondition ? "AND " : "WHERE ");
      sql.append("Reading.dateOfReading <= ? ");
      parameters.add(endDate);
      hasCondition = true;
    }
    if (kindOfMeter != null) {
      sql.append(hasCondition ? "AND " : "WHERE ");
      sql.append("Reading.kindOfMeter = ? ");
      parameters.add(kindOfMeter.name());
    }

    try (PreparedStatement statement = connection.prepareStatement(sql.toString())) {
      for (int i = 0; i < parameters.size(); i++) {
        Object param = parameters.get(i);
        if (param instanceof LocalDate) {
          statement.setObject(i + 1, param);
        } else if (param instanceof KindOfMeter) {
          statement.setString(i + 1, param.toString());
        } else {
          statement.setObject(i + 1, param);
        }
      }

      try (ResultSet resultSet = statement.executeQuery()) {
        while (resultSet.next())
          results.add(new Reading(
              resultSet.getObject("Reading.id", UUID.class),
              resultSet.getString("Reading.comment"),
              new Customer(resultSet.getObject(
                  "Customer.id", UUID.class),
                  resultSet.getString("Customer.firstName"),
                  resultSet.getString("Customer.lastName"),
                  Gender.valueOf(resultSet.getString("Customer.gender")),
                  resultSet.getObject("Customer.birthDate", LocalDate.class)),
              resultSet.getObject("Reading.dateOfReading", LocalDate.class),
              KindOfMeter.valueOf(resultSet.getString("Reading.kindOfMeter")),
              resultSet.getDouble("Reading.meterCount"),
              resultSet.getString("Reading.meterId"),
              resultSet.getBoolean("Reading.substitute")));
      }
    } catch (SQLException e) {
      throw new RuntimeException(e);
    }
    return results;
  }
}
