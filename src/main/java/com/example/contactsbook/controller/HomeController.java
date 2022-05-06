package com.example.contactsbook.controller;

import com.example.contactsbook.service.IContactService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;


@Controller
public class HomeController 
{
    @Autowired
    private IContactService contactService;


    @GetMapping(value = {"", "/"})
    public String index(Model model)
    {
        model.addAttribute("contacts", contactService.all());
        return "index";
    }    
}
