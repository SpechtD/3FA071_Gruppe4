package dev.hv.endpoints;

import dev.hv.Customer;
import dev.hv.dao.CustomerDao;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;
import java.util.UUID;

@Path("customers")
public class Customers {

  private static final Logger logger = LogManager.getLogger(Customers.class);

  @GET
  @Produces(MediaType.APPLICATION_JSON)
  public Response getCustomers() {

    CustomerDao rd = new CustomerDao();
    List<Customer> customers = rd.findAll();

    // Wrap in object to match OpenAPI schema
    return Response.status(Response.Status.OK)
        .entity(java.util.Collections.singletonMap("customers", customers))
        .build();
  }

  @POST
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response postCustomer(String body) {
    try {
      // Parse JSON and extract "customer" object
      var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
      var node = mapper.readTree(body).get("customer");
      if (node == null) {
        return Response.status(Response.Status.BAD_REQUEST).entity("Missing 'customer' property").build();
      }
      Customer customer = mapper.treeToValue(node, Customer.class);

      CustomerDao dao = new CustomerDao();
      dao.create(customer);

      return Response.status(Response.Status.CREATED)
          .entity(java.util.Collections.singletonMap("customer", customer))
          .build();
    } catch (Exception e) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Invalid request body: " + e.getMessage()).build();
    }
  }

  @PUT
  @Consumes(MediaType.APPLICATION_JSON)
  @Produces(MediaType.APPLICATION_JSON)
  public Response putCustomer(String body) {
    try {
      var mapper = new com.fasterxml.jackson.databind.ObjectMapper();
      var node = mapper.readTree(body).get("customer");
      if (node == null) {
        return Response.status(Response.Status.BAD_REQUEST).entity("Missing 'customer' property").build();
      }
      Customer customer = mapper.treeToValue(node, Customer.class);

      if (customer.getId() == null) {
        return Response.status(Response.Status.BAD_REQUEST).entity("Missing customer id").build();
      }

      CustomerDao dao = new CustomerDao();
      Customer existing = dao.read(customer.getId());
      if (existing == null) {
        return Response.status(Response.Status.NOT_FOUND).entity("Customer not found").build();
      }

      dao.update(customer);

      return Response.status(Response.Status.OK)
          .entity(java.util.Collections.singletonMap("customer", customer))
          .build();
    } catch (Exception e) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Invalid request body: " + e.getMessage()).build();
    }
  }

  @GET
  @Path("{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getCustomer(@PathParam("id") UUID id) {
    CustomerDao customerDao = new CustomerDao();
    Customer customer = customerDao.read(id);
    logger.debug("Found Customer: {} {} {}", customer.getId(), customer.getFirstName(),
        customer.getLastName());
    return customer != null ? Response.status(Response.Status.OK).entity(customer).build()
        : Response.status(Response.Status.NOT_FOUND).build();
  }

  @DELETE
  @Path("{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response deleteCustomer(@PathParam("id") UUID id) {
    CustomerDao customerDao = new CustomerDao();
    try {
      customerDao.delete(id);
    } catch (Exception e) {
      return Response.status(Response.Status.NOT_FOUND).entity("Customer not found").build();
    }
    return Response.status(Response.Status.OK).build();
  }
}
