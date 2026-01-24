package com.advertising.domain.enums;

public enum ContractStatus {
    PENDING("집행전"),
    IN_PROGRESS("진행중"),
    CANCELLED("광고취소"),
    COMPLETED("광고종료");
    
    private final String description;
    
    ContractStatus(String description) {
        this.description = description;
    }
    
    public String getDescription() {
        return description;
    }
}
