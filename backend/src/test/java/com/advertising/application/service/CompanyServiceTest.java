package com.advertising.application.service;

import com.advertising.application.dto.CompanyResponse;
import com.advertising.common.exception.BusinessException;
import com.advertising.domain.entity.Company;
import com.advertising.domain.repository.CompanyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("CompanyService 테스트")
class CompanyServiceTest {
    
    @Mock
    private CompanyRepository companyRepository;
    
    @InjectMocks
    private CompanyService companyService;
    
    private Company company1;
    private Company company2;
    
    @BeforeEach
    void setUp() {
        company1 = Company.builder()
                .id(1L)
                .companyNumber("10001")
                .name("놀유니버스 그랜드 호텔")
                .type("호텔")
                .build();
        
        company2 = Company.builder()
                .id(2L)
                .companyNumber("10002")
                .name("놀유니버스 시티 호텔 강남")
                .type("호텔")
                .build();
    }
    
    @Test
    @DisplayName("전체 업체 목록 조회")
    void getAllCompanies_Success() {
        // given
        when(companyRepository.findAll()).thenReturn(Arrays.asList(company1, company2));
        
        // when
        List<CompanyResponse> result = companyService.getAllCompanies();
        
        // then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("10001", result.get(0).getCompanyNumber());
        assertEquals("놀유니버스 그랜드 호텔", result.get(0).getName());
    }
    
    @Test
    @DisplayName("키워드로 업체 검색 - 정상 케이스")
    void searchCompanies_Success() {
        // given
        String keyword = "놀유니버스";
        when(companyRepository.findByNameContaining(keyword))
                .thenReturn(Arrays.asList(company1, company2));
        
        // when
        List<CompanyResponse> result = companyService.searchCompanies(keyword);
        
        // then
        assertNotNull(result);
        assertEquals(2, result.size());
        assertTrue(result.stream().anyMatch(c -> c.getName().contains(keyword)));
    }
    
    @Test
    @DisplayName("키워드로 업체 검색 - 빈 키워드")
    void searchCompanies_EmptyKeyword() {
        // when
        List<CompanyResponse> result = companyService.searchCompanies("");
        
        // then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(companyRepository, never()).findByNameContaining(anyString());
    }
    
    @Test
    @DisplayName("키워드로 업체 검색 - null 키워드")
    void searchCompanies_NullKeyword() {
        // when
        List<CompanyResponse> result = companyService.searchCompanies(null);
        
        // then
        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(companyRepository, never()).findByNameContaining(anyString());
    }
    
    @Test
    @DisplayName("업체 ID로 조회 - 정상 케이스")
    void getCompanyById_Success() {
        // given
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company1));
        
        // when
        CompanyResponse result = companyService.getCompanyById(1L);
        
        // then
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("10001", result.getCompanyNumber());
        assertEquals("놀유니버스 그랜드 호텔", result.getName());
    }
    
    @Test
    @DisplayName("업체 ID로 조회 - 업체를 찾을 수 없음")
    void getCompanyById_NotFound() {
        // given
        when(companyRepository.findById(999L)).thenReturn(Optional.empty());
        
        // when & then
        BusinessException exception = assertThrows(BusinessException.class, 
                () -> companyService.getCompanyById(999L));
        
        assertEquals("COMPANY_NOT_FOUND", exception.getErrorCode());
    }
}
