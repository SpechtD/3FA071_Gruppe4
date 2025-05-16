package dev.hv;
import java.time.LocalDate;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import dev.hv.model.Gender;
import dev.hv.model.ICustomer;

public class Customer implements ICustomer {
    private final UUID id;
    private String firstName;
    private String lastName;
    private Gender gender;
    @JsonSerialize(as = LocalDate.class)
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate birthDate;

    // Constructor
    public Customer(UUID id, String firstName,String lastName, Gender gender, LocalDate BirthDate) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.birthDate = BirthDate;
    }


    // Getter and Setter for id
    public UUID getId() {
        return id;
    }

    // Getter and Setter for firstName
    @Override
    public String getFirstName() {
        return firstName;
    }

    @Override
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    // Getter and Setter for lastName
    @Override
    public String getLastName() {
        return lastName;
    }

    @Override
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    // Getter and Setter for gender
    @Override
    public Gender getGender() {
        return gender;
    }

    @Override
    public void setGender(Gender gender) {
        this.gender = gender;
    }

    // Getter and Setter for birthDate
    @Override
    public LocalDate getBirthDate() {
        return birthDate;
    }

    @Override
    public void setBirthDate(LocalDate BirthDate) {
        this.birthDate = BirthDate;
    }
}