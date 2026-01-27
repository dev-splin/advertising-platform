package com.advertising.application.service;

import com.advertising.application.dto.ContractRequest;
import com.advertising.application.dto.ContractResponse;
import com.advertising.common.exception.BusinessException;
import com.advertising.common.exception.ErrorCode;
import com.advertising.domain.entity.Company;
import com.advertising.domain.entity.Contract;
import com.advertising.domain.entity.Product;
import com.advertising.domain.enums.ContractStatus;
import com.advertising.domain.repository.CompanyRepository;
import com.advertising.domain.repository.ContractRepository;
import com.advertising.domain.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ContractService 테스트")
class ContractServiceTest {
    
    @Mock
    private ContractRepository contractRepository;
    
    @Mock
    private CompanyRepository companyRepository;
    
    @Mock
    private ProductRepository productRepository;
    
    @InjectMocks
    private ContractService contractService;
    
    private Company company;
    private Product product;
    private ContractRequest validRequest;
    
    @BeforeEach
    void setUp() {
        company = Company.builder()
                .id(1L)
                .companyNumber("10001")
                .name("테스트 호텔")
                .type("호텔")
                .build();
        
        product = Product.builder()
                .id(1L)
                .name("노출 보장형 광고")
                .description("테스트 상품")
                .build();
        
        validRequest = ContractRequest.builder()
                .companyId(1L)
                .productId(1L)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("100000"))
                .build();
    }
    
    @Test
    @DisplayName("계약 생성 - 정상 케이스")
    void createContract_Success() {
        // given
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(contractRepository.findAll()).thenReturn(Collections.emptyList());
        when(contractRepository.count()).thenReturn(0L);
        
        Contract savedContract = Contract.builder()
                .id(1L)
                .contractNumber("CNT-20260125-0001")
                .company(company)
                .product(product)
                .startDate(validRequest.getStartDate())
                .endDate(validRequest.getEndDate())
                .amount(validRequest.getAmount())
                .status(ContractStatus.PENDING)
                .build();
        
        when(contractRepository.save(any(Contract.class))).thenReturn(savedContract);
        
        // when
        ContractResponse response = contractService.createContract(validRequest);
        
        // then
        assertThat(response).isNotNull();
        assertThat(response.getContractNumber()).isEqualTo("CNT-20260125-0001");
        assertThat(response.getStatus()).isEqualTo(ContractStatus.PENDING);
        assertThat(response.getCompany().getId()).isEqualTo(company.getId());
        assertThat(response.getProduct().getId()).isEqualTo(product.getId());
        assertThat(response.getStartDate()).isEqualTo(validRequest.getStartDate());
        assertThat(response.getEndDate()).isEqualTo(validRequest.getEndDate());
        assertThat(response.getAmount()).isEqualByComparingTo(validRequest.getAmount());
        verify(contractRepository, times(1)).save(any(Contract.class));
    }
    
    @Test
    @DisplayName("계약 생성 - 업체를 찾을 수 없음")
    void createContract_Fail_WhenCompanyNotFound() {
        // given
        when(companyRepository.findById(1L)).thenReturn(Optional.empty());
        
        // when & then
        assertThatThrownBy(() -> contractService.createContract(validRequest))
                .isInstanceOf(BusinessException.class)
                .satisfies(ex -> {
                    BusinessException be = (BusinessException) ex;
                    assertThat(be.getErrorCode()).isEqualTo(ErrorCode.COMPANY_NOT_FOUND.getCode());
                    assertThat(be.getMessage()).contains("업체를 찾을 수 없습니다");
                });
        verify(contractRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("계약 생성 - 상품을 찾을 수 없음")
    void createContract_Fail_WhenProductNotFound() {
        // given
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(productRepository.findById(1L)).thenReturn(Optional.empty());
        
        // when & then
        assertThatThrownBy(() -> contractService.createContract(validRequest))
                .isInstanceOf(BusinessException.class)
                .satisfies(ex -> {
                    BusinessException be = (BusinessException) ex;
                    assertThat(be.getErrorCode()).isEqualTo(ErrorCode.PRODUCT_NOT_FOUND.getCode());
                    assertThat(be.getMessage()).contains("상품을 찾을 수 없습니다");
                });
        verify(contractRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("계약 생성 - 시작일이 오늘 이전")
    void createContract_Fail_WhenStartDateBeforeToday() {
        // given
        ContractRequest invalidRequest = ContractRequest.builder()
                .companyId(1L)
                .productId(1L)
                .startDate(LocalDate.now().minusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("100000"))
                .build();
        
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(contractRepository.findAll()).thenReturn(Collections.emptyList());
        
        // when & then
        assertThatThrownBy(() -> contractService.createContract(invalidRequest))
                .isInstanceOf(BusinessException.class)
                .satisfies(ex -> {
                    BusinessException be = (BusinessException) ex;
                    assertThat(be.getErrorCode()).isEqualTo(ErrorCode.INVALID_START_DATE.getCode());
                    assertThat(be.getMessage()).contains("계약 시작일은 오늘 이후여야 합니다");
                });
        verify(contractRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("계약 생성 - 시작일이 오늘")
    void createContract_Success_WhenStartDateIsToday() {
        // given
        ContractRequest request = ContractRequest.builder()
                .companyId(1L)
                .productId(1L)
                .startDate(LocalDate.now())
                .endDate(LocalDate.now().plusDays(28))
                .amount(new BigDecimal("100000"))
                .build();
        
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(contractRepository.findAll()).thenReturn(Collections.emptyList());
        when(contractRepository.count()).thenReturn(0L);
        
        Contract savedContract = Contract.builder()
                .id(1L)
                .contractNumber("CNT-20260125-0001")
                .company(company)
                .product(product)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .amount(request.getAmount())
                .status(ContractStatus.IN_PROGRESS)
                .build();
        
        when(contractRepository.save(any(Contract.class))).thenReturn(savedContract);
        
        // when
        ContractResponse response = contractService.createContract(request);
        
        // then
        assertThat(response).isNotNull();
        assertThat(response.getStatus()).isEqualTo(ContractStatus.IN_PROGRESS);
    }
    
    @Test
    @DisplayName("계약 생성 - 종료일이 시작일 + 28일 미만")
    void createContract_Fail_WhenEndDateLessThan28Days() {
        // given
        ContractRequest invalidRequest = ContractRequest.builder()
                .companyId(1L)
                .productId(1L)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(27)) // 28일 미만
                .amount(new BigDecimal("100000"))
                .build();
        
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(contractRepository.findAll()).thenReturn(Collections.emptyList());
        
        // when & then
        assertThatThrownBy(() -> contractService.createContract(invalidRequest))
                .isInstanceOf(BusinessException.class)
                .satisfies(ex -> {
                    BusinessException be = (BusinessException) ex;
                    assertThat(be.getErrorCode()).isEqualTo(ErrorCode.INVALID_END_DATE.getCode());
                    assertThat(be.getMessage()).contains("최소 28일 이후");
                });
        verify(contractRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("계약 생성 - 종료일이 시작일 + 28일 정확히")
    void createContract_Success_WhenEndDateExactly28Days() {
        // given
        ContractRequest request = ContractRequest.builder()
                .companyId(1L)
                .productId(1L)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(29)) // 정확히 28일 후
                .amount(new BigDecimal("100000"))
                .build();
        
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(contractRepository.findAll()).thenReturn(Collections.emptyList());
        when(contractRepository.count()).thenReturn(0L);
        
        Contract savedContract = Contract.builder()
                .id(1L)
                .contractNumber("CNT-20260125-0001")
                .company(company)
                .product(product)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .amount(request.getAmount())
                .status(ContractStatus.PENDING)
                .build();
        
        when(contractRepository.save(any(Contract.class))).thenReturn(savedContract);
        
        // when
        ContractResponse response = contractService.createContract(request);
        
        // then
        assertThat(response).isNotNull();
        assertThat(response.getEndDate()).isEqualTo(request.getEndDate());
    }
    
    @Test
    @DisplayName("계약 생성 - 금액이 최소 금액 미만")
    void createContract_Fail_WhenAmountLessThanMin() {
        // given
        ContractRequest invalidRequest = ContractRequest.builder()
                .companyId(1L)
                .productId(1L)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("9999")) // 최소 금액 미만
                .build();
        
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(contractRepository.findAll()).thenReturn(Collections.emptyList());
        
        // when & then
        assertThatThrownBy(() -> contractService.createContract(invalidRequest))
                .isInstanceOf(BusinessException.class)
                .satisfies(ex -> {
                    BusinessException be = (BusinessException) ex;
                    assertThat(be.getErrorCode()).isEqualTo(ErrorCode.INVALID_AMOUNT.getCode());
                    assertThat(be.getMessage()).contains("최소 10,000원 이상");
                });
        verify(contractRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("계약 생성 - 금액이 최소 금액 정확히")
    void createContract_Success_WhenAmountExactlyMin() {
        // given
        ContractRequest request = ContractRequest.builder()
                .companyId(1L)
                .productId(1L)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("10000")) // 최소 금액
                .build();
        
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(contractRepository.findAll()).thenReturn(Collections.emptyList());
        when(contractRepository.count()).thenReturn(0L);
        
        Contract savedContract = Contract.builder()
                .id(1L)
                .contractNumber("CNT-20260125-0001")
                .company(company)
                .product(product)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .amount(request.getAmount())
                .status(ContractStatus.PENDING)
                .build();
        
        when(contractRepository.save(any(Contract.class))).thenReturn(savedContract);
        
        // when
        ContractResponse response = contractService.createContract(request);
        
        // then
        assertThat(response).isNotNull();
        assertThat(response.getAmount()).isEqualByComparingTo(new BigDecimal("10000"));
    }
    
    @Test
    @DisplayName("계약 생성 - 금액이 최대 금액 초과")
    void createContract_Fail_WhenAmountMoreThanMax() {
        // given
        ContractRequest invalidRequest = ContractRequest.builder()
                .companyId(1L)
                .productId(1L)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("1000001")) // 최대 금액 초과
                .build();
        
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(contractRepository.findAll()).thenReturn(Collections.emptyList());
        
        // when & then
        assertThatThrownBy(() -> contractService.createContract(invalidRequest))
                .isInstanceOf(BusinessException.class)
                .satisfies(ex -> {
                    BusinessException be = (BusinessException) ex;
                    assertThat(be.getErrorCode()).isEqualTo(ErrorCode.INVALID_AMOUNT.getCode());
                    assertThat(be.getMessage()).contains("최대 1,000,000원 이하");
                });
        verify(contractRepository, never()).save(any());
    }
    
    @Test
    @DisplayName("계약 생성 - 금액이 최대 금액 정확히")
    void createContract_Success_WhenAmountExactlyMax() {
        // given
        ContractRequest request = ContractRequest.builder()
                .companyId(1L)
                .productId(1L)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("1000000")) // 최대 금액
                .build();
        
        when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(contractRepository.findAll()).thenReturn(Collections.emptyList());
        when(contractRepository.count()).thenReturn(0L);
        
        Contract savedContract = Contract.builder()
                .id(1L)
                .contractNumber("CNT-20260125-0001")
                .company(company)
                .product(product)
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .amount(request.getAmount())
                .status(ContractStatus.PENDING)
                .build();
        
        when(contractRepository.save(any(Contract.class))).thenReturn(savedContract);
        
        // when
        ContractResponse response = contractService.createContract(request);
        
        // then
        assertThat(response).isNotNull();
        assertThat(response.getAmount()).isEqualByComparingTo(new BigDecimal("1000000"));
    }
}
