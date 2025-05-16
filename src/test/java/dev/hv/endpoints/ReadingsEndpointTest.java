package dev.hv.endpoints;

import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;

import dev.hv.Server;
import dev.hv.dao.DbConnection;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

import static io.restassured.RestAssured.*;
import static org.hamcrest.Matchers.*;

@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class ReadingsEndpointTest {

  private UUID testReadingId;
  private UUID testCustomerId;

  @BeforeAll
  static void setup() {
    RestAssured.baseURI = "http://localhost";
    RestAssured.port = 8080;
    RestAssured.basePath = "/";
    DbConnection.getInstance().openConnection(DbConnection.getLoginProperties());
    DbConnection.getInstance().createAllTables();
    Server.startServer("http://localhost:8080/");
  }

  @AfterAll
  static void tearDown() {
    DbConnection.getInstance().closeConnection();
    Server.stopServer();
  }

  @BeforeEach
  void setupTestData() {
    // Create a test customer and reading if they don't exist
    if (testCustomerId == null) {
      // Create a customer first
      String customerJson = "{"
          + "\"customer\": {"
          + "\"firstName\": \"Test\","
          + "\"lastName\": \"Customer\","
          + "\"gender\": \"D\""
          + "}"
          + "}";

      Response customerResponse = given()
          .contentType(ContentType.JSON)
          .body(customerJson)
          .when()
          .post("/customers");

      if (customerResponse.getStatusCode() == 201) {
        testCustomerId = UUID.fromString(customerResponse.jsonPath().getString("customer.id"));
      }
    }

    if (testReadingId == null && testCustomerId != null) {
      // Create a reading
      String readingJson = "{"
          + "\"reading\": {"
          + "\"customer\": {"
          + "\"uuid\": \"" + testCustomerId + "\","
          + "\"firstName\": \"Test\","
          + "\"lastName\": \"Customer\","
          + "\"gender\": \"D\""
          + "},"
          + "\"dateOfReading\": \"" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + "\","
          + "\"meterId\": \"TEST123\","
          + "\"substitute\": false,"
          + "\"meterCount\": 42.5,"
          + "\"kindOfMeter\": \"STROM\""
          + "}"
          + "}";

      Response readingResponse = given()
          .contentType(ContentType.JSON)
          .body(readingJson)
          .when()
          .post("/readings");

      if (readingResponse.getStatusCode() == 201) {
        testReadingId = UUID.fromString(readingResponse.jsonPath().getString("reading.id"));
      }
    }
  }

  @Test
  void testGetAllReadings() {
    given()
        .when()
        .get("/readings")
        .then()
        .statusCode(200)
        .contentType(ContentType.JSON)
        .body("readings", notNullValue());
  }

  @Test
  void testGetReadingsWithCustomerFilter() {
    given()
        .queryParam("customer", testCustomerId.toString())
        .when()
        .get("/readings")
        .then()
        .statusCode(200)
        .contentType(ContentType.JSON);
  }

  @Test
  void testGetReadingsWithDateRange() {
    LocalDate start = LocalDate.now().minusDays(30);
    LocalDate end = LocalDate.now();

    given()
        .queryParam("start", start.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
        .queryParam("end", end.format(DateTimeFormatter.ofPattern("yyyy-MM-dd")))
        .when()
        .get("/readings")
        .then()
        .statusCode(200)
        .contentType(ContentType.JSON);
  }

  @Test
  void testGetReadingsWithKindOfMeter() {
    given()
        .queryParam("kindOfMeter", "STROM")
        .when()
        .get("/readings")
        .then()
        .statusCode(200)
        .contentType(ContentType.JSON);
  }

  @Test
  void testGetReadingById() {
    given()
        .pathParam("id", testReadingId)
        .when()
        .get("/readings/{id}")
        .then()
        .statusCode(200)
        .contentType(ContentType.JSON)
        .body("reading.id", equalTo(testReadingId.toString()));
  }

  @Test
  void testGetReadingByInvalidId() {
    UUID invalidId = UUID.randomUUID();
    given()
        .pathParam("id", invalidId)
        .when()
        .get("/readings/{id}")
        .then()
        .statusCode(404);
  }

  @Test
  void testCreateReading() {
    String readingJson = "{"
        + "\"reading\": {"
        + "\"customer\": {"
        + "\"uuid\": \"" + testCustomerId + "\","
        + "\"firstName\": \"Test\","
        + "\"lastName\": \"Customer\","
        + "\"gender\": \"D\""
        + "},"
        + "\"dateOfReading\": \"" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + "\","
        + "\"meterId\": \"NEW123\","
        + "\"substitute\": true,"
        + "\"meterCount\": 100.5,"
        + "\"kindOfMeter\": \"WASSER\""
        + "}"
        + "}";

    given()
        .contentType(ContentType.JSON)
        .body(readingJson)
        .when()
        .post("/readings")
        .then()
        .statusCode(201)
        .contentType(ContentType.JSON)
        .body("reading.id", notNullValue())
        .body("reading.meterId", equalTo("NEW123"));
  }

  @Test
  void testCreateReadingWithInvalidData() {
    String invalidReadingJson = "{"
        + "\"reading\": {"
        + "\"customer\": {"
        + "\"uuid\": \"" + testCustomerId + "\""
        + "},"
        // Missing required fields
        + "\"meterId\": \"NEW123\""
        + "}"
        + "}";

    given()
        .contentType(ContentType.JSON)
        .body(invalidReadingJson)
        .when()
        .post("/readings")
        .then()
        .statusCode(400);
  }

  @Test
  void testUpdateReading() {
    given();

    String updatedReadingJson = "{"
        + "\"reading\": {"
        + "\"id\": \"" + testReadingId + "\","
        + "\"customer\": {"
        + "\"uuid\": \"" + testCustomerId + "\","
        + "\"firstName\": \"Test\","
        + "\"lastName\": \"Customer\","
        + "\"gender\": \"D\""
        + "},"
        + "\"dateOfReading\": \"" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + "\","
        + "\"meterId\": \"UPDATED123\","
        + "\"substitute\": false,"
        + "\"meterCount\": 200.0,"
        + "\"kindOfMeter\": \"HEIZUNG\""
        + "}"
        + "}";

    given()
        .contentType(ContentType.JSON)
        .body(updatedReadingJson)
        .when()
        .put("/readings")
        .then()
        .statusCode(200);
  }

  @Test
  void testDeleteReading() {
    given()
        .pathParam("id", testReadingId)
        .when()
        .delete("/readings/{id}")
        .then()
        .statusCode(200)
        .contentType(ContentType.JSON)
        .body("reading.id", equalTo(testReadingId.toString()));
  }
}
