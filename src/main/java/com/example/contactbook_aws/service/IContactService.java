package com.example.contactbook_aws.service;

import java.util.List;

import com.example.contactbook_aws.model.Contact;


public interface IContactService 
{
    List<Contact> all();
    Contact findById(int id);

    void save(Contact contact);
    void update(Contact contact);
    void delete(int id);
}
