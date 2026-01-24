package com.advertising.presentation.controller;

import com.advertising.application.dto.*;
import com.advertising.application.service.ContractService;
import com.advertising.domain.enums.ContractStatus;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/contracts")
@RequiredArgsConstructor
public class ContractController {
    
    private final ContractService contractService;
    
    @PostMapping
    public ResponseEntity<ContractResponse> createContract(@Valid @RequestBody ContractRequest request) {
        ContractResponse contract = contractService.createContract(request);
        return ResponseEntity.ok(contract);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ContractResponse> getContractById(@PathVariable Long id) {
        ContractResponse contract = contractService.getContractById(id);
        return ResponseEntity.ok(contract);
    }
    
    @GetMapping
    public ResponseEntity<PageResponse<ContractResponse>> getContracts(
            @RequestParam(required = false) String companyName,
            @RequestParam(required = false) String statuses,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false, defaultValue = "0") Integer page,
            @RequestParam(required = false, defaultValue = "5") Integer size) {
        
        List<ContractStatus> statusList = null;
        if (statuses != null && !statuses.isEmpty()) {
            statusList = Arrays.stream(statuses.split(","))
                    .map(String::trim)
                    .map(ContractStatus::valueOf)
                    .collect(Collectors.toList());
        }
        
        ContractListRequest request = ContractListRequest.builder()
                .companyName(companyName)
                .statuses(statusList)
                .startDate(startDate != null ? java.time.LocalDate.parse(startDate) : null)
                .endDate(endDate != null ? java.time.LocalDate.parse(endDate) : null)
                .page(page)
                .size(size)
                .build();
        
        PageResponse<ContractResponse> contracts = contractService.getContracts(request);
        return ResponseEntity.ok(contracts);
    }
}
