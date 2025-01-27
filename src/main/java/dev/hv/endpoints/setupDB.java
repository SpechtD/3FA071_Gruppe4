package dev.hv.endpoints;

import dev.hv.dao.DbConnection;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("setupDB")
public class setupDB {
    @DELETE
    public Response responseSetupDB() {
        DbConnection.getInstance().removeAllTables();
        return Response.status(Response.Status.OK).build();
    }
}
