package com.example.contactbook_aws.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import com.example.contactbook_aws.model.Contact;
import com.example.contactbook_aws.service.AwsStorageServiceImpl;
import com.example.contactbook_aws.service.IContactService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
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
    private AwsStorageServiceImpl storageService;

    @Value("${avatar.source.url}")
    private String avatarSourceUrl;


    // New contact contact
    @PostMapping(value = {"/save"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> saveContact(@Valid Contact contact, BindingResult result, @RequestParam MultipartFile avatarFile) throws IOException
    {
        Map<String, Object> json = new HashMap<String, Object>(); // A way to response as a json
        json.put("statusCode", 200); // 200 default status code

        // Check form errors
        if(result.hasErrors())
        {
            List<FieldError> errors = result.getFieldErrors(); // Get fields errors
            for(FieldError error: errors) // Iterate over errors
            {
                json.put("error-" + error.getField(), error.getDefaultMessage()); // Set the field and its default error message
            }

            json.put("statusCode", 406); // Change status code to Not Acceptable
            return json;
        }

        // Valid form
        String avatarUrl = "default.jpg"; // Default value
        if(!avatarFile.isEmpty()) // Avatar uploaded
        {
            avatarUrl = storageService.saveFile(avatarFile); // Save image to aws buckets - also it returns file name
        }

        contact.setAvatarUrl(avatarUrl); 
        contactService.save(contact);

        json.put("id", contact.getId()); // Set the generated contact id (for app.js handling)
        json.put("avatarUrl", avatarUrl); // Set the avatar url (for app.js handling)
        return json;
    }


    // Update contact
    @PutMapping(value = {"/edit"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> editContact(@Valid Contact contact, BindingResult result, @RequestParam MultipartFile avatarFile) throws IOException
    {
        Map<String, Object> json = new HashMap<String, Object>();
        json.put("statusCode", 200);


        // Get contact data
        Contact cur = contactService.findById(contact.getId()); // Get contact data saved in db
        if(cur == null)  // Check if contact doesnt exists
        {
            json.put("statusCode", 400);
            return json;
        }

        // Check form errors
        if(result.hasErrors())
        {
            List<FieldError> errors = result.getFieldErrors(); // Get fields errors
            for(FieldError error: errors) // Iterate over errors
            {
                json.put("error-" + error.getField(), error.getDefaultMessage()); // Set the field and its default error message
            }

            json.put("statusCode", 406); // Change status code to Not Acceptable
            return json;
        }

        // OK - Update contact
        String avatarUrl = "default.jpg"; // Default avatar

        if(avatarFile.isEmpty()) // No new avatar provided
        {
            avatarUrl = cur.getAvatarUrl(); // Keep the same avatar
        }
        else // Update avatar
        {
            if(!cur.getAvatarUrl().equals("default.jpg")) // Check if contact avatar isn't the default one
            {
                storageService.deleteFile(cur.getAvatarUrl()); // Delete avatar
            }
            avatarUrl = storageService.saveFile(avatarFile); // Create new avatar
        }
        
        // Update contact info
        contact.setAvatarUrl(avatarUrl);
        contactService.save(contact);
  

        json.put("avatarUrl", avatarUrl); // Set the avatar url (for app.js handling)
        return json;
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
            if(!contact.getAvatarUrl().equals("default.jpg")) // Check if contact avatar isn't the default one
            {
                storageService.deleteFile(contact.getAvatarUrl()); // Delete avatar
            }

            contactService.delete(id);
        }
        else statusCode = 400; // Invalid contact
       
        return statusCode;
    }


    // Get avatar source url from application.properties to be fetched in app.js
    @PostMapping("/getAvatarSourceUrl")
    public String getAvatarSourceUrl()
    {
        return avatarSourceUrl;
    }
}
