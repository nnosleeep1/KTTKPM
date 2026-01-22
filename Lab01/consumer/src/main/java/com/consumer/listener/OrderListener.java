package com.consumer.listener;

import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class OrderListener {

    @RabbitListener(queues = "${queue.name}")
    public void receiveMessage(String message) {
        System.out.println("Processing: " + message);
    }
}