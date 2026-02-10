package com.photoarchive.service;

import com.photoarchive.dto.PhotoDTO;
import com.photoarchive.dto.PersonDTO;
import com.photoarchive.entity.Person;
import com.photoarchive.entity.Photo;
import com.photoarchive.repository.PhotoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhotoService {

    private final PhotoRepository photoRepository;

    // Find all photos of a specific person
    @Transactional(readOnly = true)
    public List<PhotoDTO> findPhotosByPerson(String personName) {
        // Use a direct repository query to avoid lazy loading issues
        List<Photo> photos = photoRepository.findPhotosByPersonName(personName);
        
        return photos.stream()
            .distinct()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // Find all photos from a date range
    @Transactional(readOnly = true)
    public List<PhotoDTO> findPhotosByDateRange(LocalDate startDate, LocalDate endDate) {
        List<Photo> photos = photoRepository.findByDateRange(startDate, endDate);
        return photos.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // Find all photos from a specific event type
    @Transactional(readOnly = true)
    public List<PhotoDTO> findPhotosByEventType(String eventKeyword) {
        List<Photo> photos = photoRepository.findByEventType(eventKeyword);
        return photos.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // Helper method to convert Photo to PhotoDTO
    private PhotoDTO convertToDTO(Photo photo) {
        PhotoDTO dto = new PhotoDTO();
        dto.setPhotoId(photo.getPhotoId());
        dto.setVolgnr(photo.getVolgnr());
        dto.setOnderwerp(photo.getOnderwerp());
        dto.setDateStart(photo.getDateStart());
        dto.setDateEnd(photo.getDateEnd());
        dto.setYearOnly(photo.getYearOnly());
        dto.setPeople(photo.getPeople().stream()
            .map(this::convertPersonToDTO)
            .collect(Collectors.toSet()));
        return dto;
    }

    private PersonDTO convertPersonToDTO(Person person) {
        PersonDTO dto = new PersonDTO();
        dto.setPersonId(person.getPersonId());
        dto.setFullName(person.getFullName());
        dto.setPrimaryName(person.getPrimaryName());
        dto.setSearchableNames(person.getSearchableNames());
        return dto;
    }

    // Get all photos
    @Transactional(readOnly = true)
    public List<PhotoDTO> getAllPhotos() {
        return photoRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // Get photo by volgnr
    @Transactional(readOnly = true)
    public PhotoDTO getPhotoByVolgnr(String volgnr) {
        Photo photo = photoRepository.findByVolgnr(volgnr);
        return photo != null ? convertToDTO(photo) : null;
    }
}
