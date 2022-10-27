package com.example.contactbook_aws.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.contactbook_aws.model.Contact;
import com.example.contactbook_aws.repository.ContactRepository;


@Service
public class IContactServiceImpl implements IContactService 
{
    @Autowired
    private ContactRepository contactRepository;


    @Override
    public List<Contact> all() {
        return contactRepository.findAll();
    }

    @Override
    public void delete(int id) {
        contactRepository.deleteById(id);
    }

    @Override
    public Contact findById(int id) {
        Optional<Contact> contact = contactRepository.findById(id);
        return (contact.isPresent()) ? contact.get() : null;
    }

    @Override
    public void save(Contact contact) {
        contactRepository.save(contact);
    }

    @Override
    public void update(Contact contact) {
        contactRepository.save(contact);
    }
}
