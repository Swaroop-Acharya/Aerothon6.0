-- MySQL dump 10.13  Distrib 8.0.37, for Win64 (x86_64)
--
-- Host: localhost    Database: airbus
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `aircraft_data`
--

DROP TABLE IF EXISTS `aircraft_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `aircraft_data` (
  `id` int NOT NULL AUTO_INCREMENT,
  `family_name` varchar(255) NOT NULL,
  `model_name` varchar(50) NOT NULL,
  `aircraft_id` varchar(50) NOT NULL,
  `flight_hours` int NOT NULL,
  `cycles` int NOT NULL,
  `engine1_egt_margin` int NOT NULL,
  `engine1_vibration` decimal(3,1) NOT NULL,
  `engine1_oil_pressure` varchar(50) NOT NULL,
  `engine2_egt_margin` int NOT NULL,
  `engine2_vibration` decimal(3,1) NOT NULL,
  `engine2_oil_pressure` varchar(50) NOT NULL,
  `hydraulic_system` varchar(50) NOT NULL,
  `avionics` varchar(255) NOT NULL,
  `landing_gear` varchar(50) NOT NULL,
  `system_alerts` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `aircraft_data`
--

LOCK TABLES `aircraft_data` WRITE;
/*!40000 ALTER TABLE `aircraft_data` DISABLE KEYS */;
INSERT INTO `aircraft_data` VALUES (1,'Airbus A320 Family','A318','A318-001',20000,9500,45,1.3,'Normal',43,1.4,'Low','Normal','Minor issue detected','Normal','Avionics communication error'),(2,'Airbus A320 Family','A319','A319-002',22000,11000,47,1.5,'Normal',50,1.6,'Normal','Normal','Normal','Worn','Landing gear wear detected'),(3,'Airbus A320 Family','A320','A320-003',24000,12000,50,1.4,'Normal',52,1.5,'Normal','Normal','Normal','Normal',''),(4,'Airbus A320 Family','A320neo','A320neo-004',18000,8500,55,1.3,'Normal',57,1.4,'Normal','Normal','Normal','Normal',''),(5,'Airbus A320 Family','A321','A321-005',26000,13000,48,1.6,'Normal',46,1.5,'Low','Normal','Normal','Normal','Engine 2 oil pressure low'),(6,'Airbus A320 Family','A321neo','A321neo-006',19000,9000,56,1.2,'Normal',54,1.1,'Normal','Normal','Normal','Normal',''),(7,'Airbus A320 Family','A321XLR','A321XLR-007',15000,7000,53,1.4,'Normal',55,1.3,'Normal','Minor leak detected','Normal','Normal','Hydraulic system leak'),(8,'Airbus A220 Family','A220-100','A220-100-001',12000,5500,58,1.0,'Normal',60,1.1,'Normal','Normal','Normal','Normal',''),(9,'Airbus A220 Family','A220-300','A220-300-002',14000,6500,62,1.2,'Normal',64,1.3,'Normal','Normal','Normal','Normal',''),(10,'Airbus A330 Family','A330-200','A330-200-001',30000,15000,40,1.7,'Normal',42,1.6,'Normal','Normal','Normal','Normal',''),(11,'Airbus A330 Family','A330-300','A330-300-002',32000,16000,45,1.8,'Normal',47,1.9,'Low','Normal','Normal','Normal','Engine 2 oil pressure low'),(12,'Airbus A330 Family','A330-800neo','A330-800neo-003',18000,9000,48,1.2,'Normal',50,1.3,'Normal','Normal','Normal','Normal','');
/*!40000 ALTER TABLE `aircraft_data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `airports`
--

DROP TABLE IF EXISTS `airports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `airports` (
  `AirportID` int NOT NULL AUTO_INCREMENT,
  `AirportName` varchar(255) NOT NULL,
  `City` varchar(255) NOT NULL,
  `Country` varchar(255) NOT NULL,
  `IATA_Code` varchar(10) NOT NULL,
  `ICAO_Code` varchar(10) NOT NULL,
  `AirportLatitude` decimal(9,6) NOT NULL,
  `AirportLongitude` decimal(9,6) NOT NULL,
  `Altitude` int NOT NULL,
  PRIMARY KEY (`AirportID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `airports`
--

LOCK TABLES `airports` WRITE;
/*!40000 ALTER TABLE `airports` DISABLE KEYS */;
INSERT INTO `airports` VALUES (1,'Mangalore International Airport','Mangalore','India','IXE','VOML',12.961300,74.890099,337),(2,'Mangalore International Airport','Mangalore','India','IXE','VOML',12.961300,74.890099,337),(3,'Mangalore International Airport','Mangalore','India','IXE','VOML',12.961300,74.890099,337),(4,'Mangalore International Airport','Mangalore','India','IXE','VOML',12.961300,74.890099,337);
/*!40000 ALTER TABLE `airports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `destinationairport`
--

DROP TABLE IF EXISTS `destinationairport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `destinationairport` (
  `destinationAirportId` int NOT NULL AUTO_INCREMENT,
  `destinationAirportName` varchar(255) NOT NULL,
  `destinationCity` varchar(255) NOT NULL,
  `destinationCountry` varchar(255) NOT NULL,
  `destinationIataCode` varchar(3) NOT NULL,
  `destinationIcaoCode` varchar(4) NOT NULL,
  `destinationLatitude` decimal(10,6) NOT NULL,
  `destinationLongitude` decimal(10,6) NOT NULL,
  `destinationAltitude` int NOT NULL,
  `timezone` varchar(50) NOT NULL,
  PRIMARY KEY (`destinationAirportId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `destinationairport`
--

LOCK TABLES `destinationairport` WRITE;
/*!40000 ALTER TABLE `destinationairport` DISABLE KEYS */;
INSERT INTO `destinationairport` VALUES (1,'Kempegowda International Airport','Bangalore','India','BLR','VOBL',13.197900,77.706299,3000,'Asia/Calcutta'),(2,'Kempegowda International Airport','Bangalore','India','BLR','VOBL',13.197900,77.706299,3000,'Asia/Calcutta'),(3,'Kempegowda International Airport','Bangalore','India','BLR','VOBL',13.197900,77.706299,3000,'Asia/Calcutta');
/*!40000 ALTER TABLE `destinationairport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fuel`
--

DROP TABLE IF EXISTS `fuel`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fuel` (
  `FuelID` int NOT NULL AUTO_INCREMENT,
  `ICAO24` varchar(10) DEFAULT NULL,
  `Distance` decimal(10,2) DEFAULT NULL,
  `Fuel` decimal(10,2) DEFAULT NULL,
  `Co2` decimal(10,2) DEFAULT NULL,
  `IATA_Code` varchar(10) DEFAULT NULL,
  `ICAO_Code` varchar(10) DEFAULT NULL,
  `Model` varchar(255) DEFAULT NULL,
  `GcdTrue` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`FuelID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fuel`
--

LOCK TABLES `fuel` WRITE;
/*!40000 ALTER TABLE `fuel` DISABLE KEYS */;
INSERT INTO `fuel` VALUES (1,'60006b',623.74,20348.56,64301.45,'74R','B74R','Boeing 747SR',1),(2,'60006b',623.74,20348.56,64301.45,'74R','B74R','Boeing 747SR',1),(3,'60006b',623.74,20348.56,64301.45,'74R','B74R','Boeing 747SR',1),(4,'60006b',623.74,20348.56,64301.45,'74R','B74R','Boeing 747SR',1),(5,'60006b',623.74,20348.56,64301.45,'74R','B74R','Boeing 747SR',1),(6,'60006b',623.74,20348.56,64301.45,'74R','B74R','Boeing 747SR',1),(7,'60006b',623.74,20348.56,64301.45,'74R','B74R','Boeing 747SR',1),(8,'60006b',623.74,20348.56,64301.45,'74R','B74R','Boeing 747SR',1);
/*!40000 ALTER TABLE `fuel` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nearestairport`
--

DROP TABLE IF EXISTS `nearestairport`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nearestairport` (
  `AirportID` int NOT NULL AUTO_INCREMENT,
  `AirportName` varchar(255) DEFAULT NULL,
  `City` varchar(255) DEFAULT NULL,
  `IATA_Code` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`AirportID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nearestairport`
--

LOCK TABLES `nearestairport` WRITE;
/*!40000 ALTER TABLE `nearestairport` DISABLE KEYS */;
INSERT INTO `nearestairport` VALUES (1,NULL,NULL,NULL),(2,'KEMPEGOWDA INTL','BENGALURU','BLR'),(3,'INTERNATIONAL','COIMBATORE','CJB'),(4,'TIRUCHIRAPPALLI','TIRUCHCHIRAPPALLI','TRZ'),(5,'INTERNATIONAL','KOZHIKODE','CCJ'),(6,'TIRUPATI','TIRUPATI','TIR'),(7,'CUDDAPAH','CUDDAPAH','CDP'),(8,'CHENNAI INTERNATIONAL','CHENNAI','MAA'),(9,'KOCHI INTERNATIONAL','KOCHI','COK'),(10,'MADURAI','MADURAI','IXM'),(11,NULL,NULL,NULL),(12,'KEMPEGOWDA INTL','BENGALURU','BLR'),(13,'INTERNATIONAL','COIMBATORE','CJB'),(14,'TIRUCHIRAPPALLI','TIRUCHCHIRAPPALLI','TRZ'),(15,'INTERNATIONAL','KOZHIKODE','CCJ'),(16,'TIRUPATI','TIRUPATI','TIR'),(17,'CUDDAPAH','CUDDAPAH','CDP'),(18,'CHENNAI INTERNATIONAL','CHENNAI','MAA'),(19,'KOCHI INTERNATIONAL','KOCHI','COK'),(20,'MADURAI','MADURAI','IXM');
/*!40000 ALTER TABLE `nearestairport` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weather`
--

DROP TABLE IF EXISTS `weather`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weather` (
  `WeatherID` int NOT NULL AUTO_INCREMENT,
  `Location` varchar(255) DEFAULT NULL,
  `WeatherText` varchar(255) DEFAULT NULL,
  `Latitude` decimal(9,6) DEFAULT NULL,
  `Longitude` decimal(9,6) DEFAULT NULL,
  `WindSpeed` decimal(10,2) DEFAULT NULL,
  `WindDirection` varchar(50) DEFAULT NULL,
  `VisibilityKm` decimal(10,2) DEFAULT NULL,
  `TemperatureCelsius` decimal(10,2) DEFAULT NULL,
  `PressureMb` decimal(10,2) DEFAULT NULL,
  `PrecipitationMm` decimal(10,2) DEFAULT NULL,
  `Humidity` int DEFAULT NULL,
  `CloudCover` int DEFAULT NULL,
  `UvIndex` int DEFAULT NULL,
  `GustMph` decimal(10,2) DEFAULT NULL,
  `TimeStamp` int DEFAULT NULL,
  PRIMARY KEY (`WeatherID`)
) ENGINE=InnoDB AUTO_INCREMENT=261 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weather`
--

LOCK TABLES `weather` WRITE;
/*!40000 ALTER TABLE `weather` DISABLE KEYS */;
INSERT INTO `weather` VALUES (1,'Mangalore','Moderate or heavy rain with thunder',12.860000,74.840000,22.00,'WNW',5.00,28.00,1002.00,1.12,89,75,6,20.80,1716551100),(2,'Bangalore','Moderate or heavy rain with thunder',12.980000,77.580000,9.00,'SSW',5.00,24.00,1005.00,0.39,89,100,6,6.10,1716551100),(3,'Mysore','Cloudy',12.310000,76.650000,14.40,'WSW',10.00,23.90,1004.00,0.00,86,75,5,13.30,1716552000),(4,'Chittoor','Partly Cloudy',13.200000,79.120000,20.20,'SE',10.00,35.80,997.00,0.00,36,44,9,16.70,1716552000),(5,'Vellore','Partly Cloudy',12.930000,79.130000,15.10,'SSW',10.00,33.50,999.00,0.00,50,52,8,10.80,1716552000),(6,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(7,'Vellore','Partly Cloudy',12.930000,79.130000,15.10,'SSW',10.00,33.50,999.00,0.00,50,52,8,10.80,1716552000),(8,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(9,'Vellore','Partly Cloudy',12.930000,79.130000,15.10,'SSW',10.00,33.50,999.00,0.00,50,52,8,10.80,1716552000),(10,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(11,'Mysore','Cloudy',12.310000,76.650000,14.40,'WSW',10.00,23.90,1004.00,0.00,86,75,5,13.30,1716552000),(12,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(13,'Vellore','Partly Cloudy',12.930000,79.130000,15.10,'SSW',10.00,33.50,999.00,0.00,50,52,8,10.80,1716552000),(14,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(15,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(16,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(17,'Vellore','Partly Cloudy',12.930000,79.130000,15.10,'SSW',10.00,33.50,999.00,0.00,50,52,8,10.80,1716552000),(18,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(19,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(20,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(21,'Mysore','Cloudy',12.310000,76.650000,14.40,'WSW',10.00,23.90,1004.00,0.00,86,75,5,13.30,1716552000),(22,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(23,'Vellore','Partly Cloudy',12.930000,79.130000,15.10,'SSW',10.00,33.50,999.00,0.00,50,52,8,10.80,1716552000),(24,'Mysore','Cloudy',12.310000,76.650000,14.40,'WSW',10.00,23.90,1004.00,0.00,86,75,5,13.30,1716552000),(25,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(26,'Mysore','Cloudy',12.310000,76.650000,14.40,'WSW',10.00,23.90,1004.00,0.00,86,75,5,13.30,1716552000),(27,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(28,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(29,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(30,'Mysore','Cloudy',12.310000,76.650000,14.40,'WSW',10.00,23.90,1004.00,0.00,86,75,5,13.30,1716552000),(31,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(32,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(33,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(34,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(35,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(36,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(37,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(38,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(39,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(40,'Mysore','Cloudy',12.310000,76.650000,14.40,'WSW',10.00,23.90,1004.00,0.00,86,75,5,13.30,1716552000),(41,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(42,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(43,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(44,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(45,'Vellore','Partly Cloudy',12.930000,79.130000,15.10,'SSW',10.00,33.50,999.00,0.00,50,52,8,10.80,1716552000),(46,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(47,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(48,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(49,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(50,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(51,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(52,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(53,'Mysore','Cloudy',12.310000,76.650000,14.40,'WSW',10.00,23.90,1004.00,0.00,86,75,5,13.30,1716552000),(54,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(55,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(56,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(57,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(58,'Vellore','Partly Cloudy',12.930000,79.130000,15.10,'SSW',10.00,33.50,999.00,0.00,50,52,8,10.80,1716552000),(59,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(60,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(61,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(62,'Chittoor','Patchy rain nearby',13.200000,79.120000,10.10,'SW',9.00,33.80,999.00,0.21,42,78,7,8.50,1716552000),(63,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(64,'Mysore','Cloudy',12.310000,76.650000,14.40,'WSW',10.00,23.90,1004.00,0.00,86,75,5,13.30,1716552000),(65,'Chikkamagaluru','Light rain shower',13.320000,75.780000,13.70,'WSW',10.00,22.80,1004.00,1.54,89,81,5,17.30,1716552000),(66,'Vellore','Partly Cloudy',12.930000,79.130000,15.10,'SSW',10.00,33.50,999.00,0.00,50,52,8,10.80,1716552000),(67,'Mangalore','Moderate or heavy rain with thunder',12.860000,74.840000,20.20,'NW',5.00,27.00,1002.00,0.57,89,75,6,22.60,1716553800),(68,'Bangalore','Partly cloudy',12.980000,77.580000,19.10,'W',6.00,23.00,1006.00,6.11,89,75,5,21.90,1716553800),(69,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(70,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(71,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(72,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(73,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(74,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(75,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(76,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(77,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(78,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(79,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(80,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(81,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(82,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(83,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(84,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(85,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(86,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(87,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(88,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(89,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(90,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(91,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(92,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(93,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(94,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(95,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(96,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(97,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(98,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(99,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(100,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(101,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(102,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(103,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(104,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(105,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(106,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(107,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(108,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(109,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(110,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(111,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(112,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(113,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(114,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(115,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(116,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(117,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(118,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(119,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(120,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(121,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(122,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(123,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(124,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(125,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(126,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(127,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(128,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(129,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(130,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(131,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(132,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(133,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(134,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(135,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(136,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(137,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(138,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(139,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(140,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(141,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(142,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(143,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(144,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(145,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(146,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(147,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(148,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(149,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(150,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(151,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(152,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(153,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(154,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(155,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(156,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(157,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(158,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(159,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(160,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(161,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(162,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(163,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(164,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(165,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(166,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(167,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(168,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(169,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(170,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(171,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(172,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(173,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(174,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(175,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(176,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(177,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(178,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(179,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(180,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(181,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(182,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(183,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(184,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(185,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(186,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(187,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(188,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(189,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(190,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(191,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(192,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(193,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(194,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(195,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(196,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(197,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(198,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(199,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(200,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(201,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(202,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(203,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(204,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(205,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(206,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(207,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(208,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(209,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(210,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(211,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(212,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(213,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(214,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(215,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(216,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(217,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(218,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(219,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(220,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(221,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(222,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(223,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(224,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(225,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(226,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(227,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(228,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(229,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(230,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(231,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(232,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(233,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(234,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(235,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(236,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(237,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(238,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(239,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(240,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(241,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(242,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(243,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(244,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(245,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(246,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(247,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(248,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(249,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(250,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(251,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700),(252,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(253,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(254,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(255,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(256,'Chittoor','Patchy rain nearby',13.200000,79.120000,19.40,'SE',10.00,33.90,999.00,0.05,42,78,7,18.00,1716554700),(257,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(258,'Mysore','Moderate rain',12.310000,76.650000,4.00,'SW',7.00,23.40,1004.00,5.63,88,99,5,3.80,1716554700),(259,'Chikkamagaluru','Moderate rain at times',13.320000,75.780000,15.80,'W',8.00,22.10,1005.00,2.70,90,71,5,14.80,1716554700),(260,'Vellore','Partly Cloudy',12.930000,79.130000,22.00,'SSE',10.00,32.90,999.00,0.00,54,31,8,16.50,1716554700);
/*!40000 ALTER TABLE `weather` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-24 19:13:06
