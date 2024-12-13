// src/config/environment.js

const environment = {
    production: {
      apiUrl: 'https://cafe-disease-detector.onrender.com',
      firebaseConfig: {
        apiKey: "AIzaSyAZN4PIvNEwMZQDZWjSVVFzn10rAsx80BE",
        authDomain: "ia-coffee.firebaseapp.com",
        projectId: "ia-coffee",
        storageBucket: "ia-coffee.appspot.com",
        messagingSenderId: "175392642189",
        appId: "1:175392642189:web:65b57bd5422386104d3ec4",
        measurementId: "G-G0B3TCWP5Y"
      }
    },
    development: {
      apiUrl: 'http://localhost:3001',
      firebaseConfig: {
        apiKey: "AIzaSyAZN4PIvNEwMZQDZWjSVVFzn10rAsx80BE",
        authDomain: "ia-coffee.firebaseapp.com",
        projectId: "ia-coffee",
        storageBucket: "ia-coffee.appspot.com",
        messagingSenderId: "175392642189",
        appId: "1:175392642189:web:65b57bd5422386104d3ec4",
        measurementId: "G-G0B3TCWP5Y"
      }
    }
  };
  
  // Determinar el ambiente basado en la URL actual
  const isProduction = window.location.hostname === 'ia-coffee.web.app' || 
                      window.location.hostname === 'ia-coffee.firebaseapp.com';
  
  // Exportar la configuración correspondiente
  export default environment[isProduction ? 'production' : 'development'];