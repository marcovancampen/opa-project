package com.photoarchive.controller;

import com.photoarchive.service.CsvImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/csv")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CsvController {

    private final CsvImportService csvImportService;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadCsv(@RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (file.isEmpty()) {
                response.put("success", false);
                response.put("message", "File is empty");
                return ResponseEntity.badRequest().body(response);
            }

            if (!file.getOriginalFilename().endsWith(".csv")) {
                response.put("success", false);
                response.put("message", "Only CSV files are allowed");
                return ResponseEntity.badRequest().body(response);
            }

            Map<String, Integer> importResult = csvImportService.importCsv(file.getInputStream());

            response.put("success", true);
            response.put("message", "CSV imported successfully");
            response.put("photosImported", importResult.get("photos"));
            response.put("peopleImported", importResult.get("people"));

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error importing CSV: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Map<String, Object>> clearDatabase() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            csvImportService.clearAllData();
            response.put("success", true);
            response.put("message", "Database cleared successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error clearing database: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }
}
