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

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response getReadings(
            @QueryParam("customer") UUID customerId,
            @QueryParam("start") String startDate,
            @QueryParam("end") String endDate,
            @QueryParam("kindOfMeter") KindOfMeter kindOfMeter){

        ReadingDao rd = new ReadingDao();

        List<Reading> readings = rd.find(customerId,
                startDate != null ? LocalDate.parse(startDate, DateTimeFormatter.ofPattern("dd.MM.yyyy")) : null,
                endDate != null ? LocalDate.parse(endDate, DateTimeFormatter.ofPattern("dd.MM.yyyy")) : null,
                //kindOfMeter != null ? KindOfMeter.valueOf(kindOfMeter) : null);
                kindOfMeter);

        return Response.status(Response.Status.OK).entity(readings).build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    public Response postReadings(){
        return Response.status(Response.Status.OK).build();
    }
    @PUT
    @Produces(MediaType.APPLICATION_JSON)
    public Response putReadings(){
        return Response.status(Response.Status.OK).build();
    }

    @GET
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getReading(@PathParam("id")UUID id){
        ReadingDao readingDao = new ReadingDao();
        Reading reading = readingDao.read(id);
        //logger.debug("Found Reading: {} {} {}", reading.getId(), reading.getDateOfReading().toString(), reading.getKindOfMeter().name());
        return reading != null ?
                Response.status(Response.Status.OK).entity(reading).build() :
                Response.status(Response.Status.NOT_FOUND).build();
    }

    @DELETE
    @Path("{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response deleteReading(@PathParam("id") UUID id){
        return Response.status(Response.Status.OK).build();
    }
}
