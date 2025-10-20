package com.example.reservas.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        // Retorna el nombre del archivo HTML que está en src/main/resources/templates
        return "index"; 
    }
}
