package com.example.worker;

import redis.clients.jedis.Jedis;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.Map;

public class WorkerApp {
    public static void main(String[] args) throws Exception {
        String redisHost = System.getenv().getOrDefault("REDIS_HOST", "redis");
        String postgresHost = System.getenv().getOrDefault("POSTGRES_HOST", "db");
        String postgresPort = System.getenv().getOrDefault("POSTGRES_PORT", "5432");
        String postgresDb = System.getenv().getOrDefault("POSTGRES_DB", "votes");
        String postgresUser = System.getenv().getOrDefault("POSTGRES_USER", "postgres");
        String postgresPassword = System.getenv().getOrDefault("POSTGRES_PASSWORD", "postgres");

        String jdbcUrl = "jdbc:postgresql://" + postgresHost + ":" + postgresPort + "/" + postgresDb;

        try (Connection connection = DriverManager.getConnection(jdbcUrl, postgresUser, postgresPassword);
             Jedis jedis = new Jedis(redisHost, 6379)) {
            ensureTable(connection);

            while (true) {
                Map<String, String> votes = jedis.hgetAll("votes");
                for (Map.Entry<String, String> entry : votes.entrySet()) {
                    upsertVote(connection, entry.getKey(), Integer.parseInt(entry.getValue()));
                }
                Thread.sleep(2000);
            }
        }
    }

    private static void ensureTable(Connection connection) throws Exception {
        try (Statement statement = connection.createStatement()) {
            statement.execute("CREATE TABLE IF NOT EXISTS results (option VARCHAR(50) PRIMARY KEY, total INT NOT NULL)");
        }
    }

    private static void upsertVote(Connection connection, String option, int total) throws Exception {
        try (PreparedStatement statement = connection.prepareStatement(
                "INSERT INTO results(option, total) VALUES (?, ?) ON CONFLICT (option) DO UPDATE SET total = EXCLUDED.total")) {
            statement.setString(1, option);
            statement.setInt(2, total);
            statement.executeUpdate();
        }
    }
}
