import React, { useState } from 'react';
import './styles/UploadImage.css';
import { 
  Upload, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle, 
  Camera, 
  Loader2, 
  Leaf, 
  ChevronDown, 
  ChevronUp,
  X 
} from 'lucide-react';
import { auth } from './firebase';
import environment from './config/environment';

// Componente ImagePreview
const ImagePreview = ({ src, alt, className }) => {
  return (
    <div className="relative w-full">
      <div className="w-full aspect-square rounded-lg overflow-hidden bg-gray-100">
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain"
          style={{
            maxWidth: '225px',
            maxHeight: '225px',
            margin: '0 auto'
          }}
        />
      </div>
    </div>
  );
};

// Componente para mostrar el estado del análisis
const AnalysisStatus = ({ loading, currentStatus, uploadProgress, analysisProgress }) => {
  if (!loading) return null;

  const getStatusMessage = () => {
    switch (currentStatus) {
      case 'starting':
        return 'Preparando imagen...';
      case 'uploading':
        return `Subiendo imagen... ${uploadProgress}%`;
      case 'analyzing':
        return `Analizando imagen... ${analysisProgress}%
                \n(El servidor gratuito puede tardar hasta 2 minutos)`;
      case 'complete':
        return 'Análisis completado';
      case 'error':
        return 'Error en el proceso';
      default:
        return 'Procesando...';
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white py-2 px-4 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-600">
            {getStatusMessage()}
          </span>
          {(currentStatus === 'uploading' || currentStatus === 'analyzing') && (
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div 
                className="bg-blue-500 rounded-full h-1.5 transition-all duration-500"
                style={{ 
                  width: `${currentStatus === 'uploading' ? uploadProgress : analysisProgress}%` 
                }}
              />
            </div>
          )}
          {currentStatus === 'analyzing' && (
            <span className="text-xs text-gray-500 mt-1">
              Servidor gratuito de Render - puede tomar tiempo
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal de Resultados
const DiseaseInfo = ({ disease }) => {
  const [expanded, setExpanded] = useState(false);

  const getInfo = (diseaseName) => {
    switch(diseaseName) {
      case 'roya':
        return {
          title: '¡Enfermedad detectada!',
          content: `¡Puede reducir la producción de café hasta un 40%!

¿Cómo afecta el roya?

Imagina que las hojas del café son como los pulmones de la planta. La roya es como una neumonía que dificulta la respiración de la planta, debilitándola

¿Cómo combatir el roya?

Combatir la roya es como cuidar un jardín en casa: hay que mantener las plantas limpias, bien alimentadas y vigilarlas regularmente para detectar cualquier problema temprano.

Incidencia en los cultivos de café: 40-60%
Impacto en la producción: 20-40%
Reducción en la calidad del café: 15-25%`
        };
      case 'antracnosis':
        return {
          title: '¡Enfermedad detectada!',
          content: `¡Puede reducir la producción de café hasta un 25%!

¿Cómo afecta la antracnosis?

Imagina que los granos de café son como las frutas en un árbol. La antracnosis es como una plaga que pudre las frutas antes de que maduren, dejando al agricultor con menos cosecha y frutos de menor calidad.

¿Cómo combatir la antracnosis?

Combatir la antracnosis es como cuidar un huerto: hay que mantener las plantas sanas, protegerlas de la humedad excesiva y estar atento a los primeros signos de la enfermedad para actuar rápidamente.

Incidencia en los cultivos de café: 30-40%
Impacto en la producción total: 15-25%
Reducción en el puntaje de taza: 10-15%`
        };
      case 'ojo de gallo':
        return {
          title: '¡Enfermedad detectada!',
          content: `¡Puede reducir la producción de café hasta un 20%!

¿Cómo afecta el ojo de gallo?

Imagina que las hojas del café son como paneles solares para la planta. El ojo de gallo es como una sombra que cubre estos paneles, reduciendo la energía que la planta puede obtener del sol y debilitándola.

¿Cómo combatir el ojo de gallo?

Combatir el ojo de gallo es como mantener limpia una ventana: hay que asegurar que las hojas reciban suficiente luz, mantener el ambiente seco y eliminar las partes afectadas para evitar que se propague.

Incidencia en los cultivos de café: 25-35%
Impacto en la producción: 10-20%
Reducción en la calidad del café: 5-10%`
        };
      case 'minador':
        return {
          title: '¡Enfermedad detectada!',
          content: `¡Puede reducir la producción de café hasta un 12%!

¿Cómo afecta el minador de la hoja?

Imagina que las hojas del café son como las páginas de un libro. El minador es como una polilla que come estas páginas, dejando rastros y agujeros que dificultan la lectura (o en este caso, la capacidad de la planta para hacer fotosíntesis).

¿Cómo combatir el minador de la hoja?

Combatir el minador de la hoja es como proteger una biblioteca: hay que vigilar constantemente, introducir depredadores naturales que se coman a las polillas, y a veces, retirar los libros (hojas) más dañados para proteger al resto.

Infestación en las plantaciones: 20-30%
Reducción en la capacidad fotosintética: 15-25%
Impacto en la producción: 8-12%`
        };
      default:
        return {
          title: 'Información no disponible',
          content: 'No hay información detallada disponible para esta enfermedad.'
        };
    }
  };

  const info = getInfo(disease);
  const firstParagraph = info.content.split('\n\n')[0];
  
  return (
    <div className="bg-white rounded-lg mt-2">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 hover:bg-gray-50 transition-colors rounded-lg"
      >
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{info.title}</h3>
            <p className="text-sm text-gray-600">{firstParagraph}</p>
          </div>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </button>
      
      {expanded && (
        <div className="p-4 text-gray-600 whitespace-pre-line">
          {info.content.split('\n\n').slice(1).join('\n\n')}
        </div>
      )}
    </div>
  );
};

const ResultModal = ({ isOpen, onClose, result }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-40"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '20px'
      }}
    >
      <div 
        className="bg-white rounded-xl shadow-xl relative overflow-y-auto"
        style={{
          width: '65%',
          height: '65%',
          maxWidth: '800px',
          animation: 'fade-in-down 0.5s ease-in-out'
        }}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <Leaf className="w-12 h-12 mx-auto text-green-600 mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Resultados del Análisis</h2>
          </div>

          <div className="space-y-4">
            {/* Detecciones con acordeón */}
            <div className="space-y-2">
              {result.results.detections.map((detection, index) => (
                <div key={index} className="rounded-lg bg-white shadow-sm">
                  <div className="flex items-center space-x-2 p-4">
                    <span className="text-2xl">
                      {detection.disease === 'ojo de gallo' ? '🍂' : 
                       detection.disease === 'roya' ? '🌿' : 
                       detection.disease === 'minador' ? '🌱' : '🍃'}
                    </span>
                    <div>
                      <p className="font-semibold capitalize text-gray-800">
                        {detection.disease}
                      </p>
                      <p className="text-sm text-gray-600">
                        {detection.count} {detection.count === 1 ? 'instancia detectada' : 'instancias detectadas'}
                      </p>
                    </div>
                  </div>
                  <DiseaseInfo disease={detection.disease} />
                </div>
              ))}
            </div>

            {/* Imagen */}
            <div className="mt-6 text-center">
              <h4 className="text-sm font-medium text-gray-600 mb-2">
                Imagen Analizada
              </h4>
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    //src={`http://localhost:3001${result.imagePath}`}
                    src={`https://cafe-disease-detector.onrender.com${result.imagePath}`}
                    
                    alt="Analyzed"
                    className="rounded-lg shadow-lg"
                    style={{ 
                      maxWidth: '100%',
                      height: 'auto',
                      maxHeight: '200px',
                      objectFit: 'contain'
                    }}
                    key={result.imagePath}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 
                hover:from-green-600 hover:to-emerald-700 text-white rounded-lg 
                shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const UploadImage = ({ user }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const fetchWithRetry = async (url, options, maxRetries = 3) => {
    let lastError;
    
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, {
          ...options,
          credentials: 'include',
          mode: 'cors',
          headers: {
            ...options.headers,
            'Accept': 'application/json',
          }
        });
  
        if (!response.ok) {
          const errorBody = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }
  
        return response;
  
      } catch (error) {
        lastError = error;
        console.error(`Intento ${i + 1} fallido:`, error);
  
        if (i < maxRetries - 1) {
          const waitTime = Math.min(1000 * Math.pow(2, i), 10000);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
  
    throw lastError;
  };

  // Función mejorada para optimizar imágenes
const optimizeImage = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Error al leer el archivo'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Error al cargar la imagen'));
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;
    
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
    
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
  
          // Asegurarse de que el contexto se creó correctamente
          if (!ctx) {
            reject(new Error('No se pudo crear el contexto del canvas'));
            return;
          }

          // Dibujar fondo blanco
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          
          // Dibujar imagen
          ctx.drawImage(img, 0, 0, width, height);
          
          // Comprimir con calidad adaptativa
          let quality = 0.7;
          const maxSize = 4.5 * 1024 * 1024; // 4.5MB para dar margen
          
          const compressAndCheck = (q) => {
            canvas.toBlob((blob) => {
              if (!blob) {
                reject(new Error('Error al comprimir la imagen'));
                return;
              }

              if (blob.size > maxSize && q > 0.1) {
                quality = q - 0.1;
                compressAndCheck(quality);
              } else {
                const optimizedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(optimizedFile);
              }
            }, 'image/jpeg', q);
          };
  
          compressAndCheck(quality);
        } catch (err) {
          reject(new Error('Error al procesar la imagen'));
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};


  // Función para manejar la selección de archivos
const handleFileSelect = async (event) => {
  const file = event.target.files[0];
  if (file) {
    setLoading(true);
    try {
      const optimizedFile = await optimizeImage(file);
      setSelectedFile(optimizedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setLoading(false);
      };
      reader.readAsDataURL(optimizedFile);
      setResult(null);
      setError(null);

      // Mostrar información del tamaño en la consola
      console.log('Tamaño original:', (file.size / 1024 / 1024).toFixed(2) + 'MB');
      console.log('Tamaño optimizado:', (optimizedFile.size / 1024 / 1024).toFixed(2) + 'MB');
      
      // Mostrar advertencia si la imagen sigue siendo grande
      if (optimizedFile.size > 4 * 1024 * 1024) {
        setError('Advertencia: La imagen sigue siendo grande. Puede haber problemas al subirla.');
      }
    } catch (err) {
      setError('Error al procesar la imagen');
      setLoading(false);
    }
  }
};

/*
  const handleSubmit = async () => {
    if (!selectedFile) return;
    setLoading(true);
    setError(null);
  
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuario no autenticado');
      }
  
      const token = await currentUser.getIdToken();
      const formData = new FormData();
      formData.append('image', selectedFile);
  
      const response = await fetch('https://cafe-disease-detector.onrender.com/detect', {
      //const response = await fetch('http://localhost:3001/detect', {
      
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          
        },
        body: formData,
        mode: 'cors', // Asegurarse que estamos usando CORS
        credentials: 'include' // Incluir credenciales si es necesario
      });

      if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al procesar la imagen');
    }

      const data = await response.json();
  
      
  
      if (data.success) {
        setResult(data);
        setIsResultModalOpen(true);
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      // Mostrar mensaje específico si no es una hoja de café
      if (err.message.includes('hoja de café')) {
        setError('Por favor, asegúrese de subir una imagen de una hoja de café.');
      }
    } finally {
      setLoading(false);
    }
  };
*/

const handleSubmit = async () => {
  if (!selectedFile || loading) {
    return;
  }

  try {
    setLoading(true);
    setError(null);
    console.log('Intentando conexión al servidor...');

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('Usuario no autenticado');
    }

    const token = await currentUser.getIdToken();
    const formData = new FormData();
    formData.append('image', selectedFile);

    // URL del servidor
    const apiUrl = 'https://cafe-disease-detector.onrender.com/detect';
    console.log('Conectando a:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Removemos el header Content-Type para que el navegador lo establezca automáticamente con el boundary correcto
      },
      body: formData,
      mode: 'cors', // Aseguramos que estamos en modo CORS
      credentials: 'include', // Incluimos las credenciales
      cache: 'no-cache' // Evitamos problemas de caché
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Error respuesta servidor:', {
        status: response.status,
        statusText: response.statusText,
        body: errorBody
      });
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    console.log('Respuesta del servidor:', data);
    
    if (data.success) {
      setResult(data);
      setIsResultModalOpen(true);
    } else {
      throw new Error(data.error || 'Error en el procesamiento de la imagen');
    }

  } catch (err) {
    console.error('Error detallado:', err);
    
    let errorMessage = 'Error de conexión. Por favor, intente nuevamente';
    
    if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
      errorMessage = 'No se puede conectar al servidor. Por favor, verifique su conexión a internet y que el servidor esté activo.';
    } else if (err.message.includes('cors')) {
      errorMessage = 'Error de acceso al servidor. Por favor, contacte al administrador.';
    }
    
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};


// Componente de estado de carga actualizado
const LoadingStatus = () => (
  <div className="fixed top-4 right-4 bg-white py-2 px-4 rounded-full shadow-lg z-50">
    <div className="flex items-center space-x-2">
      <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-gray-600">
          {status === 'starting' && 'Preparando análisis...'}
          {status === 'uploading' && 'Subiendo imagen... (esto puede tardar)'}
          {status === 'processing' && (
            <span>
              Procesando imagen...
              <br />
              <span className="text-xs text-gray-500">
                El servidor gratuito puede tardar hasta 2 minutos
              </span>
            </span>
          )}
        </span>
        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className="bg-blue-500 rounded-full h-1.5 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

// Componente de mensaje de carga actualizado
const LoadingMessage = () => (
  <div className="absolute top-4 right-4 bg-white py-2 px-4 rounded-full shadow-lg flex items-center space-x-2">
    <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
    <span className="text-sm font-medium text-gray-600">
      {loading ? 'Optimizando imagen...' : 'Procesando... (puede tomar hasta 30 segundos en Render Free Tier)'}
    </span>
  </div>
);


  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setResult(null);
    setError(null);
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
  };
// Añade estos estados en tu componente UploadImage
const [uploadProgress, setUploadProgress] = useState(0);
const [analysisProgress, setAnalysisProgress] = useState(0);
const [currentStatus, setCurrentStatus] = useState('idle'); // idle, uploading, analyzing, complete, error
return (
  <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50/50 to-blue-50 p-4 md:p-8">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white mb-4 shadow-lg">
          <Leaf className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Detector de Enfermedades en Café</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Sistema avanzado de detección de enfermedades en plantas de café mediante inteligencia artificial
        </p>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Left Panel - Upload */}
          <div className="relative p-6 lg:p-8 bg-gradient-to-br from-gray-50 to-white border-b lg:border-b-0 lg:border-r border-gray-100">
            <div className="space-y-6">
              {/* Upload Area */}
              <div className="relative">
                <input
                  type="file"
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                />
                
                {!preview ? (
                  <label 
                    htmlFor="file-upload" 
                    className="block aspect-square rounded-2xl border-2 border-dashed border-gray-300 hover:border-green-500 transition-colors duration-300 cursor-pointer bg-gray-50 hover:bg-gray-50/80"
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <Camera className="w-16 h-16 text-gray-400" />
                      <p className="mt-4 text-sm text-gray-500 text-center">
                        <span className="font-medium text-green-600 hover:text-green-500">
                          Cargar imagen
                        </span>
                        {' '}o arrastrar y soltar
                      </p>
                      <p className="mt-2 text-xs text-gray-400">
                        PNG, JPG hasta 10MB
                      </p>
                    </div>
                  </label>
                ) : (
                  <div className="relative group">
                    <div className="aspect-square">
                      <ImagePreview
                        src={preview}
                        alt="Preview"
                        className="rounded-lg"
                      />
                    </div>
                    <label 
                      htmlFor="file-upload"
                      className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all duration-300 rounded-2xl"
                    >
                      <div className="text-white text-center">
                        <Upload className="w-8 h-8 mx-auto" />
                        <span className="mt-2 block">Cambiar imagen</span>
                      </div>
                    </label>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
              <button
  onClick={handleSubmit} // Simplificamos el onClick
  disabled={!selectedFile || loading}
  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
    !selectedFile || loading
      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500'
  }`}
>
  {loading ? (
    <div className="flex items-center justify-center">
      <Loader2 className="w-5 h-5 animate-spin mr-2" />
      <span>Procesando...</span>
    </div>
  ) : (
    <div className="flex items-center justify-center">
      <CheckCircle className="w-5 h-5 mr-2" />
      <span>Analizar Imagen</span>
    </div>
  )}
</button>
                
                {(preview || result) && (
                  <button
                    onClick={handleReset}
                    className="px-4 py-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
                  >
                    <RefreshCw className="w-5 h-5" />
                  </button>
                )}
              </div>

              {error && (
                <div className="rounded-xl p-4 bg-red-50 border border-red-100">
                  <div className="flex items-center text-red-800">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Results */}
          <div className="p-6 lg:p-8">
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Camera className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Carga una imagen para ver los resultados del análisis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-sm text-gray-500">
        Desarrollado con tecnología de detección avanzada para identificar enfermedades en plantas de café
      </div>
    </div>

    {/* Estado del Análisis */}
    <AnalysisStatus 
      loading={loading}
      currentStatus={currentStatus}
      uploadProgress={uploadProgress}
      analysisProgress={analysisProgress}
    />

    {/* Modal de Resultados */}
    <ResultModal 
      isOpen={isResultModalOpen && result && result.success}
      onClose={() => {
        setIsResultModalOpen(false);
        handleReset();
      }}
      result={result}
    />
  </div>
);
};



export default UploadImage;