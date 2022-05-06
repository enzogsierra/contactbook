package com.example.contactsbook;

import com.example.contactsbook.model.Contact;
import org.springframework.data.jpa.repository.JpaRepository;


public interface repository extends JpaRepository<Contact, Integer> {
    
}
