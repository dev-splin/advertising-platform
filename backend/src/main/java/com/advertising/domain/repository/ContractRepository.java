package com.advertising.domain.repository;

import com.advertising.domain.entity.Contract;
import com.advertising.domain.enums.ContractStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {
    
    @Query("SELECT c FROM Contract c WHERE " +
           "(:companyName IS NULL OR c.company.name LIKE %:companyName%) AND " +
           "(:statuses IS NULL OR c.status IN :statuses) AND " +
           "(:startDate IS NULL OR c.endDate >= :startDate) AND " +
           "(:endDate IS NULL OR c.startDate <= :endDate)")
    Page<Contract> findByConditions(
            @Param("companyName") String companyName,
            @Param("statuses") List<ContractStatus> statuses,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );
}
