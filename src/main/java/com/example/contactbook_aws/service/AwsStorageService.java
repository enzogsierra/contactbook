package com.example.contactbook_aws.service;

import java.io.IOException;

import org.springframework.web.multipart.MultipartFile;

public interface AwsStorageService 
{
    String saveFile(MultipartFile file) throws IOException;
    void deleteFile(String fileName);
}
