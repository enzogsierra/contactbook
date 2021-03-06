package com.example.contactsbook.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class ImageService 
{
    private final String folder = "images//";

    public String saveImage(MultipartFile file) throws IOException
    {
        // There's no file, then return the default picture
        if(file.isEmpty()) return "default.jpg";

        // There's file
        final String ext = getFileExtension(file.getOriginalFilename()).get(); // Get image file extension
        final String filename = randomString(16) + "." + ext; // Set a filename based on its pictureId + extension

        byte[] bytes = file.getBytes();
        Path path = Paths.get(folder + filename);
        Files.write(path, bytes);
        
        return filename;
    }

    public void deleteImage(String filename)
    {
        File file = new File(folder + filename);
        file.delete();
    }


    // Utils
    public Optional<String> getFileExtension(String filename) 
    {
        return Optional.ofNullable(filename)
          .filter(f -> f.contains("."))
          .map(f -> f.substring(filename.lastIndexOf(".") + 1));
    }

    public static String randomString(int size)
    {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvxyz0123456789";
        StringBuilder sb = new StringBuilder(size);

        for(int i = 0; i < size; i++)
        {
            int index = (int)(chars.length() * Math.random());
            sb.append(chars.charAt(index)); 
        }
        return sb.toString();
    }
}
