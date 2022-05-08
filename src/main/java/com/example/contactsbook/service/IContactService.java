package com.example.contactsbook.service;

import java.util.List;
import java.util.Optional;

import com.example.contactsbook.model.Contact;


public interface IContactService 
{
    List<Contact> all();
    Contact findById(int id);
    
    void save(Contact contact);
    void update(Contact contact);
    void delete(int id);
}
