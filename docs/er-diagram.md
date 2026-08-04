# 数据库 ER 图

## 实体关系图

```mermaid
erDiagram
  baby ||--o{ feeding        : "baby_id"
  baby ||--o{ diaper         : "baby_id"
  baby ||--o{ sleep          : "baby_id"
  baby ||--o{ supplement     : "baby_id"
  baby ||--o{ activity       : "baby_id"
  baby ||--o{ growth_record  : "baby_id(预留)"
  baby ||--o{ medical_record : "baby_id(预留)"
  baby ||--o{ ai_analysis    : "baby_id(预留)"

  user ||--o{ feeding        : "creator_id"
  user ||--o{ diaper         : "creator_id"
  user ||--o{ sleep          : "creator_id"
  user ||--o{ supplement     : "creator_id"
  user ||--o{ activity       : "creator_id"
  user ||--o{ growth_record  : "creator_id"
  user ||--o{ medical_record : "creator_id"

  baby {
    int id PK
    string name
    string nickname
    Gender gender
    date birthday
    decimal birth_weight
    decimal birth_height
    decimal head_circumference
    string birth_hospital
    string remark
    timestamp created_time
    timestamp updated_time
  }
  user {
    int id PK
    string name
    UserRole role
    timestamp created_time
  }
  feeding {
    int id PK
    int baby_id FK
    timestamp feeding_time
    FeedingType feeding_type
    int amount_ml
    int duration_minutes
    string remark
    int creator_id FK
    timestamp created_time
  }
  diaper {
    int id PK
    int baby_id FK
    timestamp change_time
    DiaperType type
    string remark
    int creator_id FK
    timestamp created_time
  }
  sleep {
    int id PK
    int baby_id FK
    timestamp start_time
    timestamp end_time
    int duration_minutes
    SleepType sleep_type
    string remark
    int creator_id FK
    timestamp created_time
  }
  supplement {
    int id PK
    int baby_id FK
    string name
    string amount
    string unit
    timestamp take_time
    string remark
    int creator_id FK
    timestamp created_time
  }
  activity {
    int id PK
    int baby_id FK
    string event_type
    timestamp event_time
    string description
    string remark
    int creator_id FK
    timestamp created_time
  }
  growth_record {
    int id PK
    int baby_id FK
    timestamp measure_time
    decimal weight
    decimal height
    decimal head_circumference
    int creator_id FK
  }
  medical_record {
    int id PK
    int baby_id FK
    string record_type
    timestamp record_time
    string title
    int creator_id FK
  }
  ai_analysis {
    int id PK
    int baby_id FK
    string analysis_type
    timestamp period_start
    timestamp period_end
    json input
    json result
    string model
  }
```

## 枚举说明

| 枚举 | 值 | 说明 |
|---|---|---|
| Gender | MALE / FEMALE | 男 / 女 |
| UserRole | DAD / MOM / GRANDPA_P / GRANDMA_P / GRANDMA_M / GRANDPA_M | 爸爸/妈妈/爷爷/奶奶/姥姥/姥爷 |
| FeedingType | BREAST_MILK / FORMULA / MIXED | 母乳/奶粉/混合 |
| DiaperType | PEE / POOP / BOTH | 尿/便便/尿+便 |
| SleepType | DAYTIME / NIGHT | 白天/夜间 |

## 索引策略

每张业务表均建复合索引 `(baby_id, 业务时间)`，覆盖最高频的「按宝宝 + 时间范围」查询/统计/可视化路径；并单独建 `creator_id` 索引。
