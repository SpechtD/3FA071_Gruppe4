package dev.hv;
import java.time.LocalDate;
import java.util.UUID;
import dev.hv.model.Gender;
import dev.hv.model.ICustomer;

public class Customer implements ICustomer {
    private UUID id;
    private String firstName;
    private String lastName;
    private Gender gender;
    private LocalDate BirthDate;

    // Constructor


    public Customer(UUID id, String firstName,String lastName, Gender gender, LocalDate BirthDate) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.BirthDate = BirthDate;
    }


    @Override
    public UUID getId() {
        return id;
    }

    @Override
    public void setId(UUID id) {
        this.id = id;
    }

    @Override
    public String getFirstName() {
        return firstName;
    }

    @Override
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @Override
    public String getLastName() {
        return lastName;
    }

    @Override
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public LocalDate getBirthDate() {
        return BirthDate;
    }

    public void setBirthDate(LocalDate BirthDate) {
        this.BirthDate = BirthDate;
    }

    @Override
    public Gender getGender() {
        return gender;
    }

    @Override
    public void setGender(Gender gender) {
        this.gender = gender;
    }
}