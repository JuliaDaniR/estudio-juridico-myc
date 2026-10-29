import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import api from '../../api/axios';
import { useToast } from '../../context/ToastContext';
import ModalConfirmacionBaja from '../common/ModalConfirmacionBaja';
import { 
  X, 
  FileText, 
  UploadCloud, 
  Download, 
  Trash2, 
  Eye, 
  FolderArchive, 
  Plus, 
  CheckCircle,
  FileCheck2,
  Calendar,
  ExternalLink,
  Loader2,
  RefreshCw
} from 'lucide-react';

// PDF mínimo en Base64 para simular documentos oficiales preexistentes
const SAMPLE_PDF_BASE64 = 'data:application/pdf;base64,JVBERi0xLjMKJcTl8uXrp/OgCjEgMCBvYmoKPDwvVHlwZSAvQ2F0YWxvZwovT3V0bGluZXMgMiAwIFIKL1BhZ2VzIDMgMCBSCj4+CmVuZG9iagoyIDAgb2JqCjw8L1R5cGUgL091dGxpbmVzCi9Db3VudCAwCj4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUgL1BhZ2VzCi9LaWRzIFs0IDAgUl0KL0NvdW50IDEKPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZSAvUGFnZQovUGFyZW50IDMgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA1IDAgUgovUmVzb3VyY2VzIDw8L1Byb2NTZXQgNiAwIFIKL0ZvbnQgPDwvRjEgNyAwIFI+Pj4+Pj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDczPj4Kc3RyZWFtCkJUCi9GMSAyNCBUZgoxMDAgNzAwIFRkCihFU1RVRElPIEpVUklESUNPIE0mQyAtIERPQ1VNRU5UTyBPRklDQUwpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNiAwIG9iagpbL1BERiAvVGV4dF0KZW5kb2JqCjcgMCBvYmoKPDwvVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL05hbWUgL0YxCi9CYXNlRm9udCAvSGVsdmV0aWNhCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iagp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMTcgMDAwMDAgbiAKMDAwMDAwMDA4NSAwMDAwMCBuIAowMDAwMDAwMTIwIDAwMDAwIG4gCjAwMDAwMDAxNzkgMDAwMDAgbiAKMDAwMDAwMDMwMiAwMDAwMCBuIAowMDAwMDAwNDI2IDAwMDAwIG4gCjAwMDAwMDA0NTUgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA4Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo1NTkKJSVFT0YK';

function ModalDocumentos({ expediente, onClose }) {
  const { mostrarToast } = useToast();
  const [documentos, setDocumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Estado para el diálogo de confirmación de baja
  const [docABorrar, setDocABorrar] = useState(null);

  // Estado para el formulario de nuevo documento
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombreDoc, setNombreDoc] = useState('');
  const [categoria, setCategoria] = useState('Demanda');
  const [resumen, setResumen] = useState('');
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [tamanoArchivo, setTamanoArchivo] = useState('1.2 MB');
  const [tipoMime, setTipoMime] = useState('application/pdf');
  const [archivoContenido, setArchivoContenido] = useState(null);
  const [guardando, setGuardando] = useState(false);

  // Estado para previsualización
  const [docPrevisualizado, setDocPrevisualizado] = useState(null);

  // 1. Cargar documentos desde la Base de Datos MySQL
  const cargarDocumentos = async () => {
    try {
      setCargando(true);
      setError('');
      const res = await api.get(`/documentos/expediente/${expediente.Id}`);
      if (Array.isArray(res.data)) {
        setDocumentos(res.data);
      }
    } catch (err) {
      console.warn('No se pudo conectar con la API de documentos, usando respaldo:', err.message);
      // Respaldo local si el backend no responde
      const respaldo = localStorage.getItem(`estudiomyc_docs_exp_${expediente.Id}`);
      if (respaldo) {
        setDocumentos(JSON.parse(respaldo));
      }
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDocumentos();
  }, [expediente.Id]);

  // 2. Manejar selección de archivo desde la computadora (PDF, Imagen, Doc)
  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setNombreArchivo(file.name);
    if (!nombreDoc) {
      setNombreDoc(file.name);
    }

    // Calcular tamaño formateado
    const sizeKb = file.size / 1024;
    const tamanoTexto = sizeKb > 1024 
      ? `${(sizeKb / 1024).toFixed(1)} MB` 
      : `${Math.round(sizeKb)} KB`;
    setTamanoArchivo(tamanoTexto);
    setTipoMime(file.type || 'application/pdf');

    // Leer el archivo como Data URL (Base64) para poder previsualizarlo y descargarlo real
    const reader = new FileReader();
    reader.onload = () => {
      setArchivoContenido(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // 3. Guardar documento en la tabla `documentos` de MySQL
  const handleAdjuntar = async (e) => {
    e.preventDefault();
    if (!nombreDoc.trim()) return;

    setGuardando(true);
    setError('');

    const extension = nombreArchivo ? nombreArchivo.split('.').pop() : 'pdf';
    const nombreFinal = nombreDoc.toLowerCase().endsWith(`.${extension}`) 
      ? nombreDoc.trim() 
      : `${nombreDoc.trim()}.${extension}`;

    const nuevoPayload = {
      Nombre: nombreFinal,
      Categoria: categoria,
      Tamano: tamanoArchivo,
      Fecha: new Date().toISOString().split('T')[0],
      Autor: expediente.Acargode || 'Dra. María Belén Méndez',
      Resumen: resumen.trim() || 'Documento oficial adjuntado al expediente judicial en trámite.',
      TipoMime: tipoMime,
      ArchivoContenido: archivoContenido || SAMPLE_PDF_BASE64
    };

    try {
      const res = await api.post(`/documentos/expediente/${expediente.Id}`, nuevoPayload);
      const guardado = res.data.documento || { ...nuevoPayload, Id: Date.now() };
      
      const nuevaLista = [guardado, ...documentos];
      setDocumentos(nuevaLista);
      localStorage.setItem(`estudiomyc_docs_exp_${expediente.Id}`, JSON.stringify(nuevaLista));

      // Limpiar formulario y abrir automáticamente la previsualización del documento recién guardado
      setNombreDoc('');
      setResumen('');
      setNombreArchivo('');
      setArchivoContenido(null);
      setMostrarFormulario(false);
      setDocPrevisualizado(guardado);
      mostrarToast('Documento adjuntado exitosamente al expediente.', 'success');
    } catch (err) {
      console.error('Error al guardar documento en BD:', err);
      // Guardado offline si la BD estuviera temporalmente inaccesible
      const guardadoOffline = { ...nuevoPayload, Id: Date.now() };
      const nuevaLista = [guardadoOffline, ...documentos];
      setDocumentos(nuevaLista);
      localStorage.setItem(`estudiomyc_docs_exp_${expediente.Id}`, JSON.stringify(nuevaLista));
      setMostrarFormulario(false);
      setDocPrevisualizado(guardadoOffline);
      mostrarToast('Documento guardado localmente.', 'info');
    } finally {
      setGuardando(false);
    }
  };

  // 4. Baja lógica del documento (Inactivación / Preserva trazabilidad)
  const confirmarBajaLogicaDoc = async () => {
    if (!docABorrar) return;
    const id = docABorrar.Id || docABorrar.id;
    try {
      await api.delete(`/documentos/${id}?tipo=soft`);
      mostrarToast('Documento dado de baja lógica (Inactivo). Se preserva el archivo para trazabilidad.', 'success');
    } catch (err) {
      console.warn('Error al dar de baja lógica:', err);
      mostrarToast('Documento inactivado localmente.', 'info');
    }
    const nuevaLista = documentos.map((d) => {
      if (d.Id === id || d.id === id) {
        return { ...d, Activo: 0, activo: 0 };
      }
      return d;
    });
    setDocumentos(nuevaLista);
    localStorage.setItem(`estudiomyc_docs_exp_${expediente.Id}`, JSON.stringify(nuevaLista));
    setDocABorrar(null);
  };

  // 5. Eliminación definitiva de MySQL
  const confirmarDefinitivoDoc = async () => {
    if (!docABorrar) return;
    const id = docABorrar.Id || docABorrar.id;
    try {
      await api.delete(`/documentos/${id}?tipo=definitivo`);
      mostrarToast('Documento eliminado definitivamente de la base de datos.', 'success');
    } catch (err) {
      console.warn('Error al eliminar definitivamente:', err);
      mostrarToast('Documento eliminado localmente.', 'info');
    }
    const nuevaLista = documentos.filter((d) => d.Id !== id && d.id !== id);
    setDocumentos(nuevaLista);
    localStorage.setItem(`estudiomyc_docs_exp_${expediente.Id}`, JSON.stringify(nuevaLista));

    if ((docPrevisualizado?.Id === id) || (docPrevisualizado?.id === id)) {
      setDocPrevisualizado(null);
    }
    setDocABorrar(null);
  };

  // 6. Reactivación del documento
  const reactivarDoc = async (doc) => {
    const id = doc.Id || doc.id;
    try {
      await api.patch(`/documentos/${id}/reactivar`);
      mostrarToast('Documento reactivado correctamente.', 'success');
    } catch (err) {
      console.warn('Error al reactivar documento:', err);
      mostrarToast('Documento reactivado localmente.', 'info');
    }
    const nuevaLista = documentos.map((d) => {
      if (d.Id === id || d.id === id) {
        return { ...d, Activo: 1, activo: 1 };
      }
      return d;
    });
    setDocumentos(nuevaLista);
    localStorage.setItem(`estudiomyc_docs_exp_${expediente.Id}`, JSON.stringify(nuevaLista));
    if (docABorrar) setDocABorrar(null);
  };

  // 5. Descargar archivo original (PDF, Imagen o Texto)
  const handleDescargar = (doc) => {
    const dataUrl = doc.ArchivoContenido || doc.archivoContenido;
    const nombre = doc.Nombre || doc.nombre;

    if (dataUrl && dataUrl.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = nombre;
      link.click();
    } else {
      // Descarga generada con membrete oficial del estudio
      const contenido = `==========================================================\nESTUDIO JURÍDICO M&C\nDra. María Belén Méndez\n==========================================================\n\nEXPEDIENTE: ${expediente.NroExpediente}\nCARÁTULA: ${expediente.Caratura}\nJUZGADO: ${expediente.NombreJuzgado || 'Trámite Extrajudicial'}\n\nDOCUMENTO: ${nombre}\nCATEGORÍA: ${doc.Categoria || doc.categoria}\nFECHA DE ALTA: ${doc.Fecha || doc.fecha}\nRESPONSABLE: ${doc.Autor || doc.autor}\n\nSÍNTESIS JURÍDICA / EXTRACTO:\n${doc.Resumen || doc.resumen}\n\n==========================================================\nCopia de archivo registrada electrónicamente en Sistema EstudioMYC.\n`;
      const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = nombre.endsWith('.txt') ? nombre : `${nombre}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  // 6. Abrir en pestaña nueva nativa del navegador
  const handleAbrirPestana = (doc) => {
    const dataUrl = doc.ArchivoContenido || doc.archivoContenido || SAMPLE_PDF_BASE64;
    const win = window.open();
    if (win) {
      if (dataUrl.startsWith('data:application/pdf')) {
        win.document.write(`<iframe src="${dataUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
        win.document.title = doc.Nombre || doc.nombre;
      } else {
        win.location.href = dataUrl;
      }
    }
  };

  const contenidoModal = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container glass-panel" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del Modal */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: 'rgba(212, 177, 106, 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--brand-accent-light)'
            }}>
              <FolderArchive size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)', fontWeight: 700 }}>
                  Documentación del Expediente
                </h3>
                <span className="badge badge-activo" style={{ fontSize: '0.74rem' }}>
                  {expediente.NroExpediente}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {expediente.Caratura}
              </p>
            </div>
          </div>

          <button 
            type="button" 
            className="btn-icon" 
            onClick={onClose}
            title="Cerrar ventana"
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'var(--text-muted)', 
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px'
            }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Barra de Acciones del Modal */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '1.25rem 0 1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            <strong>{documentos.length}</strong> {documentos.length === 1 ? 'documento registrado en Base de Datos' : 'documentos registrados en Base de Datos'}
          </p>

          <button
            type="button"
            className="button-primary"
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.84rem' }}
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
          >
            {mostrarFormulario ? (
              <>
                <X size={15} />
                <span>Cerrar Formulario</span>
              </>
            ) : (
              <>
                <Plus size={15} />
                <span>Adjuntar Documento desde PC</span>
              </>
            )}
          </button>
        </div>

        {/* Formulario para Adjuntar Nuevo Documento desde la PC */}
        {mostrarFormulario && (
          <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: 'rgba(16, 12, 18, 0.95)', border: '1px solid var(--brand-accent)' }}>
            <h4 style={{ fontSize: '1rem', color: 'var(--brand-accent-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UploadCloud size={18} />
              <span>Adjuntar Nuevo Escrito o Archivo PDF</span>
            </h4>
            
            <form onSubmit={handleAdjuntar}>
              {/* Campo para Cargar Archivo de la Computadora */}
              <div style={{
                border: '2px dashed rgba(212, 177, 106, 0.35)',
                borderRadius: '10px',
                padding: '1.25rem',
                textAlign: 'center',
                backgroundColor: 'rgba(37, 26, 43, 0.4)',
                marginBottom: '1rem',
                cursor: 'pointer'
              }}>
                <label style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="file" 
                    accept=".pdf,application/pdf,image/*,.doc,.docx"
                    style={{ display: 'none' }} 
                    onChange={handleFileChange} 
                  />
                  <UploadCloud size={30} color="var(--brand-accent)" />
                  <span style={{ fontSize: '0.92rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                    {nombreArchivo ? `Archivo seleccionado: ${nombreArchivo} (${tamanoArchivo})` : 'Hacé clic acá para seleccionar un archivo PDF o imagen de tu PC'}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Soporta archivos .PDF, imágenes y escritos judiciales. El documento se procesa en alta definición.
                  </span>
                </label>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Título o Carátula del Documento</label>
                  <input
                    type="text"
                    placeholder="Ej: Demanda_Inicial_Ejecutiva.pdf"
                    value={nombreDoc}
                    onChange={(e) => setNombreDoc(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Categoría Jurídica</label>
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
                    <option value="Demanda">Demanda / Contestación</option>
                    <option value="Contrato">Contrato / Instrumento Notarial</option>
                    <option value="Poder">Poder Especial / General</option>
                    <option value="Cédula">Cédula / Notificación Judicial</option>
                    <option value="Prueba">Prueba Documental / Peritaje</option>
                    <option value="Sentencia">Sentencia / Resolución Judicial</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '0.85rem' }}>
                <label>Resumen / Contenido del Escrito</label>
                <textarea
                  rows="2"
                  placeholder="Detalle o alcance jurídico del documento..."
                  value={resumen}
                  onChange={(e) => setResumen(e.target.value)}
                />
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={() => setMostrarFormulario(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="button-primary" 
                  disabled={guardando}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {guardando ? (
                    <>
                      <Loader2 size={16} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                      <span>Guardando en BD...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      <span>Guardar en Base de Datos</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            VISOR INTERACTIVO DE PREVISUALIZACIÓN REAL DE DOCUMENTOS Y PDFS
           ========================================================================= */}
        {docPrevisualizado && (
          <div className="card" style={{ marginBottom: '1.5rem', backgroundColor: 'rgba(25, 18, 29, 0.98)', border: '1px solid var(--brand-accent)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.75rem', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <FileCheck2 size={18} color="var(--brand-accent)" />
                <h5 style={{ color: 'var(--brand-accent-light)', fontSize: '1rem', margin: 0, fontWeight: 700 }}>
                  Visualizando: {docPrevisualizado.Nombre || docPrevisualizado.nombre}
                </h5>
                <span className="badge badge-activo" style={{ fontSize: '0.72rem' }}>
                  {docPrevisualizado.Categoria || docPrevisualizado.categoria}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => setDocPrevisualizado(null)} 
                title="Cerrar visor"
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Metadatos del documento */}
            <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
              <span><strong>Fecha:</strong> {docPrevisualizado.Fecha || docPrevisualizado.fecha}</span>
              <span>&bull;</span>
              <span><strong>Autor:</strong> {docPrevisualizado.Autor || docPrevisualizado.autor}</span>
              <span>&bull;</span>
              <span><strong>Tamaño:</strong> {docPrevisualizado.Tamano || docPrevisualizado.tamano || '1.0 MB'}</span>
            </div>

            {/* Renderizado de Previsualización: Si es PDF o Imagen real, se muestra incrustado en vivo */}
            {(docPrevisualizado.ArchivoContenido || docPrevisualizado.archivoContenido) ? (
              <div style={{ marginBottom: '1rem' }}>
                {((docPrevisualizado.TipoMime === 'application/pdf') || 
                  (docPrevisualizado.Nombre || docPrevisualizado.nombre || '').toLowerCase().endsWith('.pdf') ||
                  (docPrevisualizado.ArchivoContenido || '').startsWith('data:application/pdf')) ? (
                  <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                    <iframe
                      src={docPrevisualizado.ArchivoContenido || docPrevisualizado.archivoContenido}
                      title={docPrevisualizado.Nombre || docPrevisualizado.nombre}
                      width="100%"
                      height="460px"
                      style={{ border: 'none', display: 'block', backgroundColor: '#ffffff' }}
                    />
                  </div>
                ) : ((docPrevisualizado.TipoMime || '').startsWith('image/') || (docPrevisualizado.ArchivoContenido || '').startsWith('data:image/')) ? (
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: 'rgba(11, 8, 15, 0.8)', borderRadius: '8px' }}>
                    <img 
                      src={docPrevisualizado.ArchivoContenido || docPrevisualizado.archivoContenido} 
                      alt={docPrevisualizado.Nombre || docPrevisualizado.nombre}
                      style={{ maxWidth: '100%', maxHeight: '440px', objectFit: 'contain', borderRadius: '6px' }}
                    />
                  </div>
                ) : (
                  <div style={{ padding: '1rem', backgroundColor: 'rgba(11, 8, 15, 0.7)', borderRadius: '8px', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    <p style={{ fontStyle: 'italic' }}>
                      "{docPrevisualizado.Resumen || docPrevisualizado.resumen}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '1rem', backgroundColor: 'rgba(11, 8, 15, 0.7)', borderRadius: '8px', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                <p style={{ fontStyle: 'italic' }}>
                  "{docPrevisualizado.Resumen || docPrevisualizado.resumen}"
                </p>
              </div>
            )}

            {/* Barra de Acciones del Visor */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <button 
                type="button" 
                className="btn-secondary" 
                style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
                onClick={() => handleAbrirPestana(docPrevisualizado)}
              >
                <ExternalLink size={14} color="var(--brand-accent)" />
                <span>Abrir en Pestaña Completa</span>
              </button>

              <button 
                type="button" 
                className="button-primary" 
                style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
                onClick={() => handleDescargar(docPrevisualizado)}
              >
                <Download size={14} />
                <span>Descargar Archivo</span>
              </button>
            </div>
          </div>
        )}

        {/* Listado de Documentos */}
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <Loader2 size={24} style={{ animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem' }} />
            <p>Consultando documentos en la base de datos...</p>
          </div>
        ) : documentos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-muted)' }}>
            <FolderArchive size={42} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              No hay documentos o escritos adjuntos a este expediente todavía.
            </p>
            <p style={{ fontSize: '0.82rem', marginTop: '0.35rem' }}>
              Podés usar el botón "Adjuntar Documento desde PC" para subir tu primer PDF.
            </p>
          </div>
        ) : (
          <div className="documentos-lista" style={{ maxHeight: '340px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '4px' }}>
            {documentos.map((doc) => {
              const idDoc = doc.Id || doc.id;
              const nombre = doc.Nombre || doc.nombre;
              const categoriaDoc = doc.Categoria || doc.categoria;
              const fechaDoc = doc.Fecha || doc.fecha;
              const tamanoDoc = doc.Tamano || doc.tamano || '1.0 MB';
              const autorDoc = doc.Autor || doc.autor;

              const esInactivoDoc = (doc.Activo === 0 || doc.activo === 0);

              return (
                <div 
                  key={idDoc}
                  className="documento-item-card"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.85rem 1.15rem',
                    backgroundColor: 'rgba(25, 18, 29, 0.75)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '10px',
                    gap: '1rem',
                    opacity: esInactivoDoc ? 0.75 : 1
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: 0, flex: 1 }}>
                    <div style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(58, 43, 70, 0.55)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--brand-accent)',
                      flexShrink: 0
                    }}>
                      <FileText size={20} />
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                          {nombre}
                        </span>
                        <span className="badge" style={{
                          backgroundColor: categoriaDoc === 'Demanda' ? 'rgba(99, 102, 241, 0.18)' :
                            categoriaDoc === 'Contrato' ? 'rgba(212, 177, 106, 0.18)' :
                            categoriaDoc === 'Cédula' ? 'rgba(236, 72, 153, 0.18)' : 'rgba(20, 184, 166, 0.18)',
                          color: categoriaDoc === 'Demanda' ? '#a5b4fc' :
                            categoriaDoc === 'Contrato' ? '#E8D7A6' :
                            categoriaDoc === 'Cédula' ? '#f472b6' : '#5eead4',
                          fontSize: '0.7rem',
                          padding: '0.15rem 0.5rem'
                        }}>
                          {categoriaDoc}
                        </span>

                        {esInactivoDoc && (
                          <span className="badge badge-inactivo" title="Documento desafectado (baja lógica)">
                            Inactivo
                          </span>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Calendar size={12} />
                          {fechaDoc}
                        </span>
                        <span>&bull;</span>
                        <span>{tamanoDoc}</span>
                        <span>&bull;</span>
                        <span>{autorDoc}</span>
                      </div>
                    </div>
                  </div>

                  {/* Botones de acción del documento */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                    {esInactivoDoc && (
                      <button
                        type="button"
                        className="btn-icon"
                        title="Reactivar documento"
                        onClick={() => reactivarDoc(doc)}
                        style={{
                          background: 'rgba(124, 195, 155, 0.15)',
                          border: '1px solid rgba(124, 195, 155, 0.35)',
                          color: 'var(--status-success)',
                          borderRadius: '6px',
                          padding: '6px 9px',
                          cursor: 'pointer'
                        }}
                      >
                        <RefreshCw size={15} />
                      </button>
                    )}

                    <button
                      type="button"
                      className="btn-icon"
                      title="Previsualizar PDF / Documento en vivo"
                      onClick={() => setDocPrevisualizado(doc)}
                      style={{
                        background: 'rgba(212, 177, 106, 0.12)',
                        border: '1px solid rgba(212, 177, 106, 0.3)',
                        color: 'var(--brand-accent-light)',
                        borderRadius: '6px',
                        padding: '6px 10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        fontSize: '0.78rem'
                      }}
                    >
                      <Eye size={15} />
                      <span>Ver</span>
                    </button>

                    <button
                      type="button"
                      className="btn-icon"
                      title="Descargar archivo original"
                      onClick={() => handleDescargar(doc)}
                      style={{
                        background: 'rgba(58, 43, 70, 0.45)',
                        border: '1px solid var(--glass-border)',
                        color: 'var(--text-primary)',
                        borderRadius: '6px',
                        padding: '6px 9px',
                        cursor: 'pointer'
                      }}
                    >
                      <Download size={15} />
                    </button>

                    <button
                      type="button"
                      className="btn-icon"
                      title="Opciones de baja / eliminación"
                      onClick={() => setDocABorrar(doc)}
                      style={{
                        background: 'rgba(229, 115, 115, 0.12)',
                        border: '1px solid rgba(229, 115, 115, 0.3)',
                        color: 'var(--status-danger)',
                        borderRadius: '6px',
                        padding: '6px 9px',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pie del Modal */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
          <button type="button" className="btn-secondary" onClick={onClose}>
            <span>Cerrar</span>
          </button>
        </div>

        {/* Modal Confirmación de Baja / Reactivación para Documentos */}
        <ModalConfirmacionBaja
          abierto={Boolean(docABorrar)}
          onClose={() => setDocABorrar(null)}
          entidadNombre="Documento"
          titulo={docABorrar ? (docABorrar.Activo === 0 ? `Gestión de Documento Inactivo` : `Baja de Documento`) : ''}
          subtitulo={docABorrar ? `${docABorrar.Nombre || docABorrar.nombre}` : ''}
          esInactivo={docABorrar ? (docABorrar.Activo === 0 || docABorrar.activo === 0) : false}
          onConfirmarBajaLogica={confirmarBajaLogicaDoc}
          onConfirmarDefinitivo={confirmarDefinitivoDoc}
          onReactivar={() => docABorrar && reactivarDoc(docABorrar)}
        />
      </div>
    </div>
  );

  return createPortal(contenidoModal, document.body);
}

export default ModalDocumentos;
