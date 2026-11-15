-- Booklog_20408 데이터베이스
-- 기존 DB와 테이블을 삭제하지 않는 안전한 생성 스크립트

CREATE DATABASE IF NOT EXISTS booklog_20408
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE booklog_20408;

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(30) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS reading_records (
    record_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_title VARCHAR(100) NOT NULL,
    author VARCHAR(50),
    genre VARCHAR(30),
    rating INT,
    review TEXT,
    read_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_reading_records_user_id (user_id),
    INDEX idx_reading_records_created_at (created_at),
    CONSTRAINT fk_reading_records_user
      FOREIGN KEY (user_id) REFERENCES users(user_id)
      ON DELETE CASCADE,
    CONSTRAINT chk_reading_records_rating
      CHECK (rating BETWEEN 1 AND 5 OR rating IS NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SHOW TABLES;
DESC users;
DESC reading_records;
