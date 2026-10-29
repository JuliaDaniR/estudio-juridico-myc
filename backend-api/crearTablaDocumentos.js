import pool from './src/db.js';

async function migrarTablaDocumentos() {
  try {
    console.log('🔄 Verificando y creando tabla "documentos" en MySQL (MYC)...');

    const ddl = `
      CREATE TABLE IF NOT EXISTS \`documentos\` (
        \`Id\` bigint UNSIGNED NOT NULL AUTO_INCREMENT,
        \`idExpediente\` bigint UNSIGNED NOT NULL,
        \`Nombre\` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
        \`Categoria\` varchar(50) COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Demanda, Contrato, Poder, Cédula, Prueba, Sentencia',
        \`Tamano\` varchar(50) COLLATE utf8mb4_general_ci DEFAULT '1.0 MB',
        \`Fecha\` date NOT NULL,
        \`Autor\` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
        \`Resumen\` text COLLATE utf8mb4_general_ci DEFAULT NULL,
        \`TipoMime\` varchar(100) COLLATE utf8mb4_general_ci DEFAULT 'application/pdf',
        \`ArchivoContenido\` longtext COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Base64 data URL del archivo adjunto',
        \`CreatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (\`Id\`),
        KEY \`fk_doc_expediente\` (\`idExpediente\`),
        CONSTRAINT \`fk_doc_expediente\` FOREIGN KEY (\`idExpediente\`) REFERENCES \`expedientes\` (\`Id\`) ON DELETE CASCADE ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
    `;

    await pool.query(ddl);
    console.log('✅ Tabla "documentos" creada o ya existente.');

    // Verificar si ya hay documentos insertados
    const [rows] = await pool.query('SELECT COUNT(*) as total FROM documentos');
    if (rows[0].total === 0) {
      console.log('📥 Insertando documentos de prueba iniciales...');

      // PDF mínimo válido en Base64 para pruebas
      const samplePdfBase64 = 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/OgCjEgMCBvYmoKPDwvVHlwZSAvQ2F0YWxvZwovT3V0bGluZXMgMiAwIFIKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUgL091dGxpbmVzCi9Db3VudCAwCj4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2VzCi9LaWRzIFs0IDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA1IDAgUgovUmVzb3VyY2VzIDw8L1Byb2NTZXQgNiAwIFIKL0ZvbnQgPDwvRjEgNyAwIFI+Pj4+Pj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDczPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgoxMDAgNzAwIFRkCihFU1RVRElPIEpVUklESUNPIE0mQyAtIERPQ1VNRU5UTyBPRklDQUwpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNiAwIG9iagpbL1BERiAvVGV4dF0KZW5kb2JqCjcgMCBvYmoKPDwvVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL05hbWUgL0YxCi9CYXNlRm9udCAvSGVsdmV0aWNhCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iagp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTcgMDAwMDAgbiAKMDAwMDAwMDA4NSAwMDAwMCBuIAowMDAwMDAwMTIwIDAwMDAwIG4gCjAwMDAwMDAxNzkgMDAwMDAgbiAKMDAwMDAwMDMwMiAwMDAwMCBuIAowMDAwMDAwNDI2IDAwMDAwIG4gCjAwMDAwMDA0NTUgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA4Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo1NTkKJSVFT0YK';

      const docsIniciales = [
        [
          1,
          'Demanda_Ejecutiva_Alquileres.pdf',
          'Demanda',
          '1.4 MB',
          '2026-03-15',
          'Dra. María Belén Méndez',
          'Escrito inicial de demanda por cobro ejecutivo de alquileres adeudados contra López Distribuidora SRL con copia de intimación previa.',
          'application/pdf',
          samplePdfBase64
        ],
        [
          1,
          'Contrato_Locacion_Certificado.pdf',
          'Contrato',
          '2.8 MB',
          '2026-03-12',
          'Estudio Jurídico M&C',
          'Instrumento privado con firmas certificadas ante escribano público titular del Registro Notarial N° 45.',
          'application/pdf',
          samplePdfBase64
        ],
        [
          2,
          'Poder_Especial_Laboral_Mendez.pdf',
          'Poder',
          '950 KB',
          '2026-06-10',
          'Dra. María Belén Méndez',
          'Poder especial para actuar en juicio laboral con facultades para conciliar ante el SECLO y tribunales de trabajo.',
          'application/pdf',
          samplePdfBase64
        ]
      ];

      for (const doc of docsIniciales) {
        await pool.query(
          `INSERT INTO documentos (idExpediente, Nombre, Categoria, Tamano, Fecha, Autor, Resumen, TipoMime, ArchivoContenido) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          doc
        );
      }
      console.log('✅ Documentos de prueba insertados exitosamente.');
    } else {
      console.log(`ℹ️ La tabla ya contiene ${rows[0].total} documentos registrados.`);
    }

  } catch (error) {
    console.error('❌ Error al migrar tabla documentos:', error.message);
  } finally {
    process.exit(0);
  }
}

migrarTablaDocumentos();
