package com.example.contactsbook.controller;

import java.io.IOException;
import java.util.regex.Pattern;

import com.example.contactsbook.model.Contact;
import com.example.contactsbook.service.IContactService;
import com.example.contactsbook.service.ImageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
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
    @Autowired
    private IContactService contactService;

    @Autowired
    private ImageService imageService;


    // New contact
    @PostMapping("/new")
    public int newContact(Contact contact, @RequestParam("pictureFile") MultipartFile pictureFile) throws IOException
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
            // Save image
            String filename = "default.jpg"; // Default filename

            if(!pictureFile.isEmpty()) // There's a picture
            {
                filename = imageService.saveImage(pictureFile); // Save image and get the returned filename
            }
            contact.setPictureUrl(filename); // Set picture filename

            // Save contact
            contactService.save(contact);
        }

        // Return statusCode
        return statusCode;
    }


    // Delete contact
    @DeleteMapping("/delete")
    public int deleteContact(@RequestParam int id)
    {
        int statusCode = 200;

        // Verify if contact id exists
        Contact contact = contactService.findById(id);

        if(contact != null) // Valid contact id
        {
            contactService.delete(id);
        }
        else statusCode = 400; // Invalid contact
       
        return statusCode;
    }


    // Utils
    public static boolean isValidEmail(String email)
    {
        String regex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        
        Pattern pattern = Pattern.compile(regex);
        return pattern.matcher(email).matches();
    }
}
