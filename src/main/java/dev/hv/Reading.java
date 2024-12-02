package dev.hv;

import dev.hv.model.ICustomer;
import dev.hv.model.IReading;
import dev.hv.model.KindOfMeter;
import dev.hv.dao.ReadingDao;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class Reading implements IReading {
    private UUID id;
    private String comment;
    private ICustomer customer;
    private LocalDate dateOfReading;
    private KindOfMeter kindOfMeter;
    private double meterCount;
    private String meterId;
    private boolean substitute;
    ReadingDao dao = new ReadingDao();


    public Reading(UUID id, String comment, ICustomer customer, LocalDate dateOfReading, KindOfMeter kindOfMeter, double meterCount, String meterId, boolean substitute) {
        this.id = id;
        this.comment = comment;
        this.customer = customer;
        this.dateOfReading = dateOfReading;
        this.kindOfMeter = kindOfMeter;
        this.meterCount = meterCount;
        this.meterId = meterId;
        this.substitute = substitute;
        dao.create(this);
    }

    @Override
    public void setId(UUID id) {
        this.id=id;
        dao.update(this);
    }

    @Override
    public void setComment(String comment) {
        this.comment=comment;
        dao.update(this);
    }

    @Override
    public void setCustomer(ICustomer customer) {
        this.customer=customer;
        dao.update(this);
    }

    @Override
    public void setDateOfReading(LocalDate dateOfReading) {
        this.dateOfReading=dateOfReading;
        dao.update(this);
    }

    @Override
    public void setKindOfMeter(KindOfMeter kindOfMeter) {
        this.kindOfMeter=kindOfMeter;
        dao.update(this);

    }

    @Override
    public void setMeterCount(Double meterCount) {
        this.meterCount=meterCount;
        dao.update(this);
    }

    @Override
    public void setMeterId(String meterId) {
        this.meterId=meterId;
        dao.update(this);
    }

    @Override
    public void setSubstitute(Boolean substitute) {
        this.substitute=substitute;
        dao.update(this);
    }

    @Override
    public UUID getId() { return dao.read(this.id).id; }

    @Override
    public String getComment() { return dao.read(this.id).comment; }

    @Override
    public ICustomer getCustomer() {
        return dao.read(this.id).customer;
    }

    @Override
    public LocalDate getDateOfReading() {
        return dao.read(this.id).dateOfReading;
    }

    @Override
    public KindOfMeter getKindOfMeter() {
        return dao.read(this.id).kindOfMeter;
    }

    @Override
    public Double getMeterCount() {
        return dao.read(this.id).meterCount;
    }

    @Override
    public String getMeterId() {
        return dao.read(this.id).meterId;
    }

    @Override
    public Boolean getSubstitute() {
        return dao.read(this.id).substitute;
    }

    @Override
    public String printDateOfReading() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd LLLL yyyy");
        return dateOfReading.format(formatter);
    }
}
