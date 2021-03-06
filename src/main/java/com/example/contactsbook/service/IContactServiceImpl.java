package com.example.contactsbook.service;

import java.util.List;
import java.util.Optional;

import com.example.contactsbook.model.Contact;
import com.example.contactsbook.repository.ContactRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


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
    public Contact findById(int id) 
    {
        Contact contact = null;
        Optional<Contact> opt = contactRepository.findById(id);

        if(opt.isPresent()) contact = opt.get();
        return contact;
    }

    @Override
    public void save(Contact contact) {
        contactRepository.save(contact);
    }

    @Override
    public void update(Contact contact) {
        contactRepository.save(contact);
    }

    @Override
    public void delete(int id) {
        contactRepository.deleteById(id);
    }
}
