-- phpMyAdmin SQL Dump
-- version 4.3.8
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 22, 2016 at 09:33 AM
-- Server version: 5.6.32-78.1-log
-- PHP Version: 5.4.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `danniel5_csc309`
--

-- --------------------------------------------------------

--
-- Table structure for table `Pattern`
--

CREATE TABLE IF NOT EXISTS `Pattern` (
  `PID` int(11) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Author` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Patterns to different strata puzzles.';

-- --------------------------------------------------------

--
-- Table structure for table `Solution`
--

CREATE TABLE IF NOT EXISTS `Solution` (
  `PID` int(11) NOT NULL,
  `EntryNumber` int(11) NOT NULL,
  `Color` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE IF NOT EXISTS `User` (
  `Username` varchar(30) NOT NULL,
  `Password` varchar(30) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `Patterns` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `UserPattern`
--

CREATE TABLE IF NOT EXISTS `UserPattern` (
  `Username` varchar(30) NOT NULL,
  `PID` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Pattern`
--
ALTER TABLE `Pattern`
  ADD KEY `PID` (`PID`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`Username`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
