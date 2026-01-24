package com.advertising.common.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Frontend와 Backend 간 통신 시 사용하는 공통 에러 응답 규격
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    /**
     * 에러 코드 (예: "VALIDATION_ERROR", "NOT_FOUND", "INTERNAL_ERROR")
     */
    private String code;
    
    /**
     * 에러 메시지
     */
    private String message;
    
    /**
     * 상세 에러 정보 (필드별 검증 오류 등)
     */
    private Map<String, Object> details;
    
    /**
     * 에러 발생 시각
     */
    private LocalDateTime timestamp;
    
    /**
     * HTTP 상태 코드
     */
    private Integer status;
}
