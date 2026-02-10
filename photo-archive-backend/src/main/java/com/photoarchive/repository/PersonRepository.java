package com.photoarchive.repository;

import com.photoarchive.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonRepository extends JpaRepository<Person, Long> {

    // Find person by primary name
    Optional<Person> findByPrimaryName(String primaryName);

    // Find people by name (searches in all name variations)
    @Query("SELECT DISTINCT p FROM Person p WHERE " +
           "LOWER(TRIM(p.primaryName)) LIKE LOWER(CONCAT('%', TRIM(:name), '%')) OR " +
           "LOWER(TRIM(p.fullName)) LIKE LOWER(CONCAT('%', TRIM(:name), '%')) OR " +
           "LOWER(p.searchableNames) LIKE LOWER(CONCAT('%', TRIM(:name), '%'))")
    List<Person> findByNameContaining(@Param("name") String name);
}
