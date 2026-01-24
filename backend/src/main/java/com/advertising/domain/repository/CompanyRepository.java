package com.advertising.domain.repository;

import com.advertising.domain.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {
    
    @Query("SELECT c FROM Company c WHERE c.name LIKE %:keyword%")
    List<Company> findByNameContaining(@Param("keyword") String keyword);
}
