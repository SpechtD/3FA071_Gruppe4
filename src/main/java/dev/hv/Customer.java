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


    @Override
    public UUID getId() {
        return customerDao.read(this.id).id;
    }

    @Override
    public void setId(UUID id) {
        this.id = id;
        customerDao.update(this);
    }

    @Override
    public String getFirstName() {
        return customerDao.read(this.id).firstName;
    }

    @Override
    public void setFirstName(String firstName) {
        this.firstName = firstName;
        customerDao.update(this);
    }

    @Override
    public String getLastName() {
        return customerDao.read(this.id).lastName;
    }

    @Override
    public void setLastName(String lastName) {
        this.lastName = lastName;
        customerDao.update(this);
    }

    public LocalDate getBirthDate() {

        return customerDao.read(this.id).BirthDate;
    }

    public void setBirthDate(LocalDate BirthDate) {
        this.BirthDate = BirthDate;
        customerDao.update(this);
    }

    @Override
    public Gender getGender() {
        return customerDao.read(this.id).gender;
    }

    @Override
    public void setGender(Gender gender) {
        this.gender = gender;
        customerDao.update(this);
    }
}