package com.advertising.domain.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "company")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Company {
    /** 업체 ID */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    /** 업체 번호 (고유값) */
    @Column(name = "company_number", unique = true, nullable = false)
    private String companyNumber;
    
    /** 업체명 */
    @Column(nullable = false)
    private String name;
    
    /** 업체 유형 */
    @Column(nullable = false)
    private String type;
    
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
}
