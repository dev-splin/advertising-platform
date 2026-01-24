package com.advertising.application.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractRequest {
    @NotNull(message = "업체 ID는 필수입니다.")
    private Long companyId;
    
    @NotNull(message = "상품 ID는 필수입니다.")
    private Long productId;
    
    @NotNull(message = "계약 시작일은 필수입니다.")
    private LocalDate startDate;
    
    @NotNull(message = "계약 종료일은 필수입니다.")
    private LocalDate endDate;
    
    @NotNull(message = "계약 금액은 필수입니다.")
    @DecimalMin(value = "10000", message = "계약 금액은 최소 10,000원 이상이어야 합니다.")
    @DecimalMax(value = "1000000", message = "계약 금액은 최대 1,000,000원 이하여야 합니다.")
    private BigDecimal amount;
}
