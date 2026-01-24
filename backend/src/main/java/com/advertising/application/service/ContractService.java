package com.advertising.application.service;

import com.advertising.application.dto.*;
import com.advertising.domain.entity.Company;
import com.advertising.domain.entity.Contract;
import com.advertising.domain.entity.Product;
import com.advertising.domain.enums.ContractStatus;
import com.advertising.domain.repository.CompanyRepository;
import com.advertising.domain.repository.ContractRepository;
import com.advertising.domain.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ContractService {
    
    private final ContractRepository contractRepository;
    private final CompanyRepository companyRepository;
    private final ProductRepository productRepository;
    
    public ContractResponse createContract(ContractRequest request) {
        // 업체 조회
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new IllegalArgumentException("업체를 찾을 수 없습니다."));
        
        // 상품 조회
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));
        
        // 계약 시작일 검증
        if (request.getStartDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("계약 시작일은 오늘 이후여야 합니다.");
        }
        
        // 계약 종료일 검증
        if (request.getEndDate().isBefore(request.getStartDate().plusDays(28))) {
            throw new IllegalArgumentException("계약 종료일은 계약 시작일로부터 최소 28일 이후여야 합니다.");
        }
        
        // 계약 번호 생성
        String contractNumber = generateContractNumber();
        
        // 계약 상태 결정
        ContractStatus status = request.getStartDate().isAfter(LocalDate.now()) 
                ? ContractStatus.PENDING 
                : ContractStatus.IN_PROGRESS;
        
        // 계약 생성
        Contract contract = Contract.builder()
                .contractNumber(contractNumber)
                .company(company)
                .product(product)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .amount(request.getAmount())
                .status(status)
                .build();
        
        Contract savedContract = contractRepository.save(contract);
        return toResponse(savedContract);
    }
    
    public ContractResponse getContractById(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("계약을 찾을 수 없습니다."));
        return toResponse(contract);
    }
    
    public PageResponse<ContractResponse> getContracts(ContractListRequest request) {
        int page = request.getPage() != null ? request.getPage() : 0;
        int size = request.getSize() != null ? request.getSize() : 5;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<Contract> contractPage = contractRepository.findByConditions(
                request.getCompanyName(),
                request.getStatuses(),
                request.getStartDate(),
                request.getEndDate(),
                pageable
        );
        
        List<ContractResponse> content = contractPage.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
        
        return PageResponse.<ContractResponse>builder()
                .content(content)
                .page(contractPage.getNumber())
                .size(contractPage.getSize())
                .totalElements(contractPage.getTotalElements())
                .totalPages(contractPage.getTotalPages())
                .hasNext(contractPage.hasNext())
                .hasPrevious(contractPage.hasPrevious())
                .build();
    }
    
    private ContractResponse toResponse(Contract contract) {
        return ContractResponse.builder()
                .id(contract.getId())
                .contractNumber(contract.getContractNumber())
                .company(CompanyResponse.builder()
                        .id(contract.getCompany().getId())
                        .companyNumber(contract.getCompany().getCompanyNumber())
                        .name(contract.getCompany().getName())
                        .type(contract.getCompany().getType())
                        .build())
                .product(ProductResponse.builder()
                        .id(contract.getProduct().getId())
                        .name(contract.getProduct().getName())
                        .description(contract.getProduct().getDescription())
                        .build())
                .startDate(contract.getStartDate())
                .endDate(contract.getEndDate())
                .amount(contract.getAmount())
                .status(contract.getStatus())
                .statusDescription(contract.getStatus().getDescription())
                .createdAt(contract.getCreatedAt())
                .build();
    }
    
    private String generateContractNumber() {
        return "CNT-" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + 
               "-" + String.format("%04d", contractRepository.count() + 1);
    }
}
