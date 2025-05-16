package dev.hv.endpoints;

import dev.hv.Reading;
import dev.hv.dao.ReadingDao;
import dev.hv.model.KindOfMeter;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Path("readings")
public class Readings {

  private static final Logger logger = LogManager.getLogger(Readings.class);

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getReadings(
      @QueryParam("customer") UUID customerId,
      @QueryParam("start") String startDate,
      @QueryParam("end") String endDate,
      @QueryParam("kindOfMeter") KindOfMeter kindOfMeter) {

    LocalDate start = null;
    LocalDate end = null;
    try {
      if (startDate != null) {
        start = LocalDate.parse(startDate, DateTimeFormatter.ISO_DATE);
      }
      if (endDate != null) {
        end = LocalDate.parse(endDate, DateTimeFormatter.ISO_DATE);
      }
    } catch (Exception e) {
      return Response.status(Response.Status.BAD_REQUEST)
          .entity("Invalid date format. Use yyyy-MM-dd.").build();
    }

    ReadingDao rd = new ReadingDao();
    List<Reading> readings = rd.find(customerId, start, end, kindOfMeter);

    // Wrap in object to match OpenAPI schema
    return Response.status(Response.Status.OK)
        .entity(java.util.Collections.singletonMap("readings", readings))
        .build();
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response postReading(String body) {
    try {
      // Parse JSON and extract "reading" object
      var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
      var node = mapper.readTree(body).get("reading");
      if (node == null) {
        return Response.status(Response.Status.BAD_REQUEST).entity("Missing 'reading' property").build();
      }
      Reading reading = mapper.treeToValue(node, Reading.class);

      // Assign UUID if missing
      if (reading.getId() == null) {
        reading.setId(java.util.UUID.randomUUID());
      }

      ReadingDao dao = new ReadingDao();
      dao.create(reading);

      return Response.status(Response.Status.CREATED)
          .entity(java.util.Collections.singletonMap("reading", reading))
          .build();
    } catch (Exception e) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Invalid request body: " + e.getMessage()).build();
    }
  }

  @PUT
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response putReading(String body) {
    try {
      var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
      var node = mapper.readTree(body).get("reading");
      if (node == null) {
        return Response.status(Response.Status.BAD_REQUEST).entity("Missing 'reading' property").build();
      }
      Reading reading = mapper.treeToValue(node, Reading.class);

      if (reading.getId() == null) {
        return Response.status(Response.Status.BAD_REQUEST).entity("Missing reading id").build();
      }

      ReadingDao dao = new ReadingDao();
      Reading existing = dao.read(reading.getId());
      if (existing == null) {
        return Response.status(Response.Status.NOT_FOUND).entity("Reading not found").build();
      }

      dao.update(reading);

      return Response.status(Response.Status.OK)
          .entity(java.util.Collections.singletonMap("reading", reading))
          .build();
    } catch (Exception e) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Invalid request body: " + e.getMessage()).build();
    }
  }

  @GET
  @Path("{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getReading(@PathParam("id") UUID id) {
    ReadingDao readingDao = new ReadingDao();
    Reading reading = readingDao.read(id);
    logger.debug("Found Reading: {} {} {}", reading.getId(), reading.getDateOfReading().toString(),
        reading.getKindOfMeter().name());
    return reading != null ? Response.status(Response.Status.OK).entity(reading).build()
        : Response.status(Response.Status.NOT_FOUND).build();
  }

  @DELETE
  @Path("{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response deleteReading(@PathParam("id") UUID id) {
    ReadingDao readingDao = new ReadingDao();
    try {
      readingDao.delete(id);
    } catch (Exception e) {
      return Response.status(Response.Status.NOT_FOUND).entity("Error deleting reading: " + e.getMessage()).build();
    }
    return Response.status(Response.Status.OK).build();
  }
}
