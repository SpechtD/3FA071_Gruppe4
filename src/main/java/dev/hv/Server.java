package dev.hv;

import com.sun.net.httpserver.HttpServer;
import org.glassfish.jersey.jdkhttp.JdkHttpServerFactory;
import org.glassfish.jersey.server.ResourceConfig;

import java.net.URI;

public class Server {
    static HttpServer server;

    static void startServer(String url){
        final String pack = "dev.hv.resource";
        System.out.println("Start server");
        System.out.println(url);
        final String pack = "dev.hv.endpoints";
        final ResourceConfig rc = new ResourceConfig().packages(pack);
        server = JdkHttpServerFactory.createHttpServer(URI.create(url), rc);
    }

    static void stopServer(){
        server.stop(0);
    }

}

