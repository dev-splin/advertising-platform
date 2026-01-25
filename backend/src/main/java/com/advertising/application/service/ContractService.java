package com.advertising.application.service;

import com.advertising.application.dto.*;
import com.advertising.common.exception.BusinessException;
import com.advertising.domain.entity.Company;
import com.advertising.domain.entity.Contract;
import com.advertising.domain.entity.Product;
import com.advertising.domain.enums.ContractStatus;
import com.advertising.domain.repository.CompanyRepository;
import com.advertising.domain.repository.ContractRepository;
import com.advertising.domain.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

/**
 * 계약 서비스
 * 비즈니스 로직을 처리합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class ContractService {
    
    private static final int MIN_CONTRACT_DAYS = 28;
    private static final String DUPLICATE_REQUEST_KEY_PREFIX = "contract:";
    
    private final ContractRepository contractRepository;
    private final CompanyRepository companyRepository;
    private final ProductRepository productRepository;
    
    /**
     * 계약을 생성합니다.
     * 중복 요청 방지 및 유효성 검사를 수행합니다.
     */
    public ContractResponse createContract(ContractRequest request) {
        log.info("계약 생성 요청: companyId={}, productId={}, startDate={}, endDate={}, amount={}",
                request.getCompanyId(), request.getProductId(), request.getStartDate(), 
                request.getEndDate(), request.getAmount());
        
        // 업체 조회
        Company company = companyRepository.findById(request.getCompanyId())
                .orElseThrow(() -> new BusinessException("COMPANY_NOT_FOUND", "업체를 찾을 수 없습니다."));
        
        // 상품 조회
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new BusinessException("PRODUCT_NOT_FOUND", "상품을 찾을 수 없습니다."));
        
        // 중복 요청 방지: 동일한 업체, 상품, 시작일, 종료일, 금액의 계약이 최근 5초 이내에 생성되었는지 확인
        if (isDuplicateRequest(request)) {
            throw new BusinessException("DUPLICATE_REQUEST", 
                    "동일한 계약 요청이 최근에 처리되었습니다. 잠시 후 다시 시도해주세요.");
        }
        
        // 계약 유효성 검사
        validateContractRequest(request);
        
        // 계약 번호 생성
        String contractNumber = generateContractNumber();
        
        // 계약 생성
        Contract contract = Contract.builder()
                .contractNumber(contractNumber)
                .company(company)
                .product(product)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .amount(request.getAmount())
                .status(ContractStatus.PENDING) // 초기 상태는 PENDING
                .build();
        
        // 도메인 모델의 비즈니스 로직으로 상태 결정
        contract.updateStatus();
        
        // 도메인 모델의 유효성 검사
        if (!contract.isValidPeriod()) {
            throw new BusinessException("INVALID_PERIOD", 
                    "계약 종료일은 계약 시작일로부터 최소 28일 이후여야 합니다.");
        }
        
        if (!contract.isValidAmount()) {
            throw new BusinessException("INVALID_AMOUNT", 
                    "계약 금액은 10,000원 이상 1,000,000원 이하여야 합니다.");
        }
        
        Contract savedContract = contractRepository.save(contract);
        log.info("계약 생성 완료: contractNumber={}, id={}", savedContract.getContractNumber(), savedContract.getId());
        
        return toResponse(savedContract);
    }
    
    /**
     * 중복 요청인지 확인합니다.
     * 동일한 업체, 상품, 시작일, 종료일, 금액의 계약이 최근 5초 이내에 생성되었는지 확인합니다.
     */
    private boolean isDuplicateRequest(ContractRequest request) {
        LocalDate fiveSecondsAgo = LocalDate.now();
        // 실제로는 Redis나 캐시를 사용하는 것이 좋지만, 여기서는 DB 조회로 대체
        List<Contract> recentContracts = contractRepository.findAll().stream()
                .filter(c -> c.getCompany().getId().equals(request.getCompanyId()))
                .filter(c -> c.getProduct().getId().equals(request.getProductId()))
                .filter(c -> c.getStartDate().equals(request.getStartDate()))
                .filter(c -> c.getEndDate().equals(request.getEndDate()))
                .filter(c -> c.getAmount().compareTo(request.getAmount()) == 0)
                .filter(c -> c.getCreatedAt() != null && 
                        c.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusSeconds(5)))
                .collect(Collectors.toList());
        
        return !recentContracts.isEmpty();
    }
    
    /**
     * 계약 요청의 유효성을 검사합니다.
     */
    private void validateContractRequest(ContractRequest request) {
        LocalDate today = LocalDate.now();
        
        // 계약 시작일 검증
        if (request.getStartDate().isBefore(today)) {
            throw new BusinessException("INVALID_START_DATE", 
                    "계약 시작일은 오늘 이후여야 합니다.");
        }
        
        // 계약 종료일 검증
        LocalDate minEndDate = request.getStartDate().plusDays(MIN_CONTRACT_DAYS);
        if (request.getEndDate().isBefore(minEndDate)) {
            throw new BusinessException("INVALID_END_DATE", 
                    String.format("계약 종료일은 계약 시작일로부터 최소 %d일 이후여야 합니다.", MIN_CONTRACT_DAYS));
        }
        
        // 금액 검증 (DTO에서도 검증하지만 서비스 레이어에서도 재검증)
        if (request.getAmount().compareTo(new java.math.BigDecimal("10000")) < 0) {
            throw new BusinessException("INVALID_AMOUNT", 
                    "계약 금액은 최소 10,000원 이상이어야 합니다.");
        }
        
        if (request.getAmount().compareTo(new java.math.BigDecimal("1000000")) > 0) {
            throw new BusinessException("INVALID_AMOUNT", 
                    "계약 금액은 최대 1,000,000원 이하여야 합니다.");
        }
    }
    
    /**
     * 계약 상세 정보를 조회합니다.
     */
    @Transactional(readOnly = true)
    public ContractResponse getContractById(Long id) {
        Contract contract = contractRepository.findById(id)
                .orElseThrow(() -> new BusinessException("CONTRACT_NOT_FOUND", "계약을 찾을 수 없습니다."));
        
        // 계약 상태 자동 업데이트
        contract.updateStatus();
        
        return toResponse(contract);
    }
    
    /**
     * 계약 목록을 조회합니다.
     * 업체명, 상태, 날짜 범위로 필터링 가능하며 페이징을 지원합니다.
     */
    @Transactional(readOnly = true)
    public PageResponse<ContractResponse> getContracts(ContractListRequest request) {
        int page = request.getPage() != null && request.getPage() >= 0 ? request.getPage() : 0;
        int size = request.getSize() != null && request.getSize() > 0 ? request.getSize() : 5;
        
        // 최대 페이지 크기 제한
        if (size > 100) {
            size = 100;
        }
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        
        Page<Contract> contractPage = contractRepository.findByConditions(
                request.getCompanyName(),
                request.getStatuses(),
                request.getStartDate(),
                request.getEndDate(),
                pageable
        );
        
        // 계약 상태 자동 업데이트 (실시간 상태 반영)
        contractPage.getContent().forEach(Contract::updateStatus);
        
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
