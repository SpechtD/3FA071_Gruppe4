package dev.hv;
import java.time.LocalDate;
import java.util.UUID;

import dev.hv.dao.CustomerDao;
import dev.hv.model.Gender;
import dev.hv.model.ICustomer;

public class Customer implements ICustomer {
    private UUID id;
    private String firstName;
    private String lastName;
    private Gender gender;
    private LocalDate BirthDate;
    CustomerDao customerDao = new CustomerDao();

    // Constructor
    public Customer(UUID id, String firstName,String lastName, Gender gender, LocalDate BirthDate) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.BirthDate = BirthDate;
        customerDao.create(this);
    }


    // Getter and Setter for id
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    // Getter and Setter for BirthDate
    @Override
    public LocalDate getBirthDate() {
        return BirthDate;
    }

    @Override
    public void setBirthDate(LocalDate BirthDate) {
        this.BirthDate = BirthDate;
    }
}