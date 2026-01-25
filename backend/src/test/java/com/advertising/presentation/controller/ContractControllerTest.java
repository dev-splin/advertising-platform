package com.advertising.presentation.controller;

import com.advertising.application.dto.ContractRequest;
import com.advertising.application.dto.ContractResponse;
import com.advertising.application.dto.PageResponse;
import com.advertising.application.service.ContractService;
import com.advertising.domain.enums.ContractStatus;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ContractController.class)
@DisplayName("ContractController 테스트")
class ContractControllerTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private ContractService contractService;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Test
    @DisplayName("계약 생성 API - 정상 케이스")
    void createContract_Success() throws Exception {
        // given
        ContractRequest request = ContractRequest.builder()
                .companyId(1L)
                .productId(1L)
                .startDate(LocalDate.now().plusDays(1))
                .endDate(LocalDate.now().plusDays(29))
                .amount(new BigDecimal("100000"))
                .build();
        
        ContractResponse response = ContractResponse.builder()
                .id(1L)
                .contractNumber("CNT-20260125-0001")
                .status(ContractStatus.PENDING)
                .build();
        
        when(contractService.createContract(any(ContractRequest.class))).thenReturn(response);
        
        // when & then
        mockMvc.perform(post("/contracts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.contractNumber").value("CNT-20260125-0001"))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }
    
    @Test
    @DisplayName("계약 상세 조회 API - 정상 케이스")
    void getContractById_Success() throws Exception {
        // given
        ContractResponse response = ContractResponse.builder()
                .id(1L)
                .contractNumber("CNT-20260125-0001")
                .status(ContractStatus.PENDING)
                .build();
        
        when(contractService.getContractById(1L)).thenReturn(response);
        
        // when & then
        mockMvc.perform(get("/contracts/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.contractNumber").value("CNT-20260125-0001"));
    }
    
    @Test
    @DisplayName("계약 목록 조회 API - 정상 케이스")
    void getContracts_Success() throws Exception {
        // given
        PageResponse<ContractResponse> pageResponse = PageResponse.<ContractResponse>builder()
                .content(Collections.emptyList())
                .page(0)
                .size(5)
                .totalElements(0L)
                .totalPages(0)
                .hasNext(false)
                .hasPrevious(false)
                .build();
        
        when(contractService.getContracts(any())).thenReturn(pageResponse);
        
        // when & then
        mockMvc.perform(get("/contracts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(5));
    }
}
