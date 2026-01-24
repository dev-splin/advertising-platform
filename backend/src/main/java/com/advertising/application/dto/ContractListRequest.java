package com.advertising.application.dto;

import com.advertising.domain.enums.ContractStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractListRequest {
    private String companyName;
    private List<ContractStatus> statuses;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer page;
    private Integer size;
}
