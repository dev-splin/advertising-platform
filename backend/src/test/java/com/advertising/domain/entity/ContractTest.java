package com.advertising.domain.entity;

import com.advertising.domain.enums.ContractStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Contract 엔티티 테스트")
class ContractTest {
    
    private Company company;
    private Product product;
    
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
    }
    
    @Test
    @DisplayName("계약 기간이 유효한지 검증 - 정상 케이스")
    void isValidPeriod_Success() {
        // given
        LocalDate startDate = LocalDate.now().plusDays(1);
        LocalDate endDate = startDate.plusDays(28);
        
        Contract contract = Contract.builder()
                .company(company)
                .product(product)
                .startDate(startDate)
                .endDate(endDate)
                .amount(new BigDecimal("100000"))
                .status(ContractStatus.PENDING)
                .build();
        
        // when & then
        assertTrue(contract.isValidPeriod());
    }
    
    @Test
    @DisplayName("계약 기간이 유효한지 검증 - 28일 미만 케이스")
    void isValidPeriod_Fail_WhenLessThan28Days() {
        // given
        LocalDate startDate = LocalDate.now().plusDays(1);
        LocalDate endDate = startDate.plusDays(27); // 28일 미만
        
        Contract contract = Contract.builder()
                .company(company)
                .product(product)
                .startDate(startDate)
                .endDate(endDate)
                .amount(new BigDecimal("100000"))
                .status(ContractStatus.PENDING)
                .build();
        
        // when & then
        assertFalse(contract.isValidPeriod());
    }
    
    @Test
    @DisplayName("계약 금액이 유효한지 검증 - 정상 케이스")
    void isValidAmount_Success() {
        // given
        Contract contract = Contract.builder()
                .company(company)
                .product(product)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("100000"))
                .status(ContractStatus.PENDING)
                .build();
        
        // when & then
        assertTrue(contract.isValidAmount());
    }
    
    @Test
    @DisplayName("계약 금액이 유효한지 검증 - 최소 금액 미만")
    void isValidAmount_Fail_WhenLessThanMin() {
        // given
        Contract contract = Contract.builder()
                .company(company)
                .product(product)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("9999")) // 최소 금액 미만
                .status(ContractStatus.PENDING)
                .build();
        
        // when & then
        assertFalse(contract.isValidAmount());
    }
    
    @Test
    @DisplayName("계약 금액이 유효한지 검증 - 최대 금액 초과")
    void isValidAmount_Fail_WhenMoreThanMax() {
        // given
        Contract contract = Contract.builder()
                .company(company)
                .product(product)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("1000001")) // 최대 금액 초과
                .status(ContractStatus.PENDING)
                .build();
        
        // when & then
        assertFalse(contract.isValidAmount());
    }
    
    @Test
    @DisplayName("계약 시작일이 유효한지 검증 - 오늘 이후")
    void isStartDateValid_Success() {
        // given
        Contract contract = Contract.builder()
                .company(company)
                .product(product)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("100000"))
                .status(ContractStatus.PENDING)
                .build();
        
        // when & then
        assertTrue(contract.isStartDateValid());
    }
    
    @Test
    @DisplayName("계약 시작일이 유효한지 검증 - 오늘 이전")
    void isStartDateValid_Fail_WhenBeforeToday() {
        // given
        Contract contract = Contract.builder()
                .company(company)
                .product(product)
                .startDate(LocalDate.now().minusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("100000"))
                .status(ContractStatus.PENDING)
                .build();
        
        // when & then
        assertFalse(contract.isStartDateValid());
    }
    
    @Test
    @DisplayName("계약 상태 업데이트 - 집행전")
    void updateStatus_Pending() {
        // given
        Contract contract = Contract.builder()
                .company(company)
                .product(product)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("100000"))
                .status(ContractStatus.IN_PROGRESS)
                .build();
        
        // when
        contract.updateStatus();
        
        // then
        assertEquals(ContractStatus.PENDING, contract.getStatus());
    }
    
    @Test
    @DisplayName("계약 상태 업데이트 - 진행중")
    void updateStatus_InProgress() {
        // given
        Contract contract = Contract.builder()
                .company(company)
                .product(product)
                .startDate(LocalDate.now().minusDays(1))
                .endDate(LocalDate.now().plusDays(27))
                .amount(new BigDecimal("100000"))
                .status(ContractStatus.PENDING)
                .build();
        
        // when
        contract.updateStatus();
        
        // then
        assertEquals(ContractStatus.IN_PROGRESS, contract.getStatus());
    }
    
    @Test
    @DisplayName("계약 상태 업데이트 - 광고종료")
    void updateStatus_Completed() {
        // given
        Contract contract = Contract.builder()
                .company(company)
                .product(product)
                .startDate(LocalDate.now().minusDays(30))
                .endDate(LocalDate.now().minusDays(1))
                .amount(new BigDecimal("100000"))
                .status(ContractStatus.IN_PROGRESS)
                .build();
        
        // when
        contract.updateStatus();
        
        // then
        assertEquals(ContractStatus.COMPLETED, contract.getStatus());
    }
    
    @Test
    @DisplayName("계약 취소 - 정상 케이스")
    void cancel_Success() {
        // given
        Contract contract = Contract.builder()
                .company(company)
                .product(product)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("100000"))
                .status(ContractStatus.PENDING)
                .build();
        
        // when
        contract.cancel();
        
        // then
        assertEquals(ContractStatus.CANCELLED, contract.getStatus());
    }
    
    @Test
    @DisplayName("계약 취소 - 이미 종료된 계약은 취소 불가")
    void cancel_Fail_WhenCompleted() {
        // given
        Contract contract = Contract.builder()
                .company(company)
                .product(product)
                .startDate(LocalDate.now().minusDays(30))
                .endDate(LocalDate.now().minusDays(1))
                .amount(new BigDecimal("100000"))
                .status(ContractStatus.COMPLETED)
                .build();
        
        // when & then
        assertThrows(IllegalStateException.class, contract::cancel);
    }
}
