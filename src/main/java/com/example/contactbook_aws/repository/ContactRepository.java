package com.example.contactbook_aws.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.contactbook_aws.model.Contact;


@Repository
public interface ContactRepository extends JpaRepository<Contact, Integer> {
}
