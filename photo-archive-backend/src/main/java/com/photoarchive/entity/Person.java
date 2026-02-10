package com.photoarchive.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "people", indexes = {
    @Index(name = "idx_primary_name", columnList = "primaryName")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@lombok.EqualsAndHashCode(exclude = "photos")
@lombok.ToString(exclude = "photos")
public class Person {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long personId;

    @Column(nullable = false, length = 500)
    private String fullName;

    @Column(nullable = false, length = 200)
    private String primaryName;

    @Column(columnDefinition = "TEXT")
    private String searchableNames;

    @ManyToMany(mappedBy = "people")
    @JsonIgnore
    private Set<Photo> photos = new HashSet<>();
}
