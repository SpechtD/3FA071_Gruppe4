package dev.hv.dao;

import dev.hv.Reading;
import dev.hv.model.ICustomer;
import dev.hv.model.KindOfMeter;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.LocalDate;
import java.util.UUID;

public class ReadingDao implements IDao<Reading> {

    private final Connection connection = DbConnection.getInstance().getConnection();


    //use PreparedStatement to avoid SQLException
    @Override
    public void create(Reading reading){
        String sql = "INSERT INTO Reading (id, comment, customer, dateOfReading, kindOfMeter, meterCount, meterId, substitute) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (PreparedStatement statement = connection.prepareStatement(sql)){ //PreparedStatement checks sql command to avoid sql injections
            statement.setObject(1, reading.getId());
            statement.setString(2, reading.getComment());
            statement.setObject(3, reading.getCustomer());
            statement.setObject(4, reading.getDateOfReading());
            statement.setObject(5, reading.getKindOfMeter());
            statement.setDouble(6, reading.getMeterCount());
            statement.setString(7, reading.getMeterId());
            statement.setBoolean(8, reading.getSubstitute());

            int insertedRows = statement.executeUpdate(); // indicates the number of rows affected
            if(insertedRows != 1){
                throw new RuntimeException("Null or more than one rows would be changed."); //to console a RuntimeError when null or more than one rows are changed
            }
        }catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public Reading read(UUID id){
        String sql = "SELECT * FROM Reading WHERE id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setObject(1, id);

            try (ResultSet resultSet = statement.executeQuery()) {
                if (resultSet.next()) {
                  String comment = resultSet.getString("comment");
                  ICustomer customer = resultSet.getObject("costumer", ICustomer.class);
                  LocalDate dateOfReading = resultSet.getObject("dateOfReading", LocalDate.class);
                  String kindOfMeterString = resultSet.getString("kindOfMeter");
                  KindOfMeter kindOfMeter = KindOfMeter.valueOf(kindOfMeterString);
                  double meterCount = resultSet.getDouble("meterCount");
                  String meterId = resultSet.getString("meterId");
                  boolean substitute = resultSet.getBoolean("substitute");

                  return new Reading(id,comment, customer, dateOfReading, kindOfMeter, meterCount, meterId, substitute);
                }
                else {
                    return null;
                }
            }
        }catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(Reading reading){
        String sql = "UPDATE Reading SET comment = ?, customer = ?, dateOfReading = ?, kindOfMeter = ?, meterCount = ?, meterId = ?, substitute = ? WHERE id = ?";

        try (PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setString(1, reading.getComment());
            statement.setObject(2, reading.getCustomer());
            statement.setObject(3, reading.getDateOfReading());
            statement.setObject(4, reading.getKindOfMeter());
            statement.setDouble(5, reading.getMeterCount());
            statement.setString(6, reading.getMeterId());
            statement.setBoolean(7, reading.getSubstitute());
            statement.setObject(8, reading.getId());

            int insertedRows = statement.executeUpdate();
            if(insertedRows != 1){
                throw new RuntimeException("Null or more than one rows would be changed.");
            }

        }catch (SQLException e) {
            throw new RuntimeException(e);
        }
                
    }

    @Override
    public void delete(UUID id){
        String sql = "DELETE FROM Reading WHERE id=?";

        try (PreparedStatement statement = connection.prepareStatement(sql)){
            statement.setObject(1, id);

            int insertedRows = statement.executeUpdate();
            if(insertedRows != 1){
                throw new RuntimeException("Null or more than one rows would be changed.");
            }

        }catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }
}
