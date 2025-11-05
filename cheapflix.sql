-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 05, 2025 at 03:02 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cheapflix`
--

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_logs`
--

CREATE TABLE `audit_logs` (
  `log_id` int(11) NOT NULL,
  `action_type` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cancellation_requests`
--

CREATE TABLE `cancellation_requests` (
  `request_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `requested_at` datetime DEFAULT current_timestamp(),
  `effective_date` date NOT NULL,
  `processed` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `currency_rates`
--

CREATE TABLE `currency_rates` (
  `currency_code` char(3) NOT NULL,
  `rate_to_gbp` decimal(12,6) NOT NULL,
  `last_updated` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `currency_rates`
--

INSERT INTO `currency_rates` (`currency_code`, `rate_to_gbp`, `last_updated`) VALUES
('BDT', 0.007200, '2025-11-01 20:17:11'),
('EUR', 0.850000, '2025-11-01 20:17:11'),
('GBP', 1.000000, '2025-11-01 20:17:11'),
('USD', 0.790000, '2025-11-01 20:17:11');

-- --------------------------------------------------------

--
-- Table structure for table `devices`
--

CREATE TABLE `devices` (
  `device_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `device_name` varchar(100) DEFAULT NULL,
  `device_token` varchar(100) DEFAULT NULL,
  `registered_at` datetime DEFAULT current_timestamp(),
  `last_login` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `devices`
--

INSERT INTO `devices` (`device_id`, `user_id`, `device_name`, `device_token`, `registered_at`, `last_login`) VALUES
(19, 5, 'Web Browser', 'device_wdikft1cfdp_1762276732254', '2025-11-04 23:18:52', '2025-11-04 23:18:52'),
(20, 6, 'Web Browser', 'device_dtksx729pak_1762300483990', '2025-11-05 05:54:44', '2025-11-05 05:54:44'),
(22, 7, 'Web Browser', 'device_2kkhja837w_1762302317968', '2025-11-05 06:25:18', '2025-11-05 06:25:18'),
(23, 4, 'Web Browser', 'device_38qieeukga_1762302736800', '2025-11-05 06:32:16', '2025-11-05 06:32:16');

-- --------------------------------------------------------

--
-- Table structure for table `downloads`
--

CREATE TABLE `downloads` (
  `download_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `movie_id` int(11) NOT NULL,
  `download_date` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `movies`
--

CREATE TABLE `movies` (
  `movie_id` int(11) NOT NULL,
  `title` varchar(150) NOT NULL,
  `genre` varchar(50) DEFAULT NULL,
  `release_year` year(4) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `added_by_admin` int(11) DEFAULT NULL,
  `added_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `movies`
--

INSERT INTO `movies` (`movie_id`, `title`, `genre`, `release_year`, `duration`, `description`, `file_url`, `thumbnail_url`, `added_by_admin`, `added_at`) VALUES
(2, 'aaaaac', 'Adventure', '2025', 4, 'anananan', 'video-1762268068613.mp4', 'thumbnail-1762268068950.png', NULL, '2025-11-04 20:54:29'),
(3, 'anuv', 'Adventure', '2025', 4, 'song', 'video-1762268576535.mp4', 'thumbnail-1762268577357.png', NULL, '2025-11-04 21:02:57'),
(4, 'ishq', 'Romance', '2025', 4, 'nffffff', 'video-1762268640786.mp4', 'thumbnail-1762268641388.png', NULL, '2025-11-04 21:04:01'),
(6, 'Nunu', 'Horror', '2025', 2, 'Nunu nai nuigga', 'video-1762270948421.mp4', 'thumbnail-1762270948579.png', NULL, '2025-11-04 21:42:28');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `subject` varchar(150) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `sent_at` datetime DEFAULT current_timestamp(),
  `type` enum('Receipt','MovieUpdate','General') DEFAULT 'General'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `payment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subscription_id` int(11) NOT NULL,
  `payment_method` enum('CreditCard','PayPal','GooglePay') NOT NULL,
  `amount` decimal(8,2) NOT NULL,
  `currency_code` char(3) DEFAULT 'GBP',
  `exchange_rate` decimal(10,6) DEFAULT 1.000000,
  `transaction_date` datetime DEFAULT current_timestamp(),
  `card_last4` char(4) DEFAULT NULL,
  `non_refundable` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`payment_id`, `user_id`, `subscription_id`, `payment_method`, `amount`, `currency_code`, `exchange_rate`, `transaction_date`, `card_last4`, `non_refundable`) VALUES
(1, 1, 1, 'CreditCard', 4.99, 'GBP', 1.000000, '2025-11-02 20:59:20', '3212', 1),
(3, 1, 2, 'CreditCard', 3.00, 'GBP', 1.000000, '2025-11-02 20:59:38', '4242', 1),
(5, 1, 1, 'CreditCard', 4.99, 'GBP', 1.000000, '2025-11-02 21:00:01', '4242', 1),
(6, 2, 2, 'CreditCard', 7.99, 'GBP', 1.000000, '2025-11-02 23:01:45', '2345', 1),
(8, 1, 2, 'CreditCard', 3.00, 'GBP', 1.000000, '2025-11-04 19:58:54', '4242', 1),
(10, 1, 3, 'CreditCard', 2.00, 'GBP', 1.000000, '2025-11-04 19:59:00', '4242', 1),
(12, 1, 2, 'CreditCard', 7.99, 'GBP', 1.000000, '2025-11-04 20:09:17', '4242', 1),
(13, 1, 1, 'CreditCard', 4.99, 'GBP', 1.000000, '2025-11-04 20:09:24', '4242', 1),
(14, 2, 3, 'CreditCard', 2.00, 'GBP', 1.000000, '2025-11-04 20:13:07', '4242', 1),
(16, 2, 2, 'CreditCard', 7.99, 'BDT', 1.000000, '2025-11-04 20:25:20', '4242', 1),
(17, 2, 1, 'CreditCard', 4.99, 'BDT', 1.000000, '2025-11-04 20:28:52', '4242', 1),
(18, 2, 3, 'CreditCard', 5.00, 'GBP', 1.000000, '2025-11-04 20:29:20', '4242', 1),
(20, 3, 1, 'CreditCard', 4.99, 'GBP', 1.000000, '2025-11-04 20:30:42', '6711', 1),
(22, 2, 1, 'CreditCard', 4.99, 'BDT', 1.000000, '2025-11-04 21:32:10', '4242', 1),
(23, 4, 2, 'CreditCard', 7.99, 'GBP', 1.000000, '2025-11-04 23:07:55', '4567', 1),
(25, 5, 1, 'CreditCard', 4.99, 'GBP', 1.000000, '2025-11-05 04:32:03', '3556', 1),
(27, 6, 3, 'CreditCard', 0.07, 'BDT', 0.007200, '2025-11-05 05:56:34', '3234', 1),
(29, 7, 3, 'CreditCard', 9.99, 'GBP', 1.000000, '2025-11-05 06:27:11', '5432', 1),
(31, 4, 1, 'CreditCard', 4.99, 'BDT', 1.000000, '2025-11-05 06:48:43', '4242', 1),
(32, 4, 3, 'CreditCard', 5.00, 'GBP', 1.000000, '2025-11-05 06:49:04', '4242', 1),
(34, 4, 1, 'CreditCard', 4.99, 'BDT', 1.000000, '2025-11-05 07:06:34', '4242', 1),
(35, 4, 2, 'CreditCard', 3.00, 'GBP', 1.000000, '2025-11-05 07:06:43', '4242', 1),
(37, 4, 1, 'CreditCard', 4.99, 'BDT', 1.000000, '2025-11-05 07:12:41', '4242', 1),
(38, 4, 2, 'CreditCard', 3.00, 'GBP', 1.000000, '2025-11-05 07:12:46', '4242', 1),
(40, 4, 3, 'CreditCard', 2.00, 'GBP', 1.000000, '2025-11-05 07:12:52', '4242', 1),
(42, 4, 1, 'CreditCard', 4.99, 'BDT', 1.000000, '2025-11-05 07:29:39', '4242', 1),
(43, 4, 2, 'CreditCard', 3.00, 'GBP', 1.000000, '2025-11-05 07:29:48', '4242', 1),
(45, 4, 3, 'CreditCard', 5.00, 'GBP', 1.000000, '2025-11-05 07:29:52', '4242', 1),
(47, 4, 2, 'CreditCard', 3.00, 'GBP', 1.000000, '2025-11-05 07:30:03', '4242', 1),
(49, 4, 3, 'CreditCard', 5.00, 'GBP', 1.000000, '2025-11-05 07:30:30', '4242', 1),
(51, 4, 2, 'CreditCard', 3.00, 'GBP', 1.000000, '2025-11-05 07:35:31', '4242', 1),
(52, 4, 2, 'CreditCard', 3.00, 'GBP', 1.000000, '2025-11-05 07:38:43', '4242', 1),
(53, 4, 2, 'CreditCard', 3.00, 'BDT', 1.000000, '2025-11-05 07:38:43', '4242', 1),
(54, 4, 3, 'CreditCard', 2.00, 'GBP', 1.000000, '2025-11-05 07:46:42', '4242', 1),
(55, 4, 3, 'CreditCard', 2.00, 'BDT', 1.000000, '2025-11-05 07:46:42', '4242', 1),
(56, 4, 2, 'CreditCard', 7.99, 'BDT', 1.000000, '2025-11-05 07:47:15', '4242', 1),
(57, 4, 3, 'CreditCard', 2.00, 'GBP', 1.000000, '2025-11-05 07:47:20', '4242', 1),
(58, 4, 3, 'CreditCard', 2.00, 'BDT', 1.000000, '2025-11-05 07:47:20', '4242', 1);

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `subscription_id` int(11) NOT NULL,
  `level_name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `monthly_fee` decimal(6,2) NOT NULL,
  `max_devices` int(11) DEFAULT 1,
  `can_download` tinyint(1) DEFAULT 0,
  `cooldown_days` int(11) DEFAULT 7
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`subscription_id`, `level_name`, `description`, `monthly_fee`, `max_devices`, `can_download`, `cooldown_days`) VALUES
(1, 'Level 1', 'View-only access, 1 device, 7-day switch wait, no downloads', 4.99, 1, 0, 7),
(2, 'Level 2', 'View + download, 1 device', 7.99, 1, 1, 0),
(3, 'Level 3', 'View + download + 3 devices', 9.99, 3, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `country` varchar(50) DEFAULT NULL,
  `currency_code` char(3) DEFAULT 'GBP',
  `current_subscription_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `email`, `password_hash`, `phone`, `address`, `country`, `currency_code`, `current_subscription_id`, `created_at`, `updated_at`) VALUES
(1, 'Nahin Zubayer', 'rafironin@gmail.com', '$2b$10$/3vLmlldkRiOysdfae8MaOpbn7ofWnUZmxli4yp1G.yiHh5iqF18u', '01754654695', '310/1 golgonda', 'Bangladesh', 'GBP', 1, '2025-11-01 23:58:43', '2025-11-04 20:09:24'),
(2, 'Nahin Zubayer', 'rafi@gmail.com', '$2b$10$mDYhF625rc9V58LEy3q6yuVIFJH33CJ4Lj0KP85KbqUFf2DqtpHaW', '01754654695', '310/1 golgonda', 'Bangladesh', 'BDT', 1, '2025-11-02 21:51:32', '2025-11-04 21:32:10'),
(3, 'nnnnn', 'nn@gmail.com', '$2b$10$ytvkgAqt7TY4ce0FxW2rS.bijeICB7XTzG/.YmI0iCMZSH9Z9Aj/q', '01754654695', '310/1 golgonda', 'Bangladesh', 'GBP', 1, '2025-11-04 20:30:06', '2025-11-04 20:30:42'),
(4, 'Mahin Jawad', 'mahin1575@gmail.com', '$2b$10$M0L2kEKSWGEb64upZSgi9eAiaij8TsIco1KzQhoUIKWry5j/Sl.Ya', '01744842814', 'Depz, Ashulia,Savar, Dhaka', 'Bangladesh', 'BDT', 3, '2025-11-04 21:48:39', '2025-11-05 07:47:20'),
(5, 'Mahin Tanzim', 'mahin@gmail.com', '$2b$10$c2Sg9br.hAx100Q/r1zP0OcrcwExBhy6tFHQmTLIXr.AdR2Vx0vbm', '01744842814', 'Depz, Ashulia,Savar, Dhaka', 'Bangladesh', 'BDT', 1, '2025-11-04 23:09:13', '2025-11-05 04:36:10'),
(6, 'Mahin Jawad', 'mahin@email.com', '$2b$10$1czs/WNmOmy2UqS4C/boceIdE2WKLdMVb7AnkE6aZGBKoS97apva.', '01744842814', 'Depz, Ashulia,Savar, Dhaka', 'Bangladesh', 'BDT', 3, '2025-11-05 05:54:26', '2025-11-05 05:56:34'),
(7, 'Admin', 'admin@cheapflix.com', '$2b$10$9E3toCILwohzjmqzEzH86.L6cZ1KMSWsX8U13THON5d9D7U5CZc5K', '01234567891', 'Borderland, Chernobil, India', 'India', 'BDT', 3, '2025-11-05 06:25:02', '2025-11-05 06:27:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `cancellation_requests`
--
ALTER TABLE `cancellation_requests`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `currency_rates`
--
ALTER TABLE `currency_rates`
  ADD PRIMARY KEY (`currency_code`);

--
-- Indexes for table `devices`
--
ALTER TABLE `devices`
  ADD PRIMARY KEY (`device_id`),
  ADD UNIQUE KEY `device_token` (`device_token`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `downloads`
--
ALTER TABLE `downloads`
  ADD PRIMARY KEY (`download_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`movie_id`),
  ADD KEY `added_by_admin` (`added_by_admin`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `subscription_id` (`subscription_id`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`subscription_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `current_subscription_id` (`current_subscription_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `audit_logs`
--
ALTER TABLE `audit_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cancellation_requests`
--
ALTER TABLE `cancellation_requests`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `devices`
--
ALTER TABLE `devices`
  MODIFY `device_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `downloads`
--
ALTER TABLE `downloads`
  MODIFY `download_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `movie_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `subscription_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `audit_logs`
--
ALTER TABLE `audit_logs`
  ADD CONSTRAINT `audit_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- Constraints for table `cancellation_requests`
--
ALTER TABLE `cancellation_requests`
  ADD CONSTRAINT `cancellation_requests_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `devices`
--
ALTER TABLE `devices`
  ADD CONSTRAINT `devices_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `downloads`
--
ALTER TABLE `downloads`
  ADD CONSTRAINT `downloads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `downloads_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`movie_id`) ON DELETE CASCADE;

--
-- Constraints for table `movies`
--
ALTER TABLE `movies`
  ADD CONSTRAINT `movies_ibfk_1` FOREIGN KEY (`added_by_admin`) REFERENCES `admins` (`admin_id`) ON DELETE SET NULL;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`subscription_id`) ON DELETE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`current_subscription_id`) REFERENCES `subscriptions` (`subscription_id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
