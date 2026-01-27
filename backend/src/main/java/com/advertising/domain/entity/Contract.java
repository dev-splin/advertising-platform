package com.advertising.domain.entity;

import com.advertising.domain.enums.ContractStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 광고 계약 엔티티
 * 도메인 모델로서 비즈니스 로직을 포함합니다.
 */
@Entity
@Table(name = "contract")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Contract {
    /** 계약 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /** 계약 번호 (고유값) */
    @Column(name = "contract_number", unique = true, nullable = false)
    private String contractNumber;
    
    /** 계약 업체 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;
    
    /** 계약 상품 */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;
    
    /** 계약 시작일 */
    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;
    
    /** 계약 종료일 */
    @Column(name = "end_date", nullable = false)
    private LocalDate endDate;
    
    /** 계약 금액 */
    @Column(name = "amount", nullable = false)
    private BigDecimal amount;
    
    /** 계약 상태 */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ContractStatus status;
    
    /** 생성 일시 */
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    /** 수정 일시 */
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
    
    /**
     * 계약 기간이 유효한지 검증합니다.
     * 종료일은 시작일로부터 최소 28일 이후여야 합니다.
     */
    public boolean isValidPeriod() {
        return endDate.isAfter(startDate.plusDays(27));
    }
    
    /**
     * 계약 금액이 유효한 범위 내에 있는지 검증합니다.
     * 최소 10,000원, 최대 1,000,000원
     */
    public boolean isValidAmount() {
        BigDecimal minAmount = new BigDecimal("10000");
        BigDecimal maxAmount = new BigDecimal("1000000");
        return amount.compareTo(minAmount) >= 0 && amount.compareTo(maxAmount) <= 0;
    }
    
    /**
     * 계약 시작일이 오늘 이후인지 확인합니다.
     */
    public boolean isStartDateValid() {
        return !startDate.isBefore(LocalDate.now());
    }
    
    /**
     * 계약 상태를 업데이트합니다.
     * 현재 날짜를 기준으로 자동으로 상태를 결정합니다.
     */
    public void updateStatus() {
        LocalDate today = LocalDate.now();
        if (status == ContractStatus.CANCELLED || status == ContractStatus.COMPLETED) {
            return; // 취소되거나 종료된 계약은 상태 변경 불가
        }
        
        if (startDate.isAfter(today)) {
            this.status = ContractStatus.PENDING;
        } else if (endDate.isBefore(today)) {
            this.status = ContractStatus.COMPLETED;
        } else {
            this.status = ContractStatus.IN_PROGRESS;
        }
    }
    
    /**
     * 계약을 취소합니다.
     */
    public void cancel() {
        if (status == ContractStatus.COMPLETED) {
            throw new IllegalStateException("이미 종료된 계약은 취소할 수 없습니다.");
        }
        this.status = ContractStatus.CANCELLED;
    }
}
