DAO (Data Access Object):
- separate the data access logic from the business logic of an application

  PreparedStatement:
    - check sql command to avoid sql injections
    - PreparedStatement statement = connection.connectToDatabase().prepareStatement(sql) -> connect with database and give database the sql-command with ?
    - "?" are bound to the statement.set() -> longer SQL statements are not possible
    - statement.executeUpdate() -> execute sql and change data in the database and indicate the number of rows affected

  ResultSet:
    - statement.executeQuery() -> indicate a ResultSet which includes the data of the sql-command and preparedStatement
    - if (resultSet.next()) -> resultSet can be used for more than one row of data -> to get in the first row in a resultSet you have to execute resultSet.next()
    - In the If-Statement you save variables with the values of the resultSet/Database
    - Then you can hand the variables over to the class
    - String kindOfMeterString = resultSet.getString("kindOfMeter");
      KindOfMeter kindOfMeter = KindOfMeter.valueOf(kindOfMeterString);
        - kindOfMeter is saved as a String(VARCHAR) in the database
        - we show the system that kindOfMeter have to be the type KindOfMeter(enum)

  SQLException:
    - throw new RuntimeException()
        - soft error -> do not have to be caught at every level
        - SQLExcpection extends from RuntimeException
        - RuntimeException() not printStackTrace() because the system notices the error
	

