package com.example.contactsbook.controller;

import java.io.IOException;
import java.util.regex.Pattern;

import com.example.contactsbook.model.Contact;
import com.example.contactsbook.service.IContactService;
import com.example.contactsbook.service.ImageService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
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
    @PostMapping(value = {"/new"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public String newContact(Contact contact, @RequestParam("pictureFile") MultipartFile pictureFile) throws IOException
    {
        int statusCode = 200;
        
        // Get values
        int nameLen = contact.getName().length();
        int lastNameLen = contact.getLastName().length();
        int phoneNumberLen = contact.getPhoneNumber().length();
        String email = contact.getEmail();
        int addressLen = contact.getAddress().length();
        String filename = "default.jpg"; // Default filename

        // Check form values
        if(!(nameLen >= 1 && nameLen <= 64)) statusCode = 400;
        else if(!(lastNameLen >= 1 && lastNameLen <= 64)) statusCode = 400;
        else if(!(phoneNumberLen >= 1 && phoneNumberLen <= 15)) statusCode = 400;
        else if(!email.isEmpty() && !isValidEmail(email)) statusCode = 400;
        else if(addressLen >= 128) statusCode = 400;

        // OK - Create new contact
        if(statusCode == 200) 
        {
            if(!pictureFile.isEmpty()) // There's a picture
            {
                filename = imageService.saveImage(pictureFile); // Save image and get the returned filename
            }
            contact.setPictureUrl(filename); // Set picture filename

            // Save contact
            contactService.save(contact);
        }

        // Return statusCode
        return "{\"statusCode\": " + statusCode + ", \"id\": \"" + contact.getId() + "\", \"avatarUrl\": \"" + filename + "\"}";
    }


    @PutMapping("/edit")
    public String editContact(Contact contact, @RequestParam("avatarFile") MultipartFile avatarFile) throws IOException
    {
        Contact tmp = contactService.findById(contact.getId()); // Get actual contact data
        int statusCode = 200;
        
        // Get values
        int nameLen = contact.getName().length();
        int lastNameLen = contact.getLastName().length();
        int phoneNumberLen = contact.getPhoneNumber().length();
        String email = contact.getEmail();
        int addressLen = contact.getAddress().length();
        String avatarUrl = "default.jpg"; // Default avatar

        // Check form values
        if(tmp == null) statusCode = 400;
        else if(!(nameLen >= 1 && nameLen <= 64)) statusCode = 400;
        else if(!(lastNameLen >= 1 && lastNameLen <= 64)) statusCode = 400;
        else if(!(phoneNumberLen >= 1 && phoneNumberLen <= 15)) statusCode = 400;
        else if(!email.isEmpty() && !isValidEmail(email)) statusCode = 400;
        else if(addressLen >= 128) statusCode = 400;

        // OK - Update contact
        if(statusCode == 200)
        {
            if(avatarFile.isEmpty()) // Avatar remains the same
            {
                avatarUrl = tmp.getPictureUrl(); // Keep the same avatar
            }
            else // Update avatar
            {
                if(!tmp.getPictureUrl().equals("default.jpg")) // Check if contact avatar isn't the default one
                {
                    imageService.deleteImage(tmp.getPictureUrl()); // Delete avatar
                }

                avatarUrl = imageService.saveImage(avatarFile); // Create new avatar
            }
            
            // Update contact info
            contact.setPictureUrl(avatarUrl);
            contactService.save(contact);
        }

        return "{\"statusCode\": " + statusCode + ", \"avatarUrl\": \"" + avatarUrl + "\"}";
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
