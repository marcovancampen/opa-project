package com.photoarchive.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhotoDTO {
    private Long photoId;
    private String volgnr;
    private String onderwerp;
    private LocalDate dateStart;
    private LocalDate dateEnd;
    private Integer yearOnly;
    private Set<PersonDTO> people;
}
