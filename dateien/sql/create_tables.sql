#delete tables when exists
DROP TABLE IF EXISTS Reading;
DROP TABLE IF EXISTS Customer;


CREATE TABLE IF NOT EXISTS Customer (
    id UUID PRIMARY KEY,
    firstName VARCHAR(50), #50 because one word has around 30 characters and a puffer of 20
    lastName VARCHAR(50),
    birthDate DATE,
    gender CHAR(1)
);

CREATE TABLE IF NOT EXISTS Reading (
    id UUID PRIMARY KEY,
    comment VARCHAR(255),
    customer UUID,
    dateOfReading DATE DEFAULT CURRENT_DATE,
    kindOfMeter VARCHAR(50),
    meterCount DOUBLE,
    meterId VARCHAR(50), //TODO check type
    substitute BIT,
);


ALTER table IReading ADD CONSTRAINT fk_Reading_Customer
    FOREIGN KEY (customer) REFERENCES Customer(id);

# comment to execute: mysql -u root -p hv < C:\Kappelmeier\3FA071_Gruppe4\dateien\sql\create_tables.sql
