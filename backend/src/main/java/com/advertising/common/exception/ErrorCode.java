package com.advertising.common.exception;

/**
 * 에러 코드 Enum
 * 애플리케이션에서 사용하는 모든 에러 코드를 상수화합니다.
 */
public enum ErrorCode {
    /** 업체를 찾을 수 없음 */
    COMPANY_NOT_FOUND("COMPANY_NOT_FOUND"),
    
    /** 상품을 찾을 수 없음 */
    PRODUCT_NOT_FOUND("PRODUCT_NOT_FOUND"),
    
    /** 계약을 찾을 수 없음 */
    CONTRACT_NOT_FOUND("CONTRACT_NOT_FOUND"),
    
    /** 중복 요청 */
    DUPLICATE_REQUEST("DUPLICATE_REQUEST"),
    
    /** 잘못된 계약 기간 */
    INVALID_PERIOD("INVALID_PERIOD"),
    
    /** 잘못된 계약 금액 */
    INVALID_AMOUNT("INVALID_AMOUNT"),
    
    /** 잘못된 계약 시작일 */
    INVALID_START_DATE("INVALID_START_DATE"),
    
    /** 잘못된 계약 종료일 */
    INVALID_END_DATE("INVALID_END_DATE"),
    
    /** 입력값 검증 실패 */
    VALIDATION_ERROR("VALIDATION_ERROR"),
    
    /** 잘못된 요청 */
    BAD_REQUEST("BAD_REQUEST"),
    
    /** 잘못된 상태 */
    INVALID_STATE("INVALID_STATE"),
    
    /** 서버 내부 오류 */
    INTERNAL_ERROR("INTERNAL_ERROR");
    
    private final String code;
    
    ErrorCode(String code) {
        this.code = code;
    }
    
    public String getCode() {
        return code;
    }
}
