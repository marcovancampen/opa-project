package com.photoarchive.repository;

import com.photoarchive.entity.Photo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {

    // Find photos by date range
    @Query("SELECT DISTINCT p FROM Photo p LEFT JOIN FETCH p.people WHERE " +
           "(p.dateStart BETWEEN :startDate AND :endDate) OR " +
           "(p.dateEnd BETWEEN :startDate AND :endDate) OR " +
           "(p.dateStart <= :startDate AND p.dateEnd >= :endDate)")
    List<Photo> findByDateRange(@Param("startDate") LocalDate startDate, 
                                 @Param("endDate") LocalDate endDate);

    // Find photos by event type (onderwerp contains keyword)
    @Query("SELECT DISTINCT p FROM Photo p LEFT JOIN FETCH p.people WHERE LOWER(p.onderwerp) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Photo> findByEventType(@Param("keyword") String keyword);

    // Find photos by volgnr with people eagerly loaded
    @Query("SELECT DISTINCT p FROM Photo p LEFT JOIN FETCH p.people WHERE p.volgnr = :volgnr")
    Photo findByVolgnr(@Param("volgnr") String volgnr);

    // Find photos by year
    @Query("SELECT DISTINCT p FROM Photo p LEFT JOIN FETCH p.people WHERE p.yearOnly = :year")
    List<Photo> findByYearOnly(@Param("year") Integer year);
    
    // Override findAll to eagerly load people
    @Query("SELECT DISTINCT p FROM Photo p LEFT JOIN FETCH p.people")
    List<Photo> findAll();

    // Find photos by person name (JOIN FETCH to eagerly load all people)
    // This uses a subquery to find matching photos, then fetches all their people
    @Query("SELECT DISTINCT p FROM Photo p LEFT JOIN FETCH p.people " +
           "WHERE p IN (SELECT DISTINCT ph FROM Photo ph JOIN ph.people person " +
           "WHERE LOWER(TRIM(person.primaryName)) LIKE LOWER(CONCAT('%', TRIM(:name), '%')) " +
           "OR LOWER(TRIM(person.fullName)) LIKE LOWER(CONCAT('%', TRIM(:name), '%')) " +
           "OR LOWER(person.searchableNames) LIKE LOWER(CONCAT('%', TRIM(:name), '%')))")
    List<Photo> findPhotosByPersonName(@Param("name") String name);
}
