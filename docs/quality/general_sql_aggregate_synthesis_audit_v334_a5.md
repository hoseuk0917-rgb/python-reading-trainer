# V334-A5 General SQL Aggregate Synthesis Audit

Purpose: verify that non-preloaded SQL aggregate examples get synthesis explanations.

## Summary

| metric | value |
|---|---:|
| samples | 2 |
| failed | 0 |

## sql_sales_sum_group_order_limit

- title: SQL SUM GROUP BY ORDER BY LIMIT
- failed: 0
- steps: 6
- unknown actions: 0
- unsupported items: 0

### Checks
- OK summary_not_generic
- OK mentions_sales
- OK mentions_status_paid_
- OK mentions_region
- OK mentions_SUM
- OK mentions_amount
- OK mentions_total_amount
- OK mentions_ORDER_BY
- OK mentions_LIMIT_5
- OK mentions_상위_5개
- OK has_steps
- OK no_unknown_actions
- OK no_known_sql_unsupported

### Output

요약: sales 테이블에서 status = 'paid' 조건에 맞는 행만 먼저 고릅니다. region별로 묶은 뒤, amount 값을 모두 더해서 total_amount로 계산합니다. 그 결과를 total_amount 기준으로 큰 값부터 정렬합니다. 상위 5개만 보여줍니다.

단계:
1. sales 테이블에서 데이터 읽기
   - FROM sales 절은 sales 테이블을 대상으로 쿼리를 실행한다는 뜻입니다.
2. 조건에 맞는 행만 고르기
   - WHERE status = 'paid' 조건으로 필요한 행만 먼저 남깁니다.
3. region별로 묶기
   - GROUP BY region 절은 같은 region 값을 가진 행들을 한 묶음으로 모읍니다.
4. SUM 집계 계산
   - SUM(amount) AS total_amount는 각 묶음마다 amount 값을 모두 더해서 total_amount로 계산한다는 뜻입니다.
5. 결과 정렬
   - ORDER BY total_amount DESC 절은 집계 결과를 total_amount 기준으로 큰 값부터 정렬한다는 뜻입니다.
6. 보여줄 개수 제한
   - LIMIT 5 절은 정렬된 결과 중 앞에서 5개만 보여준다는 뜻입니다.

## sql_orders_count_group_order

- title: SQL COUNT GROUP BY ORDER BY
- failed: 0
- steps: 4
- unknown actions: 0
- unsupported items: 0

### Checks
- OK summary_not_generic
- OK mentions_orders
- OK mentions_category
- OK mentions_COUNT
- OK mentions_order_count
- OK mentions_ORDER_BY
- OK mentions_큰_값부터_정렬
- OK has_steps
- OK no_unknown_actions
- OK no_known_sql_unsupported

### Output

요약: orders 테이블의 행을 대상으로 봅니다. category별로 묶은 뒤, 주문 수(행 개수)를 세어서 order_count로 계산합니다. 그 결과를 order_count 기준으로 큰 값부터 정렬합니다.

단계:
1. orders 테이블에서 데이터 읽기
   - FROM orders 절은 orders 테이블을 대상으로 쿼리를 실행한다는 뜻입니다.
2. category별로 묶기
   - GROUP BY category 절은 같은 category 값을 가진 행들을 한 묶음으로 모읍니다.
3. COUNT 집계 계산
   - COUNT(*) AS order_count는 각 묶음마다 주문 수(행 개수)를 세어서 order_count로 계산한다는 뜻입니다.
4. 결과 정렬
   - ORDER BY order_count DESC 절은 집계 결과를 order_count 기준으로 큰 값부터 정렬한다는 뜻입니다.

