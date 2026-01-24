-- 초기 광고 상품 데이터
INSERT INTO product (id, name, description, created_at, updated_at) VALUES
(1, '노출 보장형 광고', '고객이 활발하게 탐색하는 지면에 최적화되어 숙소가 유동적으로 노출됩니다.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 초기 업체 데이터
INSERT INTO company (id, company_number, name, type, created_at, updated_at) VALUES
(1, '10001', '놀유니버스 그랜드 호텔', '호텔', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, '10002', '놀유니버스 시티 호텔 강남', '호텔', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, '10003', '놀유니버스 오션뷰 호텔', '호텔', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, '10004', '포레스트 강남 펜션', '펜션', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, '10005', '포레스트 서초 펜션', '펜션', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, '10006', '포레스트 구로 펜션', '펜션', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
