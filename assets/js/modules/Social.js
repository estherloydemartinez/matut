// Social.js - Módulo para funcionalidades sociales
console.log("Social.js cargado.");

class Social {
    constructor(appCore) {
        this.appCore = appCore;
        this.communities = [
            { id: "com1", name: "Estudiantes de Doctrina", description: "Un grupo para discutir y profundizar en las doctrinas bíblicas.", members: 120, image: "assets/images/community_doctrina.png" },
            { id: "com2", name: "Guerreros de Oración", description: "Comunidad dedicada a la intercesión y el poder de la oración.", members: 250, image: "assets/images/community_oracion.png" },
            { id: "com3", name: "Jóvenes con Propósito", description: "Espacio para jóvenes cristianos buscando vivir según el plan de Dios.", members: 180, image: "assets/images/community_jovenes.png" }
        ];
        this.competencies = {
            teoria: [
                { id: "compT1", name: "Conocimiento Doctrinal", description: "Entendimiento de las principales doctrinas.", level: 3, maxLevel: 5, image: "assets/images/comp_doctrina.png" },
                { id: "compT2", name: "Hermenéutica Bíblica", description: "Principios de interpretación de las Escrituras.", level: 2, maxLevel: 5, image: "assets/images/comp_hermeneutica.png" },
                { id: "compT3", name: "Historia de la Iglesia", description: "Conocimiento de los eventos clave en la historia cristiana.", level: 1, maxLevel: 5, image: "assets/images/comp_historia.png" }
            ],
            practica: [
                { id: "compP1", name: "Evangelismo Personal", description: "Compartir la fe efectivamente.", level: 4, maxLevel: 5, image: "assets/images/comp_evangelismo.png" },
                { id: "compP2", name: "Discipulado", description: "Acompañar a otros en su crecimiento espiritual.", level: 2, maxLevel: 5, image: "assets/images/comp_discipulado.png" },
                { id: "compP3", name: "Servicio Comunitario", description: "Participación activa en obras de servicio.", level: 3, maxLevel: 5, image: "assets/images/comp_servicio.png" }
            ]
        };
        console.log("Módulo Social inicializado con datos de ejemplo.");
    }

    renderComunidades(containerElement) {
        if (!containerElement) return;
        containerElement.innerHTML = '';
        let html = `<h3 class="text-xl font-semibold mb-4 text-center text-fuchsia-300">Comunidades Activas</h3>`;
        html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`;
        this.communities.forEach(com => {
            html += `
                <div class="comunidad-card bg-gray-700 p-4 rounded shadow hover:shadow-lg transition-shadow">
                    <img src="${com.image || 'assets/images/placeholder_community.png'}" alt="${com.name}" class="w-full h-32 object-cover rounded mb-2">
                    <h4 class="text-lg font-semibold text-gray-100">${com.name}</h4>
                    <p class="text-sm text-gray-300 mb-1 h-16 overflow-hidden">${com.description}</p>
                    <p class="text-xs text-gray-400 mb-2">Miembros: ${com.members}</p>
                    <button class="btn-unirse-comunidad w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-3 rounded text-sm" data-comid="${com.id}">Unirse</button>
                </div>
            `;
        });
        html += `</div>`;
        containerElement.innerHTML = html;
        containerElement.querySelectorAll('.btn-unirse-comunidad').forEach(btn => {
            btn.addEventListener('click', (e) => alert(`Unirse a comunidad ${e.target.dataset.comid} (pendiente).`));
        });
    }

    renderCompetencias(containerElement) {
        if (!containerElement) return;
        containerElement.innerHTML = '';
        let html = `<h3 class="text-xl font-semibold mb-4 text-center text-cyan-300">Competencias</h3>`;

        html += `<div class="mb-6">`;
        html += `<h4 class="text-lg font-semibold text-gray-200 mb-3">Teóricas</h4>`;
        html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`;
        this.competencies.teoria.forEach(comp => {
            html += `
                <div class="competencia-card bg-gray-700 p-3 rounded shadow hover:shadow-lg transition-shadow">
                     <img src="${comp.image || 'assets/images/placeholder_competency.png'}" alt="${comp.name}" class="w-16 h-16 object-cover rounded-full mb-2 mx-auto">
                    <h5 class="text-md font-semibold text-gray-100 text-center">${comp.name}</h5>
                    <p class="text-xs text-gray-400 text-center mb-1">Nivel: ${comp.level} / ${comp.maxLevel}</p>
                    <p class="text-sm text-gray-300 mb-2 text-center h-12 overflow-hidden">${comp.description}</p>
                    <button class="btn-mejorar-competencia w-full bg-cyan-500 hover:bg-cyan-600 text-white py-1 px-2 rounded text-xs" data-compid="${comp.id}">Comenzar/Mejorar</button>
                </div>
            `;
        });
        html += `</div></div>`;

        html += `<div>`;
        html += `<h4 class="text-lg font-semibold text-gray-200 mb-3">Prácticas</h4>`;
        html += `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">`;
        this.competencies.practica.forEach(comp => {
            html += `
                 <div class="competencia-card bg-gray-700 p-3 rounded shadow hover:shadow-lg transition-shadow">
                    <img src="${comp.image || 'assets/images/placeholder_competency.png'}" alt="${comp.name}" class="w-16 h-16 object-cover rounded-full mb-2 mx-auto">
                    <h5 class="text-md font-semibold text-gray-100 text-center">${comp.name}</h5>
                    <p class="text-xs text-gray-400 text-center mb-1">Nivel: ${comp.level} / ${comp.maxLevel}</p>
                    <p class="text-sm text-gray-300 mb-2 text-center h-12 overflow-hidden">${comp.description}</p>
                    <button class="btn-mejorar-competencia w-full bg-cyan-500 hover:bg-cyan-600 text-white py-1 px-2 rounded text-xs" data-compid="${comp.id}">Comenzar/Mejorar</button>
                </div>
            `;
        });
        html += `</div></div>`;
        containerElement.innerHTML = html;
        containerElement.querySelectorAll('.btn-mejorar-competencia').forEach(btn => {
            btn.addEventListener('click', (e) => alert(`Mejorar competencia ${e.target.dataset.compid} (pendiente).`));
        });
    }

    renderFeed(containerElement) {
        if (!containerElement) return;
        containerElement.innerHTML = `<h3 class="text-xl text-center p-5">Feed Social (En desarrollo)</h3><p class="text-center text-gray-400">Aquí verás actividad relevante de tus conexiones y comunidades.</p>`;
    }
    renderDesafios(containerElement) {
        if (!containerElement) return;
        containerElement.innerHTML = `<h3 class="text-xl text-center p-5">Desafíos (En desarrollo)</h3><p class="text-center text-gray-400">Participa en desafíos bíblicos y de crecimiento personal.</p>`;
    }
    renderConexiones(containerElement) {
        if (!containerElement) return;
        containerElement.innerHTML = `<h3 class="text-xl text-center p-5">Conexiones (En desarrollo)</h3><p class="text-center text-gray-400">Administra tus amigos y sigue a otros usuarios.</p>`;
    }

    getFriendsActivity() { // Método de ejemplo, no usado directamente por UIManager
        return "<p>Actividad de amigos (placeholder de Social.js)</p>";
    }
}

// window.Social = Social;
