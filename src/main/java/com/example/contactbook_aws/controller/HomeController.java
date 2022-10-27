package com.example.contactbook_aws.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

import com.example.contactbook_aws.service.IContactService;


@Controller
public class HomeController 
{
    @Autowired
    private IContactService contactRepository;


    @GetMapping("/")
    public String home(Model model)
    {
        model.addAttribute("contacts", contactRepository.all());
        return "index";
    }
}
