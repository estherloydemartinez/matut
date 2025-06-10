// main.js - Punto de entrada principal para el JavaScript de la aplicación
console.log("main.js cargado.");

// Asumiendo que AppCore está disponible globalmente
// Si fuera un módulo ES6, sería:
// import AppCore from './core/AppCore.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log("main.js: DOM completamente cargado y parseado.");

    // Verificar que AppCore esté disponible
    if (typeof AppCore === 'undefined') {
        console.error("main.js: AppCore no está definido. Asegúrate de que el script AppCore.js se cargue antes que main.js y esté disponible globalmente.");
        // Mostrar un mensaje de error al usuario podría ser útil aquí
        const body = document.querySelector('body');
        if (body) {
            body.innerHTML = '<div style="color: red; text-align: center; padding: 20px;">Error Crítico: AppCore no pudo cargarse. La aplicación no puede iniciar.</div>';
        }
        return;
    }

    try {
        const app = new AppCore();
        app.init();
        console.log("main.js: AppCore inicializado.");
        // Para facilitar la depuración desde la consola:
        // window.bibliaApp = app;
    } catch (error) {
        console.error("main.js: Error al inicializar AppCore:", error);
        // Mostrar un mensaje de error más detallado al usuario
        const body = document.querySelector('body');
        if (body) {
            body.innerHTML = `<div style="color: red; text-align: center; padding: 20px;">Error Crítico al iniciar la aplicación: ${error.message}.<br>Consulte la consola para más detalles.</div>`;
        }
    }
});
