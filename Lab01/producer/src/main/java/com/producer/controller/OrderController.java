package com.producer.controller;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class OrderController {

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Value("${queue.name}")
    private String queueName;

    @PostMapping("/send")
    public Map<String, Object> send(@RequestBody Map<String, String> body) {
        String message = body.get("message");

        rabbitTemplate.convertAndSend(queueName, message);

        return Map.of("status", "sent", "message", message);
    }
}