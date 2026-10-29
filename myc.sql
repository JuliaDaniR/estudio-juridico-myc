-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 29-10-2026 a las 12:51:35
-- Versión del servidor: 9.1.0
-- Versión de PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `myc`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

DROP TABLE IF EXISTS `clientes`;
CREATE TABLE IF NOT EXISTS `clientes` (
  `Id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `TipoPersona` tinyint NOT NULL COMMENT '1: Persona Física, 2: Persona Jurídica',
  `TipoDni` varchar(30) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Tipo y nro. documento o CUIT',
  `ApellidoRsocial` varchar(100) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Apellido o Razón Social',
  `Nombres` varchar(100) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Nombres o Titular/Representante Legal',
  `Domicilio` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `Telefono` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `Email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Localidad` varchar(80) COLLATE utf8mb4_general_ci NOT NULL,
  `Cpostal` varchar(10) COLLATE utf8mb4_general_ci NOT NULL,
  `Fnacimiento` date DEFAULT NULL,
  `Falta` date NOT NULL,
  `Fbaja` date DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`Id`, `TipoPersona`, `TipoDni`, `ApellidoRsocial`, `Nombres`, `Domicilio`, `Telefono`, `Email`, `Localidad`, `Cpostal`, `Fnacimiento`, `Falta`, `Fbaja`) VALUES
(1, 1, 'DNI 32.456.789', 'Méndez', 'Carlos Alberto', 'San Martín 1420 Piso 3', '341-5551234', 'carlos.mendez@gmail.com', 'Rosario', '2000', '1986-05-12', '2025-01-15', NULL),
(2, 2, 'CUIT 30-71234567-8', 'Logística Express S.R.L.', 'Mariano Rossi (Apoderado)', 'Av. Pellegrini 3200', '341-4449876', 'contacto@logisticaexpress.com', 'Rosario', '2000', NULL, '2025-02-10', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente_expediente`
--

DROP TABLE IF EXISTS `cliente_expediente`;
CREATE TABLE IF NOT EXISTS `cliente_expediente` (
  `idCliente` bigint UNSIGNED NOT NULL,
  `idExpediente` bigint UNSIGNED NOT NULL,
  `Demandante` enum('Demandante','Demandado') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Demandante',
  PRIMARY KEY (`idCliente`,`idExpediente`),
  KEY `fk_ce_expediente` (`idExpediente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `cliente_expediente`
--

INSERT INTO `cliente_expediente` (`idCliente`, `idExpediente`, `Demandante`) VALUES
(1, 1, 'Demandante'),
(2, 2, 'Demandado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `documentos`
--

DROP TABLE IF EXISTS `documentos`;
CREATE TABLE IF NOT EXISTS `documentos` (
  `Id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `idExpediente` bigint UNSIGNED NOT NULL,
  `Nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Categoria` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Demanda, Contrato, Poder, Cédula, Prueba, Sentencia',
  `Tamano` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '1.0 MB',
  `Fecha` date NOT NULL,
  `Autor` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `Resumen` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `TipoMime` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'application/pdf',
  `ArchivoContenido` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT 'Base64 data URL del archivo adjunto',
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id`),
  KEY `fk_doc_expediente` (`idExpediente`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `documentos`
--

INSERT INTO `documentos` (`Id`, `idExpediente`, `Nombre`, `Categoria`, `Tamano`, `Fecha`, `Autor`, `Resumen`, `TipoMime`, `ArchivoContenido`, `CreatedAt`, `Activo`) VALUES
(1, 1, 'Demanda_Ejecutiva_Alquileres.pdf', 'Demanda', '1.4 MB', '2026-03-15', 'Dra. María Belén Méndez', 'Escrito inicial de demanda por cobro ejecutivo de alquileres adeudados contra López Distribuidora SRL con copia de intimación previa.', 'application/pdf', 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/OgCjEgMCBvYmoKPDwvVHlwZSAvQ2F0YWxvZwovT3V0bGluZXMgMiAwIFIKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUgL091dGxpbmVzCi9Db3VudCAwCj4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2VzCi9LaWRzIFs0IDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA1IDAgUgovUmVzb3VyY2VzIDw8L1Byb2NTZXQgNiAwIFIKL0ZvbnQgPDwvRjEgNyAwIFI+Pj4+Pj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDczPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgoxMDAgNzAwIFRkCihFU1RVRElPIEpVUklESUNPIE0mQyAtIERPQ1VNRU5UTyBPRklDQUwpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNiAwIG9iagpbL1BERiAvVGV4dF0KZW5kb2JqCjcgMCBvYmoKPDwvVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL05hbWUgL0YxCi9CYXNlRm9udCAvSGVsdmV0aWNhCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iagp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTcgMDAwMDAgbiAKMDAwMDAwMDA4NSAwMDAwMCBuIAowMDAwMDAwMTIwIDAwMDAwIG4gCjAwMDAwMDAxNzkgMDAwMDAgbiAKMDAwMDAwMDMwMiAwMDAwMCBuIAowMDAwMDAwNDI2IDAwMDAwIG4gCjAwMDAwMDA0NTUgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA4Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo1NTkKJSVFT0YK', '2026-10-28 16:13:04', 1),
(2, 1, 'Contrato_Locacion_Certificado.pdf', 'Contrato', '2.8 MB', '2026-03-12', 'Estudio Jurídico M&C', 'Instrumento privado con firmas certificadas ante escribano público titular del Registro Notarial N° 45.', 'application/pdf', 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/OgCjEgMCBvYmoKPDwvVHlwZSAvQ2F0YWxvZwovT3V0bGluZXMgMiAwIFIKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUgL091dGxpbmVzCi9Db3VudCAwCj4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2VzCi9LaWRzIFs0IDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA1IDAgUgovUmVzb3VyY2VzIDw8L1Byb2NTZXQgNiAwIFIKL0ZvbnQgPDwvRjEgNyAwIFI+Pj4+Pj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDczPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgoxMDAgNzAwIFRkCihFU1RVRElPIEpVUklESUNPIE0mQyAtIERPQ1VNRU5UTyBPRklDQUwpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNiAwIG9iagpbL1BERiAvVGV4dF0KZW5kb2JqCjcgMCBvYmoKPDwvVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL05hbWUgL0YxCi9CYXNlRm9udCAvSGVsdmV0aWNhCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iagp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTcgMDAwMDAgbiAKMDAwMDAwMDA4NSAwMDAwMCBuIAowMDAwMDAwMTIwIDAwMDAwIG4gCjAwMDAwMDAxNzkgMDAwMDAgbiAKMDAwMDAwMDMwMiAwMDAwMCBuIAowMDAwMDAwNDI2IDAwMDAwIG4gCjAwMDAwMDA0NTUgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA4Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo1NTkKJSVFT0YK', '2026-10-28 16:13:04', 1),
(3, 2, 'Poder_Especial_Laboral_Mendez.pdf', 'Poder', '950 KB', '2026-06-10', 'Dra. María Belén Méndez', 'Poder especial para actuar en juicio laboral con facultades para conciliar ante el SECLO y tribunales de trabajo.', 'application/pdf', 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/OgCjEgMCBvYmoKPDwvVHlwZSAvQ2F0YWxvZwovT3V0bGluZXMgMiAwIFIKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUgL091dGxpbmVzCi9Db3VudCAwCj4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2VzCi9LaWRzIFs0IDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA1IDAgUgovUmVzb3VyY2VzIDw8L1Byb2NTZXQgNiAwIFIKL0ZvbnQgPDwvRjEgNyAwIFI+Pj4+Pj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDczPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgoxMDAgNzAwIFRkCihFU1RVRElPIEpVUklESUNPIE0mQyAtIERPQ1VNRU5UTyBPRklDQUwpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNiAwIG9iagpbL1BERiAvVGV4dF0KZW5kb2JqCjcgMCBvYmoKPDwvVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL05hbWUgL0YxCi9CYXNlRm9udCAvSGVsdmV0aWNhCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iagp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTcgMDAwMDAgbiAKMDAwMDAwMDA4NSAwMDAwMCBuIAowMDAwMDAwMTIwIDAwMDAwIG4gCjAwMDAwMDAxNzkgMDAwMDAgbiAKMDAwMDAwMDMwMiAwMDAwMCBuIAowMDAwMDAwNDI2IDAwMDAwIG4gCjAwMDAwMDA0NTUgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA4Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo1NTkKJSVFT0YK', '2026-10-28 16:13:04', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `expedientes`
--

DROP TABLE IF EXISTS `expedientes`;
CREATE TABLE IF NOT EXISTS `expedientes` (
  `Id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `TipoExpediente` enum('J','E') COLLATE utf8mb4_general_ci NOT NULL COMMENT 'J: Judicial, E: Extrajudicial',
  `NroExpediente` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `Juzgado` bigint UNSIGNED DEFAULT NULL COMMENT 'FK a Juzgado',
  `Caratura` text COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Descripción / Carátula del expediente',
  `FechaInicio` date NOT NULL,
  `TipoJuicio` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Acargode` varchar(100) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Abogado responsable',
  `FechaFin` date DEFAULT NULL,
  `Estado` enum('Activo','Resuelto favorable','Archivado') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Activo',
  `FechaBaja` date DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `fk_expediente_juzgado` (`Juzgado`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `expedientes`
--

INSERT INTO `expedientes` (`Id`, `TipoExpediente`, `NroExpediente`, `Juzgado`, `Caratura`, `FechaInicio`, `TipoJuicio`, `Acargode`, `FechaFin`, `Estado`, `FechaBaja`) VALUES
(1, 'J', 'EXP-2025-10482', 1, 'Méndez Carlos c/ Seguros El Sol s/ Daños y Perjuicios', '2025-03-01', 'Ordinario por Daños', 'Dra. María Belén Méndez', NULL, 'Activo', NULL),
(2, 'J', 'EXP-09473', 2, 'Por incumplimiento contractual', '2026-10-26', 'Daños y Perjuicios', 'Dra. María Belén Méndez', NULL, 'Activo', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `juzgado`
--

DROP TABLE IF EXISTS `juzgado`;
CREATE TABLE IF NOT EXISTS `juzgado` (
  `Id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `NroJuzgado` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `NombreJuzgado` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Jueztram` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Secretario` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Telefono` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `Activo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `juzgado`
--

INSERT INTO `juzgado` (`Id`, `NroJuzgado`, `NombreJuzgado`, `Jueztram`, `Secretario`, `Telefono`, `Activo`) VALUES
(1, 'N° 1', 'Juzgado Civil y Comercial N° 1', 'Dr. Roberto Gómez', 'Dra. Silvina Morales', '0341-4721200', 1),
(2, 'N° 3', 'Juzgado Laboral de 3ra Nominación', 'Dra. Patricia Martínez', 'Dr. Juan Calvo', '0341-4721350', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `Id` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
  `Email` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `Password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `Rol` varchar(30) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'abogado',
  `NombreCompleto` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `CreatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `Email` (`Email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`Id`, `Email`, `Password`, `Rol`, `NombreCompleto`, `CreatedAt`) VALUES
(1, 'admin@estudiomyc.com', '$2b$10$K6yp7oa9vQs6oIUkqpokouQflUOdXD9MxreqaDB50cnfsr5D1nbCa', 'abogado', 'Dra. María Belén Méndez', '2026-10-26 21:17:13');

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cliente_expediente`
--
ALTER TABLE `cliente_expediente`
  ADD CONSTRAINT `fk_ce_cliente` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`Id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ce_expediente` FOREIGN KEY (`idExpediente`) REFERENCES `expedientes` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `documentos`
--
ALTER TABLE `documentos`
  ADD CONSTRAINT `fk_doc_expediente` FOREIGN KEY (`idExpediente`) REFERENCES `expedientes` (`Id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `expedientes`
--
ALTER TABLE `expedientes`
  ADD CONSTRAINT `fk_expediente_juzgado` FOREIGN KEY (`Juzgado`) REFERENCES `juzgado` (`Id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
