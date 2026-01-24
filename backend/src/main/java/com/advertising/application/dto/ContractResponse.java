package com.advertising.application.dto;

import com.advertising.domain.enums.ContractStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractResponse {
    private Long id;
    private String contractNumber;
    private CompanyResponse company;
    private ProductResponse product;
    private LocalDate startDate;
    private LocalDate endDate;
    private BigDecimal amount;
    private ContractStatus status;
    private String statusDescription;
    private LocalDateTime createdAt;
}
