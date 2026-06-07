-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 06, 2026 at 10:03 PM
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
-- Database: `recipes_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `comment_text` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `user_id`, `recipe_id`, `comment_text`, `created_at`) VALUES
(1, 1, 8, 'cascas', '2026-06-01 18:14:07'),
(2, 1, 16, 'Ότι καλύτερο!', '2026-06-06 18:36:03'),
(3, 2, 16, 'Kala ta les!', '2026-06-06 18:36:45'),
(4, 3, 18, 'Οι φράουλες απο πάνω είναι το καλύτερο!', '2026-06-06 18:56:35');

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `recipe_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `likes`
--

INSERT INTO `likes` (`id`, `user_id`, `recipe_id`, `created_at`) VALUES
(1, 1, 8, '2026-06-01 18:15:29'),
(8, 2, 8, '2026-06-01 18:16:03'),
(12, 1, 10, '2026-06-06 17:37:53'),
(19, 1, 16, '2026-06-06 18:35:30'),
(24, 2, 16, '2026-06-06 18:36:37'),
(25, 2, 17, '2026-06-06 18:41:14'),
(26, 3, 18, '2026-06-06 18:58:27');

-- --------------------------------------------------------

--
-- Table structure for table `recipes`
--

CREATE TABLE `recipes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `category` varchar(50) NOT NULL,
  `ingredients` text NOT NULL,
  `instructions` text NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `recipes`
--

INSERT INTO `recipes` (`id`, `user_id`, `title`, `description`, `category`, `ingredients`, `instructions`, `image_path`, `created_at`) VALUES
(8, 2, 'ok', 'ok', '', 'fds', 'sa', '1780337152_Network Layout (6).drawio (1).drawio.png', '2026-06-01 18:05:52'),
(10, 1, 'fecwcdads', 'scda', 'Κυρίως Πιάτα', 'cdas', 'cdasscssc', '1780695444_vegetables-set-left-black-slate.jpg', '2026-06-05 21:37:24'),
(16, 1, 'Κλασική Καρμπονάρα', 'Μια αυθεντική ιταλική συνταγή με κρεμώδη υφή.', 'Κυρίως Πιάτα', '500γρ. σπαγγέτι\r\n200γρ. μπέικον ή πανσέτα\r\n3 μεγάλα αυγά\r\n100γρ. παρμεζάνα τριμμένη\r\nΦρεσκοτριμμένο πιπέρι', 'Βράζουμε τα μακαρόνια σε αλατισμένο νερό.\r\nΣε ένα τηγάνι σοτάρουμε το μπέικον μέχρι να γίνει τραγανό.\r\nΣε ένα μπολ χτυπάμε τα αυγά με την παρμεζάνα και το πιπέρι.\r\nΑνακατεύουμε τα ζεστά μακαρόνια με το μπέικον και αποσύρουμε από τη φωτιά.\r\nΠροσθέτουμε το μείγμα αυγών και ανακατεύουμε γρήγορα για να γίνει κρεμώδης η σάλτσα.', '1780770158_carbonara-horizontal-mediumSquareAt3X-v2.jpg', '2026-06-06 18:22:38'),
(17, 2, 'Παραδοσιακή Χωριάτικη', 'Η πιο δροσερή ελληνική σαλάτα', 'Σαλάτες', '3 ώριμες ντομάτες\r\n1 αγγούρι\r\n1 κρεμμύδι ξερό\r\n100γρ. τυρί φέτα\r\n10 ελιές καλαμών\r\nΕλαιόλαδο, ρίγανη', 'Κόβουμε τα λαχανικά σε χοντρά κομμάτια σε ένα μπολ.\r\nΠροσθέτουμε τις ελιές.\r\nΤοποθετούμε το κομμάτι της φέτας από πάνω.\r\nΠεριχύνουμε με ελαιόλαδο και πασπαλίζουμε με ρίγανη.', '1780771270_How-To-Make-A-Perfect-Greek-Salad-1024x683.jpg', '2026-06-06 18:41:10'),
(18, 3, 'Γρήγορη Μους Σοκολάτας', 'Ελαφρύ και πεντανόστιμο γλυκό για κάθε περίσταση', 'Γλυκά', '200γρ. κουβερτούρα\r\n250ml κρέμα γάλακτος\r\n1 κουταλιά μέλι', 'Λιώνουμε τη σοκολάτα σε μπεν μαρί.\r\nΧτυπάμε την κρέμα γάλακτος σε σαντιγί.\r\nΕνσωματώνουμε απαλά τη λιωμένη σοκολάτα στη σαντιγί.\r\nΜοιράζουμε σε μπολάκια και αφήνουμε στο ψυγείο για 2 ώρες.', '1780772102_Thermomix-Chocolate-Mousse-.jpg', '2026-06-06 18:55:02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `bio` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `bio`, `created_at`) VALUES
(1, 'sjpante', 'sjpante@gmail.com', '$2y$10$tJtgoQ.hur24EhLjKIGbJO4.2Acm4KqNY2hZmJjmNYqSATaH8BSwO', '', '2026-06-01 14:12:58'),
(2, 'me', 'me', '$2y$10$8ozkvGcEawWkSzy1K1oEROJBQIFklP5IDlybU5x6MdSyDEsC7y9ue', '', '2026-06-01 18:05:37'),
(3, 'sj', 'sj', '$2y$10$8Z0/WPXjavgAypadOZ.rI.w9vtj2X6rolBsbNo/CZMwMDZbXigxmW', 'Aegean College', '2026-06-06 18:47:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_like` (`user_id`,`recipe_id`),
  ADD KEY `recipe_id` (`recipe_id`);

--
-- Indexes for table `recipes`
--
ALTER TABLE `recipes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `recipes`
--
ALTER TABLE `recipes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `likes`
--
ALTER TABLE `likes`
  ADD CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`recipe_id`) REFERENCES `recipes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `recipes`
--
ALTER TABLE `recipes`
  ADD CONSTRAINT `recipes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
