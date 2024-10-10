package dev.hv.model;

import java.time.LocalDate;

public interface ICustomer {

    void setFirstName(String fistName);
    void setLastName(String lastName);
    void setBirthDate(LocalDate birthDate);
    void setGender(Gender gender);

    String getFirstName();
    String getLastName();
    LocalDate getBirthDate();
    Gender getGender();

}

