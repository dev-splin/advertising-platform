package com.advertising.application.service;

import com.advertising.application.dto.CompanyResponse;
import com.advertising.domain.entity.Company;
import com.advertising.domain.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CompanyService {
    
    private final CompanyRepository companyRepository;
    
    public List<CompanyResponse> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();
        return companies.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public List<CompanyResponse> searchCompanies(String keyword) {
        List<Company> companies = companyRepository.findByNameContaining(keyword);
        return companies.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public CompanyResponse getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("업체를 찾을 수 없습니다."));
        return toResponse(company);
    }
    
    private CompanyResponse toResponse(Company company) {
        return CompanyResponse.builder()
                .id(company.getId())
                .companyNumber(company.getCompanyNumber())
                .name(company.getName())
                .type(company.getType())
                .build();
    }
}
