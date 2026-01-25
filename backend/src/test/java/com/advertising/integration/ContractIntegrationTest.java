package com.advertising.integration;

import com.advertising.application.dto.ContractRequest;
import com.advertising.application.dto.ContractResponse;
import com.advertising.domain.entity.Company;
import com.advertising.domain.entity.Product;
import com.advertising.domain.enums.ContractStatus;
import com.advertising.domain.repository.CompanyRepository;
import com.advertising.domain.repository.ContractRepository;
import com.advertising.domain.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
@DisplayName("계약 통합 테스트")
class ContractIntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ContractRepository contractRepository;
    
    @Autowired
    private CompanyRepository companyRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    private Company company;
    private Product product;
    
    @BeforeEach
    void setUp() {
        contractRepository.deleteAll();
        companyRepository.deleteAll();
        productRepository.deleteAll();
        
        company = Company.builder()
                .companyNumber("10001")
                .name("테스트 호텔")
                .type("호텔")
                .build();
        company = companyRepository.save(company);
        
        product = Product.builder()
                .name("노출 보장형 광고")
                .description("테스트 상품")
                .build();
        product = productRepository.save(product);
    }
    
    @Test
    @DisplayName("계약 생성 통합 테스트")
    void createContract_IntegrationTest() throws Exception {
        // given
        String requestBody = String.format(
                "{\"companyId\":%d,\"productId\":%d,\"startDate\":\"%s\",\"endDate\":\"%s\",\"amount\":100000}",
                company.getId(),
                product.getId(),
                LocalDate.now().plusDays(1),
                LocalDate.now().plusDays(29)
        );
        
        // when & then
        mockMvc.perform(post("/contracts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contractNumber").exists())
                .andExpect(jsonPath("$.status").value("PENDING"));
    }
    
    @Test
    @DisplayName("계약 목록 조회 통합 테스트")
    void getContracts_IntegrationTest() throws Exception {
        // given - 계약 생성
        ContractRequest request = ContractRequest.builder()
                .companyId(company.getId())
                .productId(product.getId())
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("100000"))
                .build();
        
        // when & then
        mockMvc.perform(get("/contracts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(5));
    }
}
