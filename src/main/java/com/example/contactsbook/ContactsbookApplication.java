package com.example.contactsbook;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = DataSourceAutoConfiguration.class)
public class ContactsbookApplication {

	public static void main(String[] args) {
		SpringApplication.run(ContactsbookApplication.class, args);
	}

}
