package com.photoarchive.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "photos", indexes = {
    @Index(name = "idx_volgnr", columnList = "volgnr"),
    @Index(name = "idx_date_start", columnList = "dateStart"),
    @Index(name = "idx_date_end", columnList = "dateEnd")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@lombok.EqualsAndHashCode(exclude = "people")
@lombok.ToString(exclude = "people")
public class Photo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long photoId;

    @Column(nullable = false, unique = true, length = 10)
    private String volgnr;

    @Column(columnDefinition = "TEXT")
    private String onderwerp;

    private LocalDate dateStart;

    private LocalDate dateEnd;

    private Integer yearOnly;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "photo_people",
        joinColumns = @JoinColumn(name = "photo_id"),
        inverseJoinColumns = @JoinColumn(name = "person_id")
    )
    private Set<Person> people = new HashSet<>();

    public void addPerson(Person person) {
        this.people.add(person);
        person.getPhotos().add(this);
    }

    public void removePerson(Person person) {
        this.people.remove(person);
        person.getPhotos().remove(this);
    }
}
