package dev.hv;

import com.sun.net.httpserver.HttpServer;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.glassfish.jersey.jdkhttp.JdkHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

import java.net.URI;

public class Server {
    static HttpServer server;

    private static final Logger logger = LogManager.getLogger(Server.class);


    static void startServer(String url){
        final String pack = "dev.hv.endpoints";
        logger.debug("Server started on: {}", url);
        final ResourceConfig rc = new ResourceConfig().packages(pack);
        server = JdkHttpServerFactory.createHttpServer(URI.create(url), rc);
    }

    static void stopServer(){
        server.stop(0);
    }

}

