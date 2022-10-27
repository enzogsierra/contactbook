package com.example.contactbook_aws.service;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;


@Service
public class AwsStorageServiceImpl implements AwsStorageService 
{
    @Autowired
    private AmazonS3 amazonS3;

    @Value("${aws.s3.bucket}")
    private String bucket;

    @Override
    public String saveFile(MultipartFile file) throws IOException
    {
        if(file.isEmpty()) return "default.jpg"; // No avatar provided

        //
        File mainFile = new File(file.getOriginalFilename());

        try(FileOutputStream stream = new FileOutputStream(mainFile)) 
        {
            stream.write(file.getBytes());

            final String ext = getFileExtension(file.getOriginalFilename()).get(); // Get file extension
            final String fileName = randomString(16) + "." + ext; // Set a random name to file, appends its extension

            PutObjectRequest request = new PutObjectRequest(bucket, fileName, mainFile);
            amazonS3.putObject(request); // Send file to aws bucket

            return fileName;
        } 
        catch(IOException e) 
        {
            System.out.println(e.getMessage());
            return null;
        }
    }

    @Override
    @Async
    public void deleteFile(String fileName) 
    {
        final DeleteObjectRequest deleteObjectRequest = new DeleteObjectRequest(bucket, fileName);
        amazonS3.deleteObject(deleteObjectRequest);
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
