package com.example.contactsbook.controller;

import java.util.regex.Pattern;

import com.example.contactsbook.model.Contact;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/contact")
public class ApiController 
{
    @PostMapping(value = "/new")
    public int newContact(@RequestBody Contact contact)
    {
        int statusCode = 200;
        
        // Get values
        int nameLen = contact.getName().length();
        int lastNameLen = contact.getLastName().length();
        int phoneNumberLen = contact.getPhoneNumber().length();
        String email = contact.getEmail();
        int addressLen = contact.getAddress().length();

        // Check form values
        if(!(nameLen >= 1 && nameLen <= 64)) statusCode = 400;
        else if(!(lastNameLen >= 1 && lastNameLen <= 64)) statusCode = 400;
        else if(!(phoneNumberLen >= 1 && phoneNumberLen <= 15)) statusCode = 400;
        else if(!email.isEmpty() && !isValidEmail(email)) statusCode = 400;
        else if(addressLen >= 128) statusCode = 400;

        // OK - Create new contact
        if(statusCode == 200)
        {
        }

        // Return statusCode
        return statusCode;
    }



    //
    public static boolean isValidEmail(String email)
    {
        String regex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        
        Pattern pattern = Pattern.compile(regex);
        return pattern.matcher(email).matches();
    }
}
