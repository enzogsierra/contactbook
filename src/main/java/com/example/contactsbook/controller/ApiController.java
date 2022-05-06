package com.example.contactsbook.controller;

import com.example.contactsbook.model.Contact;

import org.apache.tomcat.util.http.parser.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/contact")
public class ApiController 
{
    @PostMapping(value = "/new")
    public String newContact(@RequestBody Contact contact)
    {
        return contact.toString();
    }
}
