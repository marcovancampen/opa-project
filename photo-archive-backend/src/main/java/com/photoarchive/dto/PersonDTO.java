package com.photoarchive.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PersonDTO {
    private Long personId;
    private String fullName;
    private String primaryName;
    private String searchableNames;
}
