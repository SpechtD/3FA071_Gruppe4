package dev.hv;

import com.fasterxml.jackson.annotation.JsonFormat;
import dev.hv.model.ICustomer;
import dev.hv.model.IId;
import dev.hv.model.IReading;
import dev.hv.model.KindOfMeter;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class Reading implements IReading, IId {
  private UUID id;
  private String comment;
  private ICustomer customer;
  @JsonFormat(pattern = "yyyy-MM-dd")
  private LocalDate dateOfReading;
  private KindOfMeter kindOfMeter;
  private double meterCount;
  private String meterId;
  private boolean substitute;

  public Reading(UUID id, String comment, ICustomer customer, LocalDate dateOfReading, KindOfMeter kindOfMeter,
      double meterCount, String meterId, boolean substitute) {
    this.id = id;
    this.comment = comment;
    this.customer = customer;
    this.dateOfReading = dateOfReading;
    this.kindOfMeter = kindOfMeter;
    this.meterCount = meterCount;
    this.meterId = meterId;
    this.substitute = substitute;
  }

  @Override
  public void setId(UUID id) {
    this.id = id;
  }

  @Override
  public void setComment(String comment) {
    this.comment = comment;
  }

  @Override
  public void setCustomer(ICustomer customer) {
    this.customer = customer;
  }

  @Override
  public void setDateOfReading(LocalDate dateOfReading) {
    this.dateOfReading = dateOfReading;
  }

  @Override
  public void setKindOfMeter(KindOfMeter kindOfMeter) {
    this.kindOfMeter = kindOfMeter;

  }

  @Override
  public void setMeterCount(Double meterCount) {
    this.meterCount = meterCount;
  }

  @Override
  public void setMeterId(String meterId) {
    this.meterId = meterId;

  }

  @Override
  public void setSubstitute(Boolean substitute) {
    this.substitute = substitute;

  }

  @Override
  public UUID getId() {
    return id;
  }

  @Override
  public String getComment() {
    return comment;
  }

  @Override
  public ICustomer getCustomer() {
    return customer;
  }

  @Override
  public LocalDate getDateOfReading() {
    return dateOfReading;
  }

  @Override
  public KindOfMeter getKindOfMeter() {
    return kindOfMeter;
  }

  @Override
  public Double getMeterCount() {
    return meterCount;
  }

  @Override
  public String getMeterId() {
    return meterId;
  }

  @Override
  public Boolean getSubstitute() {
    return substitute;
  }

  @Override
  public String printDateOfReading() {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd LLLL yyyy");
    return dateOfReading.format(formatter);
  }
}
