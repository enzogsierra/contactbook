package com.example.contactbook_aws.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;


@Entity
@Table(name = "contacts")
public class Contact 
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 64)
    @NotBlank(message = "Name must be specified")
    @Size(max = 64, message = "Contact name cannot be longer than 64 characters")
    private String name;
    
    @Column(length = 64)
    @NotBlank(message = "Surname must be specified")
    @Size(max = 64, message = "Contact surname cannot be longer than 64 characters")
    private String surname;

    @Column(length = 15)
    @NotBlank(message = "Phone number must be specified")
    @Size(max = 15, message = "Contact phone number cannot be longer than 15 characters")
    private String phone;

    @Email(message = "Invalid email format")
    private String email;

    @Column(length = 128)
    @Size(max = 128, message = "Contact address is too long, 128 characteres max")
    private String address;

    private String avatarUrl;

    
    public Contact() {
    }

    public Contact(Integer id, String name, String surname, String phone, String email, String address,
            String avatarUrl) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.phone = phone;
        this.email = email;
        this.address = address;
        this.avatarUrl = avatarUrl;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
