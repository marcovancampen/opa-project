package com.photoarchive.controller;

import com.photoarchive.dto.PhotoDTO;
import com.photoarchive.service.PhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/photos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PhotoController {

    private final PhotoService photoService;

    /**
     * Query 1: Find all photos of a specific person
     * GET /api/photos/by-person?name={personName}
     */
    @GetMapping("/by-person")
    public ResponseEntity<List<PhotoDTO>> getPhotosByPerson(@RequestParam String name) {
        List<PhotoDTO> photos = photoService.findPhotosByPerson(name);
        return ResponseEntity.ok(photos);
    }

    /**
     * Query 2: Find all photos from a date range
     * GET /api/photos/by-date-range?start=2000-01-01&end=2010-12-31
     */
    @GetMapping("/by-date-range")
    public ResponseEntity<List<PhotoDTO>> getPhotosByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end) {
        List<PhotoDTO> photos = photoService.findPhotosByDateRange(start, end);
        return ResponseEntity.ok(photos);
    }

    /**
     * Query 3: Find all photos from a specific event type
     * GET /api/photos/by-event?keyword=Sinterklaas
     */
    @GetMapping("/by-event")
    public ResponseEntity<List<PhotoDTO>> getPhotosByEvent(@RequestParam String keyword) {
        List<PhotoDTO> photos = photoService.findPhotosByEventType(keyword);
        return ResponseEntity.ok(photos);
    }

    /**
     * Get all photos
     * GET /api/photos
     */
    @GetMapping
    public ResponseEntity<List<PhotoDTO>> getAllPhotos() {
        List<PhotoDTO> photos = photoService.getAllPhotos();
        return ResponseEntity.ok(photos);
    }

    /**
     * Get photo by volgnr
     * GET /api/photos/{volgnr}
     */
    @GetMapping("/{volgnr}")
    public ResponseEntity<PhotoDTO> getPhotoByVolgnr(@PathVariable String volgnr) {
        PhotoDTO photo = photoService.getPhotoByVolgnr(volgnr);
        return photo != null ? ResponseEntity.ok(photo) : ResponseEntity.notFound().build();
    }
}
