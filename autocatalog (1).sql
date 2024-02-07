-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 06, 2024 at 11:26 PM
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
-- Database: `autocatalog`
--

-- --------------------------------------------------------

--
-- Table structure for table `auto`
--

CREATE TABLE `auto` (
  `ID` int(11) NOT NULL,
  `auto_nr` varchar(20) DEFAULT NULL,
  `auto_gads` int(4) DEFAULT NULL,
  `markaID` int(11) DEFAULT NULL,
  `motorsID` int(11) DEFAULT NULL,
  `motoratilpums` int(4) DEFAULT NULL,
  `pilnamasa` int(4) DEFAULT NULL,
  `pasmasa` int(4) DEFAULT NULL,
  `piedzinaID` int(11) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_latvian_ci;

-- --------------------------------------------------------

--
-- Table structure for table `marka`
--

CREATE TABLE `marka` (
  `ID` int(11) NOT NULL,
  `nosaukums` varchar(200) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_latvian_ci;

--
-- Dumping data for table `marka`
--

INSERT INTO `marka` (`ID`, `nosaukums`) VALUES
(1, 'AUDI'),
(2, 'BMW'),
(3, 'LADA'),
(4, 'MAZDA'),
(5, 'VOLVO');

-- --------------------------------------------------------

--
-- Table structure for table `motors`
--

CREATE TABLE `motors` (
  `ID` int(11) NOT NULL,
  `nosaukums` varchar(200) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_latvian_ci;

--
-- Dumping data for table `motors`
--

INSERT INTO `motors` (`ID`, `nosaukums`) VALUES
(1, 'BENZ'),
(3, 'DIZEL'),
(4, 'GĀZE'),
(5, 'ELEKT'),
(6, 'HIBR');

-- --------------------------------------------------------

--
-- Table structure for table `piedzina`
--

CREATE TABLE `piedzina` (
  `ID` int(11) NOT NULL,
  `nosaukums` varchar(200) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_latvian_ci;

--
-- Dumping data for table `piedzina`
--

INSERT INTO `piedzina` (`ID`, `nosaukums`) VALUES
(1, 'QUATTRO'),
(2, 'AIZMUG'),
(3, 'PRIEKŠ'),
(4, 'xDrive');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `auto`
--
ALTER TABLE `auto`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `auto_nr` (`auto_nr`);

--
-- Indexes for table `marka`
--
ALTER TABLE `marka`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `motors`
--
ALTER TABLE `motors`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `piedzina`
--
ALTER TABLE `piedzina`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `auto`
--
ALTER TABLE `auto`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `marka`
--
ALTER TABLE `marka`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `motors`
--
ALTER TABLE `motors`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `piedzina`
--
ALTER TABLE `piedzina`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
