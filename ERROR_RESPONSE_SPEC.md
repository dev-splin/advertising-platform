# 공통 에러 응답 규격 (ErrorResponse)

Frontend와 Backend 간 통신 시 사용하는 공통 에러 응답 규격입니다.

## JSON 구조

```json
{
  "code": "ERROR_CODE",
  "message": "에러 메시지",
  "details": {
    "field1": "필드별 에러 메시지",
    "field2": ["에러 메시지 1", "에러 메시지 2"]
  },
  "timestamp": "2026-01-24T10:00:00",
  "status": 400
}
```

## 필드 설명

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `code` | string | 필수 | 에러 코드 (예: "VALIDATION_ERROR", "NOT_FOUND", "INTERNAL_ERROR") |
| `message` | string | 필수 | 에러 메시지 |
| `details` | object | 선택 | 상세 에러 정보 (필드별 검증 오류 등) |
| `timestamp` | string | 필수 | 에러 발생 시각 (ISO 8601 형식) |
| `status` | number | 필수 | HTTP 상태 코드 |

## 에러 코드

### VALIDATION_ERROR
입력값 검증 실패 시 사용됩니다. `details` 필드에 필드별 에러 메시지가 포함됩니다.

**예시**:
```json
{
  "code": "VALIDATION_ERROR",
  "message": "입력값 검증에 실패했습니다.",
  "details": {
    "amount": "계약 금액은 최소 10,000원 이상이어야 합니다.",
    "endDate": "계약 종료일은 계약 시작일로부터 최소 28일 이후여야 합니다."
  },
  "timestamp": "2026-01-24T10:00:00",
  "status": 400
}
```

### BAD_REQUEST
잘못된 요청 시 사용됩니다.

**예시**:
```json
{
  "code": "BAD_REQUEST",
  "message": "계약 시작일은 오늘 이후여야 합니다.",
  "timestamp": "2026-01-24T10:00:00",
  "status": 400
}
```

### NOT_FOUND
리소스를 찾을 수 없을 때 사용됩니다.

**예시**:
```json
{
  "code": "NOT_FOUND",
  "message": "계약을 찾을 수 없습니다.",
  "timestamp": "2026-01-24T10:00:00",
  "status": 404
}
```

### INTERNAL_ERROR
서버 내부 오류 시 사용됩니다.

**예시**:
```json
{
  "code": "INTERNAL_ERROR",
  "message": "서버 내부 오류가 발생했습니다.",
  "timestamp": "2026-01-24T10:00:00",
  "status": 500
}
```

## Backend 구현 (Java)

```java
package com.advertising.common.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.annotation.JsonInclude;

import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {
    private String code;
    private String message;
    private Map<String, Object> details;
    private LocalDateTime timestamp;
    private Integer status;
}
```

## Frontend 구현 (TypeScript)

```typescript
export interface ErrorResponse {
  code: string;
  message: string;
  details?: Record<string, string | string[]>;
  timestamp: string;
  status: number;
}
```

## 사용 예시

### Backend에서 에러 응답 생성

```java
ErrorResponse errorResponse = ErrorResponse.builder()
    .code("VALIDATION_ERROR")
    .message("입력값 검증에 실패했습니다.")
    .details(Map.of("amount", "계약 금액은 최소 10,000원 이상이어야 합니다."))
    .timestamp(LocalDateTime.now())
    .status(HttpStatus.BAD_REQUEST.value())
    .build();

return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
```

### Frontend에서 에러 처리

```typescript
import { ApiError } from '@/src/lib/api/error-handler';

try {
  const response = await apiClient.post('/contracts', contractData);
  // 성공 처리
} catch (error) {
  if (error instanceof ApiError) {
    console.error('에러 코드:', error.errorResponse.code);
    console.error('에러 메시지:', error.errorResponse.message);
    
    // 필드별 에러 처리
    const fieldErrors = error.getAllFieldErrors();
    if (fieldErrors.amount) {
      setAmountError(fieldErrors.amount);
    }
  }
}
```
