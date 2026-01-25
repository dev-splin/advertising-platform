package com.advertising.application.service;

import com.advertising.application.dto.CompanyResponse;
import com.advertising.common.exception.BusinessException;
import com.advertising.domain.entity.Company;
import com.advertising.domain.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 업체 서비스
 * 업체 조회 및 검색 기능을 제공합니다.
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {
    
    private static final int MAX_SEARCH_RESULTS = 20; // 자동완성 최대 결과 수
    
    private final CompanyRepository companyRepository;
    
    /**
     * 전체 업체 목록을 조회합니다.
     */
    public List<CompanyResponse> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();
        return companies.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * 키워드로 업체를 검색합니다 (자동완성 기능).
     * 업체명에 키워드가 포함된 업체를 최대 20개까지 반환합니다.
     */
    public List<CompanyResponse> searchCompanies(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return List.of();
        }
        
        String trimmedKeyword = keyword.trim();
        log.debug("업체 검색: keyword={}", trimmedKeyword);
        
        List<Company> companies = companyRepository.findByNameContaining(trimmedKeyword);
        
        // 최대 결과 수 제한
        List<CompanyResponse> results = companies.stream()
                .limit(MAX_SEARCH_RESULTS)
                .map(this::toResponse)
                .collect(Collectors.toList());
        
        log.debug("업체 검색 결과: keyword={}, count={}", trimmedKeyword, results.size());
        return results;
    }
    
    /**
     * 업체 ID로 업체를 조회합니다.
     */
    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new BusinessException("COMPANY_NOT_FOUND", "업체를 찾을 수 없습니다."));
        return toResponse(company);
    }
    
    /**
     * 업체 엔티티를 응답 DTO로 변환합니다.
     */
    private CompanyResponse toResponse(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .companyNumber(company.getCompanyNumber())
                .name(company.getName())
                .type(company.getType())
                .build();
    }
}
