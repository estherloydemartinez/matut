// Practica.js - Módulo para la sección de Práctica
console.log("Practica.js cargado.");

class Practica {
    constructor(appCore) {
        this.appCore = appCore;
        this.peticionesOracion = [
            { id: 1, texto: "Salud para la familia", fecha: new Date().toLocaleDateString() },
            { id: 2, texto: "Guianza en el trabajo", fecha: new Date().toLocaleDateString() }
        ];
        this.accionesRegistradas = [
            { id: 1, descripcion: "Ayudar al vecino con la mudanza", fecha: "2024-03-10", reflexion: "Sentí gozo al servir." },
            { id: 2, descripcion: "Llamar a un amigo necesitado", fecha: "2024-03-12", reflexion: "Fue una conversación edificante." }
        ];
        this.peticionIdCounter = this.peticionesOracion.length;
        this.accionIdCounter = this.accionesRegistradas.length;

        console.log("Módulo Practica inicializado.");
    }

    renderOrar(containerElement) {
        if (!containerElement) {
            console.error("Practica.renderOrar: Contenedor no provisto.");
            return;
        }
        containerElement.innerHTML = ''; // Limpiar

        let peticionesHTML = '';
        this.peticionesOracion.forEach(p => {
            peticionesHTML += `<li class="p-2 mb-1 bg-gray-650 rounded text-sm flex justify-between items-center"><span>${p.texto} <em class="text-xs text-gray-400">(${p.fecha})</em></span> <button class="text-red-400 hover:text-red-600 text-xs" data-peticionid="${p.id}">X</button></li>`;
        });

        const orarHTML = `
            <div class="practica-orar p-4 space-y-6">
                <h3 class="text-xl font-semibold text-center text-emerald-300">Recibir / Orar</h3>

                <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <button class="btn-orar-tipo bg-sky-600 hover:bg-sky-700 p-3 rounded text-white">Adoración</button>
                    <button class="btn-orar-tipo bg-orange-600 hover:bg-orange-700 p-3 rounded text-white">Confesión</button>
                    <button class="btn-orar-tipo bg-yellow-500 hover:bg-yellow-600 p-3 rounded text-white">Gratitud</button>
                    <button class="btn-orar-tipo bg-teal-600 hover:bg-teal-700 p-3 rounded text-white">Petición</button>
                </div>

                <div>
                    <h4 class="text-lg font-medium mb-2 text-gray-300">Diario de Oración</h4>
                    <textarea id="diarioOracionTexto" class="w-full h-24 p-2 bg-gray-700 text-white border border-gray-600 rounded" placeholder="Escribe tus reflexiones y oraciones..."></textarea>
                    <button id="btnGuardarDiario" class="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Guardar Diario</button>
                </div>

                <div>
                    <h4 class="text-lg font-medium mb-2 text-gray-300">Peticiones de Oración</h4>
                    <div class="flex space-x-2">
                        <input type="text" id="inputNuevaPeticion" class="flex-grow p-2 bg-gray-700 text-white border border-gray-600 rounded" placeholder="Nueva petición...">
                        <button id="btnAnadirPeticion" class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-3 rounded">Añadir</button>
                    </div>
                    <ul id="lista-peticiones" class="mt-3 space-y-1 max-h-48 overflow-y-auto">
                        ${peticionesHTML.length > 0 ? peticionesHTML : '<li class="text-gray-400 text-sm">No hay peticiones aún.</li>'}
                    </ul>
                </div>
            </div>
        `;
        containerElement.innerHTML = orarHTML;
        this.addOrarEventListeners(containerElement);
        console.log("Practica: Subsección 'Recibir / Orar' renderizada.");
    }

    addOrarEventListeners(container) {
        container.querySelector('#btnGuardarDiario')?.addEventListener('click', () => {
            const texto = container.querySelector('#diarioOracionTexto').value;
            console.log("Diario de Oración Guardado:", texto);
            alert("Diario guardado (simulado).");
        });

        container.querySelector('#btnAnadirPeticion')?.addEventListener('click', () => {
            const inputPeticion = container.querySelector('#inputNuevaPeticion');
            const textoPeticion = inputPeticion.value.trim();
            if (textoPeticion) {
                this.peticionIdCounter++;
                this.peticionesOracion.push({ id: this.peticionIdCounter, texto: textoPeticion, fecha: new Date().toLocaleDateString() });
                inputPeticion.value = '';
                this.renderOrar(container); // Re-render para actualizar la lista
            }
        });

        container.querySelectorAll('#lista-peticiones button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const peticionId = parseInt(e.target.dataset.peticionid);
                this.peticionesOracion = this.peticionesOracion.filter(p => p.id !== peticionId);
                this.renderOrar(container); // Re-render
            });
        });

        container.querySelectorAll('.btn-orar-tipo').forEach(btn => {
            btn.addEventListener('click', (e) => {
                console.log(`Tipo de Oración: ${e.target.textContent}`);
                alert(`Funcionalidad de "${e.target.textContent}" pendiente.`);
            });
        });
    }

    renderAccion(containerElement) {
        if (!containerElement) {
            console.error("Practica.renderAccion: Contenedor no provisto.");
            return;
        }
        containerElement.innerHTML = ''; // Limpiar

        let accionesHTML = '';
        this.accionesRegistradas.forEach(a => {
            accionesHTML += `
                <li class="p-3 mb-2 bg-gray-650 rounded">
                    <h5 class="font-semibold text-gray-200">${a.descripcion} <em class="text-xs text-gray-400">(${a.fecha})</em></h5>
                    <p class="text-sm text-gray-300 mt-1">${a.reflexion}</p>
                </li>`;
        });

        const accionHTML = `
            <div class="practica-accion p-4 space-y-6">
                <h3 class="text-xl font-semibold text-center text-lime-300">Dar / Accionar / Vivir / Aplicar</h3>

                <div>
                    <h4 class="text-lg font-medium mb-2 text-gray-300">Registrar Nueva Acción/Aplicación</h4>
                    <form id="formNuevaAccion" class="space-y-3">
                        <input type="text" id="inputAccionDesc" class="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded" placeholder="Descripción de la acción/aplicación" required>
                        <input type="date" id="inputAccionFecha" class="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded" required>
                        <textarea id="inputAccionReflexion" class="w-full h-20 p-2 bg-gray-700 text-white border border-gray-600 rounded" placeholder="Reflexión personal..."></textarea>
                        <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Guardar Acción</button>
                    </form>
                </div>

                <div>
                    <h4 class="text-lg font-medium mb-2 text-gray-300">Acciones Registradas</h4>
                    <ul id="lista-acciones-registradas" class="mt-3 space-y-2 max-h-60 overflow-y-auto">
                        ${accionesHTML.length > 0 ? accionesHTML : '<li class="text-gray-400 text-sm">No hay acciones registradas aún.</li>'}
                    </ul>
                </div>
            </div>
        `;
        containerElement.innerHTML = accionHTML;
        this.addAccionEventListeners(containerElement);
        console.log("Practica: Subsección 'Dar / Accionar' renderizada.");
    }

    addAccionEventListeners(container) {
        const form = container.querySelector('#formNuevaAccion');
        form?.addEventListener('submit', (event) => {
            event.preventDefault();
            const desc = container.querySelector('#inputAccionDesc').value.trim();
            const fecha = container.querySelector('#inputAccionFecha').value;
            const reflexion = container.querySelector('#inputAccionReflexion').value.trim();

            if (desc && fecha) {
                this.accionIdCounter++;
                this.accionesRegistradas.push({ id: this.accionIdCounter, descripcion: desc, fecha, reflexion });
                form.reset();
                this.renderAccion(container); // Re-render para actualizar lista
            } else {
                alert("Descripción y fecha son requeridas.");
            }
        });
    }

    loadContent() { // Método de ejemplo, no usado directamente por UIManager.renderSection
        return "<p>Contenido de la sección Práctica cargado por Practica.js</p>";
    }
}

// window.Practica = Practica;
