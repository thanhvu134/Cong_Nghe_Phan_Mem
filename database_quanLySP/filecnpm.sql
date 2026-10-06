-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: product_db
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `quantity` int DEFAULT '0',
  `image` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Laptop Dell XPS 13','Laptop cao cấp, màn hình 13 inch',25000000.00,10,'https://tse1.mm.bing.net/th/id/OIP.NKiu8lA6Asieci1OB4h3QwHaEK?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3','2025-10-02 12:43:45','2025-10-13 06:46:30'),(2,'iPhone 15 Pro','Smartphone Apple thế hệ mới nhất',29000000.00,15,'https://i.pinimg.com/1200x/df/3f/e9/df3fe9010959b683ff4e4e643ff360a0.jpg','2025-10-02 12:43:45','2025-10-13 06:48:13'),(3,'Samsung Galaxy S24','Flagship Android 2024',22000000.00,20,'https://i.pinimg.com/736x/84/aa/b3/84aab3007070bd79f41075e31cd43e7f.jpg','2025-10-02 12:43:45','2025-10-13 06:49:07'),(4,'MacBook Air M3','Laptop Apple với chip M3',32000000.00,8,'https://i.pinimg.com/736x/3c/03/a5/3c03a5e367e2335f058355443220e9c7.jpg','2025-10-02 12:43:45','2025-10-13 06:49:52'),(5,'iPad Pro 12.9','Máy tính bảng cao cấp',28000000.00,12,'https://i.pinimg.com/1200x/14/d2/b2/14d2b234d8d866066ace18d8c4a74cd6.jpg','2025-10-02 12:43:45','2025-10-13 06:50:28'),(6,'Điện thoại Honor 400 5G','Sản phẩm với công nghệ AI tích hợp',16000000.00,10,'https://tse4.mm.bing.net/th/id/OIP.EmOdgReabVbqQxbSGMvrVwHaF6?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3','2025-10-10 03:24:23','2025-10-13 06:47:14'),(7,'Tai nghe Razer','Sản phẩm với chất âm bass cực đãa',1690000.00,0,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e','2025-10-11 13:06:09','2025-10-13 07:40:32'),(8,'iPhone 17 Pro Max','Màu cam vũ trụ phiên bản giới hạn toàn cầu',63999000.00,15,'https://i.pinimg.com/736x/e0/42/49/e04249919a88ea1549d08a5ed54b1e4a.jpg','2025-10-13 07:39:47','2025-10-13 07:39:47'),(9,'Laptop Razer 16 Blade','Phiên bản mới với hiệu năng mạnh mẽ',34599000.00,12,'https://i.pinimg.com/736x/75/39/f0/7539f0341611daed001215dfede5109b.jpg','2025-10-13 07:53:29','2025-10-13 07:53:29');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `role` enum('user','admin') DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (7,'testuser','$2a$10$KmC8.TppWG/zjoowtgecVeUJ7lZ9t9hTEVZBPbBZPtw/Zodvm5fNm','test@test.com',NULL,'2025-10-02 15:46:19','user'),(8,'binh','$2a$10$J00EgLTs8gx8MlPyPFOw1eFUG5F2dhDUNfE4Zum.d7Tb.tK8/MKZS','binh@example.com',NULL,'2025-10-02 15:57:23','user'),(9,'binh1','$2a$10$wOL8JGYl6uzSjxZ024KGtesqhXVFpg4PCsRD1M0DqRFkk20Lu13Uq','binh1@example.com',NULL,'2025-10-02 16:00:25','user'),(13,'binh123','$2a$10$73pqgVCc5NRoWnAXPjNCNO2AnBvO.FBcuu9GpC3w1ouzW7UvIw/YC','binh@dau.vn',NULL,'2025-10-10 03:17:18','user'),(14,'testuser1','$2a$10$Fr7qyVUap16HtCcKieKFguKEsHO1hdFXG08YA.yekxiZ68raNBPMO','test@example.com',NULL,'2025-10-10 03:22:02','user'),(15,'admin','$2a$10$.bE2WMAeGrdNFKa3x1z.zO3KacemZzlFmEkrFz/zrexo5lejy7CbK','admin@example.com',NULL,'2025-10-10 03:22:02','admin'),(16,'giabinh','$2a$10$Wyb4EijkP2p6T6BfsnfnK.RRXfOZnraF1/nbOy/dYiWN9YNp71hK6','giabinh1@gmail.com',NULL,'2025-11-07 02:55:38','user'),(17,'giabinh1','$2a$10$iO5/.D8kKl/oNdOTaE9M9e80IRmNq6yLuTQrkbu0Ln7PIG5CkKBR2','giabinh2@gmail.com',NULL,'2025-11-07 03:16:22','user'),(18,'giabinh2','$2a$10$z2cqJzVhKuCKPZa1VhQ2f.Z1pnPPealWweBgcfNU1kIWIdvrzTOiS','giabinh3@gmail.com',NULL,'2025-11-07 06:15:02','user'),(19,'giabinh3','$2a$10$Wmwm6cIJtN5ZaHyiMYQoIuaz9OiC442GSGZVThT2NnxjTj4EXHXba','giabinh4@gmail.com',NULL,'2025-11-07 06:39:33','user'),(20,'giabinh4','$2a$10$FMv4j4P0TnmcX/EsS9jiguxtcEiNYVEm9g/1jDyKaYyMTA.IUQaKu','giabinh5@gmail.com',NULL,'2025-11-07 06:41:45','user'),(21,'binh321','$2a$10$PC4qlniYcNMHJ.2MOHndquwHYnnAj9EfxNc2gfsg80jtSOAl.GYXq','binh321@gmail.com',NULL,'2025-11-07 06:43:50','user'),(22,'giabinh03','$2a$10$8fxaE5OWtoFu4Wb1lEnZ0u7WKm2Uy42hTFfrDpi7ZukP0LPpljI5.','giabinh03@gmail.com',NULL,'2025-11-14 03:02:55','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'product_db'
--

--
-- Dumping routines for database 'product_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-19 12:09:30
