-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 05, 2016 at 12:51 AM
-- Server version: 10.1.19-MariaDB
-- PHP Version: 7.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `strataDB`
--

-- --------------------------------------------------------

--
-- Table structure for table `Pattern`
--

CREATE TABLE `Pattern` (
  `PID` int(11) NOT NULL,
  `Name` varchar(30) NOT NULL,
  `Username` varchar(30) NOT NULL,
  `likes` int(11) NOT NULL DEFAULT '0',
  `timeStamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Pattern`
--

INSERT INTO `Pattern` (`PID`, `Name`, `Username`, `likes`, `timeStamp`) VALUES
(6, 'a', 'a', 0, '2016-12-04 21:27:16');

-- --------------------------------------------------------

--
-- Table structure for table `Solution`
--

CREATE TABLE `Solution` (
  `PID` int(11) NOT NULL,
  `Board` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Solution`
--

INSERT INTO `Solution` (`PID`, `Board`) VALUES
(6, '["blue","blue","blue","blue"]');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `Username` varchar(30) NOT NULL,
  `Password` varchar(30) NOT NULL,
  `Description` varchar(100) NOT NULL,
  `email` text NOT NULL,
  `type` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`Username`, `Password`, `Description`, `email`, `type`) VALUES
('a', 'a', '', '', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Pattern`
--
ALTER TABLE `Pattern`
  ADD PRIMARY KEY (`PID`),
  ADD KEY `Username` (`Username`);

--
-- Indexes for table `Solution`
--
ALTER TABLE `Solution`
  ADD KEY `PID` (`PID`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Pattern`
--
ALTER TABLE `Pattern`
  MODIFY `PID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `Pattern`
--
ALTER TABLE `Pattern`
  ADD CONSTRAINT `Pattern_ibfk_1` FOREIGN KEY (`Username`) REFERENCES `User` (`Username`);

--
-- Constraints for table `Solution`
--
ALTER TABLE `Solution`
  ADD CONSTRAINT `Solution_ibfk_1` FOREIGN KEY (`PID`) REFERENCES `Pattern` (`PID`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
