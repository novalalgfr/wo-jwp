-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 27, 2025 at 05:41 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_wedding`
--

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `package_id` int(11) NOT NULL,
  `customer_name` text NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `email` varchar(20) DEFAULT NULL,
  `status` enum('request','approved') NOT NULL DEFAULT 'request',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `package_id`, `customer_name`, `phone_number`, `email`, `status`, `created_at`, `updated_at`) VALUES
(1, 5, 'Noval', '081383047390', 'noval@gmail.com', 'approved', '2025-09-26 23:04:20', '2025-09-26 23:04:20'),
(2, 1, 'Tes', '081383047390', 'test@example.com', 'request', '2025-09-26 23:04:20', '2025-09-26 23:04:20'),
(3, 3, 'Noval', '081383047390', 'noval@gmail.com', 'request', '2025-09-27 06:50:39', '2025-09-27 06:50:39'),
(4, 5, 'Noval', '081383047390', 'noval@gmail.com', 'request', '2025-09-27 07:34:27', '2025-09-27 07:34:27');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(20) NOT NULL,
  `email` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`) VALUES
(2, 'nopall', 'nopall@gmail.com', '$2b$10$LhfshH0Ji8gB.9itbvx.tOyg/U7x6YQXCD7X1i2FhpsWpxOH8YKDe');

-- --------------------------------------------------------

--
-- Table structure for table `website_profile`
--

CREATE TABLE `website_profile` (
  `id` int(11) NOT NULL DEFAULT 1,
  `hero_badge_text` varchar(20) DEFAULT NULL,
  `hero_title` varchar(30) DEFAULT NULL,
  `hero_subtitle` text DEFAULT NULL,
  `hero_description` text DEFAULT NULL,
  `hero_image_1` varchar(255) DEFAULT NULL,
  `hero_image_2` varchar(255) DEFAULT NULL,
  `hero_cta_text` varchar(20) DEFAULT NULL,
  `testimonial_text` text DEFAULT NULL,
  `testimonial_author` varchar(20) DEFAULT NULL,
  `about_description` text DEFAULT NULL,
  `satisfied_couples_count` int(11) DEFAULT NULL,
  `portfolio_projects_count` int(11) DEFAULT NULL,
  `service_1_title` varchar(30) DEFAULT NULL,
  `service_2_title` varchar(30) DEFAULT NULL,
  `service_3_title` varchar(30) DEFAULT NULL,
  `process_step_1` varchar(30) DEFAULT NULL,
  `process_step_2` varchar(30) DEFAULT NULL,
  `process_step_3` varchar(30) DEFAULT NULL,
  `process_step_4` varchar(30) DEFAULT NULL,
  `process_step_5` varchar(30) DEFAULT NULL,
  `process_description` text DEFAULT NULL,
  `gallery_image_1` varchar(255) DEFAULT NULL,
  `gallery_image_2` varchar(255) DEFAULT NULL,
  `gallery_image_3` varchar(255) DEFAULT NULL,
  `gallery_image_4` varchar(255) DEFAULT NULL,
  `gallery_image_5` varchar(255) DEFAULT NULL,
  `gallery_image_6` varchar(255) DEFAULT NULL,
  `gallery_image_7` varchar(255) DEFAULT NULL,
  `gallery_image_8` varchar(255) DEFAULT NULL,
  `aesthetic_text` text DEFAULT NULL,
  `gallery_cta_text` text DEFAULT NULL,
  `bottom_title` varchar(50) DEFAULT NULL,
  `bottom_description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `website_profile`
--

INSERT INTO `website_profile` (`id`, `hero_badge_text`, `hero_title`, `hero_subtitle`, `hero_description`, `hero_image_1`, `hero_image_2`, `hero_cta_text`, `testimonial_text`, `testimonial_author`, `about_description`, `satisfied_couples_count`, `portfolio_projects_count`, `service_1_title`, `service_2_title`, `service_3_title`, `process_step_1`, `process_step_2`, `process_step_3`, `process_step_4`, `process_step_5`, `process_description`, `gallery_image_1`, `gallery_image_2`, `gallery_image_3`, `gallery_image_4`, `gallery_image_5`, `gallery_image_6`, `gallery_image_7`, `gallery_image_8`, `aesthetic_text`, `gallery_cta_text`, `bottom_title`, `bottom_description`, `created_at`, `updated_at`) VALUES
(1, 'a day to remember', 'Made with lots of love', 'From finding your perfect wedding venue, to budgeting and concept creation, to being your wedding day manager on your big day, we will take care of exactly whay you want us to do, so you can relax and enjoy your wedding', 'Welcome to W. where your dream day becomes our passion, from intimate gatherings to grand celebrations, our dedicated team of experienced planners ensure that every detail is meticulously curated to perfection.', '/uploads/hero_image_1-1758926651270-beranda-1.jpg', '/uploads/hero_image_2-1758926651272-beranda-2.jpg', 'Get in touch', 'From the beautiful decor to the seamless coordination, W. exceeded our expectations in every way. They made our dream wedding a reality.', 'John & Jane', 'Planning a celebration should be a joyous journey, not a stressful one. Let us take the reins, so you can savor every moment leading up to your special day', 120, 180, '01. Full Service Wedding Plann', '02. A La Carte Wedding Plannin', '03. Month-Of Wedding Managemen', '01. Initial Consultation', '02. Planning and Design', '03. Vendor Coordination', '04. Final Preparations', '05. The Big Day', 'From the grandest elements to the tiniest touches, we pride ourselves on our meticulous attention to detail. Our goal is to create a seamless and memorable experience, leaving no stone unturned.', '/uploads/gallery_image_1-1758926651273-beranda-3.jpg', '/uploads/gallery_image_2-1758926651275-beranda-4.jpg', '/uploads/gallery_image_3-1758926651277-beranda-5.jpg', '/uploads/gallery_image_4-1758926651279-beranda-6.jpg', '/uploads/gallery_image_5-1758926651281-beranda-7.jpg', '/uploads/gallery_image_6-1758926651283-beranda-8.jpg', '/uploads/gallery_image_7-1758926651285-beranda-9.jpg', '/uploads/gallery_image_8-1758926651286-beranda-10.jpg', 'With a keen eye for aesthetics, we turn your ideas into stunning realities', 'View our gallery', 'A moment of magic, a lifetime of love.', 'We believe that your wedding should be a true reflection of your unique story. That\'s why we speacialize in bringing your vision to life, no matter what style you envision for your big day. From classic elegance to modern chic, rustic charm to glamor, we have the experience to make your dream wedding a reality.', '2025-09-26 22:27:58', '2025-09-26 22:57:38');

-- --------------------------------------------------------

--
-- Table structure for table `wedding_packages`
--

CREATE TABLE `wedding_packages` (
  `id` int(11) NOT NULL,
  `package_name` varchar(255) NOT NULL,
  `package_description` text NOT NULL,
  `package_price` decimal(12,2) NOT NULL,
  `package_image` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wedding_packages`
--

INSERT INTO `wedding_packages` (`id`, `package_name`, `package_description`, `package_price`, `package_image`) VALUES
(1, 'Castello di Solfagnano', 'Nestled in a lush, rolling valley in the heart of Umbria, this 60-hectare property is a perfect blend of tradition and innovation. Parks, vineyards, gardens, and a working farm harmonize with nature, using traditional methods to enhance the quality of raw materials.\r\n\r\nCastello di Solfagnano, nestled in the Umbrian countryside, tells a story intertwined with the lives of noble families and epochal transformations.', 15000.00, '/uploads/1758904225956-Castello-Di-Solfagnano.jpg'),
(2, 'Tenuta Corbinaia', 'Our wonderful 19th century farmhouse is located in the heart of the luxuriant Chianti landscape and offers a truly princely setting for your special event.', 12000.00, '/uploads/1758904298798-Tenuta-Corbinaia.jpg'),
(3, 'Collegio alla Querce', 'Offering an otherworldly take on one of Italy’s most beloved cities, enter the exquisite gardens of Collegio alla Querce to be immediately transported with sweeping views of both the Duomo di Firenze and the tranquil hills of Tuscany. This relaxed yet refined retreat is a delight for design lovers and gourmands alike, featuring amazing rooms, an original chapel and theater, two restaurants, and a signature bar.', 20000.00, '/uploads/1758904323840-Collegio-alla-Querce.jpg'),
(4, 'Villa Petriolo', 'An integral complex, a restored villa transformed into an agricultural estate, where centuries of history are reflected. The stimulation of the senses by nature, the possibility of accommodation to take the experience further, all combined with the most intimate Tuscan hospitality that does not give up luxury without harming the environment.\r\n\r\nBeing sustainable in luxury does not mean giving up something, but rather having the same level of comfort, combined with highest ethics and outstanding product offerts.', 25000.00, '/uploads/1758904344330-Villa-Petriolo.jpg'),
(5, 'Borgo di Vignamaggio', 'Il Borgo is a unique hamlet, an exclusive meeting place characterized by a fresh and poetic décor. The XVth century villa comprises suites, a 144-seat theater, a charming chapel with original frescos, four multifunctional event rooms, a sleepover event room with eight beds, a ballroom, and a separate dancing room with a bar. Plus, a barbershop and a retail store where we sell estate-made products. The stunning glass Greenhouse, which connects to the main buildings, hosts an abundance of plants with panoramic views over the valley, featuring ancient cypress trees, century-old olive groves and vineyards. Outside is an expansive heated pool, with breathtaking 360-degree views across the estate.', 13000.00, '/uploads/1758904389071-Borgo-di-Vignamaggio.jpg');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `package_id` (`package_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `website_profile`
--
ALTER TABLE `website_profile`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wedding_packages`
--
ALTER TABLE `wedding_packages`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `wedding_packages`
--
ALTER TABLE `wedding_packages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
