package com.photoarchive.service;

import com.photoarchive.entity.Person;
import com.photoarchive.entity.Photo;
import com.photoarchive.repository.PersonRepository;
import com.photoarchive.repository.PhotoRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class CsvImportService {

    private final PhotoRepository photoRepository;
    private final PersonRepository personRepository;
    
    @PersistenceContext
    private EntityManager entityManager;

    public Map<String, Integer> importCsv(InputStream inputStream) throws Exception {
        Map<String, Person> personCache = new HashMap<>();
        int photosImported = 0;
        int peopleImported = 0;
        int lineNumber = 0;

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
            String line;
            boolean firstLine = true;

            while ((line = reader.readLine()) != null) {
                lineNumber++;
                
                if (firstLine) {
                    firstLine = false;
                    continue; // Skip header
                }

                if (line.trim().isEmpty()) {
                    continue;
                }

                try {
                    Photo photo = parseCsvLine(line, personCache);
                    if (photo != null && photo.getVolgnr() != null && !photo.getVolgnr().isEmpty()) {
                        savePhoto(photo);
                        photosImported++;
                        
                        if (photosImported % 50 == 0) {
                            log.info("Imported {} photos so far...", photosImported);
                        }
                    }
                } catch (Exception e) {
                    log.warn("Skipping line {}: {} - Error: {}", lineNumber, line.substring(0, Math.min(100, line.length())), e.getMessage());
                    // Clear the entity manager to prevent session pollution
                    try {
                        entityManager.clear();
                    } catch (Exception clearEx) {
                        log.debug("Could not clear entity manager: {}", clearEx.getMessage());
                    }
                }
            }

            peopleImported = personCache.size();
            log.info("Import completed: {} photos, {} people", photosImported, peopleImported);
        }

        Map<String, Integer> result = new HashMap<>();
        result.put("photos", photosImported);
        result.put("people", peopleImported);
        return result;
    }
    
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected void savePhoto(Photo photo) {
        photoRepository.save(photo);
    }

    private Photo parseCsvLine(String line, Map<String, Person> personCache) {
        try {
            String[] fields = splitCsvLine(line);
            
            if (fields.length < 2) {
                log.debug("Skipping line with insufficient fields");
                return null;
            }

            String volgnr = cleanField(fields[0]);
            if (volgnr == null || volgnr.isEmpty()) {
                log.debug("Skipping line with empty volgnr");
                return null;
            }

            Photo photo = new Photo();
            
            // Field 0: Volgnr
            photo.setVolgnr(volgnr);
            
            // Field 1: Onderwerp
            if (fields.length > 1) {
                photo.setOnderwerp(cleanField(fields[1]));
            }
            
            // Field 2: Date
            if (fields.length > 2) {
                try {
                    parseDates(cleanField(fields[2]), photo);
                } catch (Exception e) {
                    log.debug("Could not parse date for volgnr {}: {}", volgnr, e.getMessage());
                }
            }
            
            // Field 3: People
            if (fields.length > 3) {
                try {
                    Set<Person> people = parsePeople(cleanField(fields[3]), personCache);
                    photo.setPeople(people);
                } catch (Exception e) {
                    log.debug("Could not parse people for volgnr {}: {}", volgnr, e.getMessage());
                    photo.setPeople(new HashSet<>());
                }
            }

            return photo;
        } catch (Exception e) {
            log.error("Error parsing CSV line: {}", e.getMessage());
            return null;
        }
    }

    private String[] splitCsvLine(String line) {
        List<String> fields = new ArrayList<>();
        StringBuilder currentField = new StringBuilder();
        boolean inQuotes = false;

        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);

            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ';' && !inQuotes) {
                fields.add(currentField.toString());
                currentField = new StringBuilder();
            } else {
                currentField.append(c);
            }
        }
        fields.add(currentField.toString());

        return fields.toArray(new String[0]);
    }

    private String cleanField(String field) {
        if (field == null) return "";
        return field.trim().replace("\"", "");
    }

    private void parseDates(String dateStr, Photo photo) {
        if (dateStr == null || dateStr.isEmpty()) {
            return;
        }

        // Try to extract year
        Pattern yearPattern = Pattern.compile("(\\d{4})");
        Matcher yearMatcher = yearPattern.matcher(dateStr);
        
        if (yearMatcher.find()) {
            try {
                photo.setYearOnly(Integer.parseInt(yearMatcher.group(1)));
            } catch (Exception e) {
                log.warn("Could not parse year from: " + dateStr);
            }
        }

        // Try to parse full dates (YYYYMMDD format)
        Pattern datePattern = Pattern.compile("(\\d{8})");
        Matcher dateMatcher = datePattern.matcher(dateStr);
        
        List<LocalDate> dates = new ArrayList<>();
        while (dateMatcher.find()) {
            try {
                String dateString = dateMatcher.group(1);
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
                LocalDate date = LocalDate.parse(dateString, formatter);
                dates.add(date);
            } catch (Exception e) {
                log.debug("Could not parse date: " + dateMatcher.group(1));
            }
        }

        if (!dates.isEmpty()) {
            photo.setDateStart(dates.get(0));
            if (dates.size() > 1) {
                photo.setDateEnd(dates.get(dates.size() - 1));
            }
        }
    }

    private Set<Person> parsePeople(String peopleStr, Map<String, Person> personCache) {
        Set<Person> people = new HashSet<>();
        
        if (peopleStr == null || peopleStr.isEmpty()) {
            return people;
        }

        // Skip if the field contains "Geen namen" (No names in Dutch)
        if (peopleStr.trim().equalsIgnoreCase("Geen namen") || 
            peopleStr.trim().toLowerCase().startsWith("geen namen")) {
            return people;
        }

        // Split by semicolon
        String[] names = peopleStr.split(";");
        
        for (String fullName : names) {
            fullName = fullName.trim();
            if (fullName.isEmpty()) {
                continue;
            }
            
            // Skip "Geen namen" entries
            if (fullName.equalsIgnoreCase("Geen namen")) {
                continue;
            }

            try {
                String primaryName = extractPrimaryName(fullName);
                
                // Check cache first
                Person person = personCache.get(primaryName);
                
                if (person == null) {
                    try {
                        // Check database
                        Optional<Person> existing = personRepository.findByPrimaryName(primaryName);
                        
                        if (existing.isPresent()) {
                            person = existing.get();
                        } else {
                            // Create new person
                            Person newPerson = new Person();
                            newPerson.setFullName(fullName);
                            newPerson.setPrimaryName(primaryName);
                            newPerson.setSearchableNames(buildSearchableNames(fullName));
                            person = savePerson(newPerson);
                        }
                        
                        personCache.put(primaryName, person);
                    } catch (Exception e) {
                        log.warn("Error saving/finding person '{}': {}", primaryName, e.getMessage());
                        // Clear entity manager to prevent session pollution
                        try {
                            entityManager.clear();
                        } catch (Exception clearEx) {
                            // Ignore
                        }
                        continue;
                    }
                }
                
                if (person != null) {
                    people.add(person);
                }
            } catch (Exception e) {
                log.warn("Error processing person name '{}': {}", fullName, e.getMessage());
            }
        }

        return people;
    }

    private String extractPrimaryName(String fullName) {
        // Use the name BEFORE parentheses as primary
        // Example: "Riek Verberck Wanders (Riek Wanders)" -> "Riek Verberck Wanders"
        // This allows searching by full name
        
        int parenIndex = fullName.indexOf('(');
        if (parenIndex > 0) {
            return fullName.substring(0, parenIndex).trim();
        }
        
        return fullName.trim();
    }

    private String buildSearchableNames(String fullName) {
        StringBuilder searchable = new StringBuilder();
        searchable.append(fullName.toLowerCase());
        
        // Add name without parentheses
        String withoutParens = fullName.replaceAll("\\([^)]*\\)", "").trim();
        searchable.append(" ").append(withoutParens.toLowerCase());
        
        // Add just the part in parentheses
        Pattern pattern = Pattern.compile("\\(([^)]+)\\)");
        Matcher matcher = pattern.matcher(fullName);
        while (matcher.find()) {
            searchable.append(" ").append(matcher.group(1).toLowerCase());
        }
        
        return searchable.toString();
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    protected Person savePerson(Person person) {
        return personRepository.save(person);
    }

    @Transactional
    public void clearAllData() {
        photoRepository.deleteAll();
        personRepository.deleteAll();
    }
}
