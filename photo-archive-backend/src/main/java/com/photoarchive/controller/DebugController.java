package com.photoarchive.controller;

import com.photoarchive.entity.Person;
import com.photoarchive.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/debug")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DebugController {

    private final PersonRepository personRepository;

    @GetMapping("/people")
    public ResponseEntity<List<Person>> getAllPeople() {
        return ResponseEntity.ok(personRepository.findAll());
    }

    @GetMapping("/people/search")
    public ResponseEntity<List<Person>> searchPeople(@RequestParam String name) {
        List<Person> results = personRepository.findByNameContaining(name);
        return ResponseEntity.ok(results);
    }
}
