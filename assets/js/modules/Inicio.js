// Inicio.js - Módulo para la sección de Inicio/Dashboard
console.log("Inicio.js cargado.");

class Inicio {
    constructor(appCore) {
        this.appCore = appCore;
        this.checkInTasks = [
            { id: "task_read_bible", label: "Lectura Bíblica (15 min)" },
            { id: "task_pray", label: "Oración (10 min)" },
            { id: "task_memorize_verse", label: "Memorizar Versículo" },
            { id: "task_reflect_journal", label: "Reflexión / Diario Espiritual (5 min)" }
        ];
        console.log("Módulo Inicio inicializado.");
    }

    renderContent(containerElement) {
        if (!containerElement) {
            console.error("Inicio.renderContent: Contenedor no provisto.");
            return;
        }
        containerElement.innerHTML = ''; // Limpiar

        const inicioHTML = `
            <div class="inicio-dashboard p-4">
                <h3 class="text-2xl font-semibold mb-6 text-center text-indigo-300">Inicio / Dashboard</h3>

                <div id="checkInContainer" class="mb-8 p-4 bg-gray-750 rounded-lg shadow">
                    <!-- Check-in diario se renderizará aquí -->
                </div>

                <div class="dashboard-personalizable p-4 bg-gray-750 rounded-lg shadow">
                    <h4 class="text-xl font-medium mb-3 text-gray-200">Dashboard Personalizable</h4>
                    <p class="text-gray-400">Esta área mostrará widgets y resúmenes personalizados (En desarrollo).</p>
                    <!-- Ejemplos de widgets que podrían ir aquí:
                         - Progreso de lectura actual
                         - Versículo del día
                         - Resumen de Sistema Agua
                         - Próximas revisiones de SRS (Memorización)
                    -->
                </div>
            </div>
        `;
        containerElement.innerHTML = inicioHTML;

        const checkInContainer = containerElement.querySelector('#checkInContainer');
        if (checkInContainer) {
            this.renderCheckIn(checkInContainer);
        }
        console.log("Inicio: Contenido renderizado.");
    }

    renderCheckIn(containerElement) {
        if (!containerElement) return;

        const today = new Date().toDateString();
        const lastCheckIn = this.appCore.stateManager.getState('user.dailyCheckIn.lastCheckInDate');
        const streak = this.appCore.stateManager.getState('user.dailyCheckIn.streak', 0);
        const completedTasksToday = this.appCore.stateManager.getState('user.dailyCheckIn.completedTasksToday', []);
        const alreadyCheckedInToday = lastCheckIn === today;

        let tasksHTML = '';
        this.checkInTasks.forEach(task => {
            const isCompleted = completedTasksToday.includes(task.id);
            tasksHTML += `
                <li class="flex items-center mb-2">
                    <input type="checkbox" id="${task.id}" name="${task.id}" class="form-checkbox h-5 w-5 text-indigo-500 bg-gray-600 border-gray-500 rounded focus:ring-indigo-400"
                           ${alreadyCheckedInToday || isCompleted ? 'checked disabled' : ''} ${alreadyCheckedInToday && !isCompleted ? 'disabled': ''}>
                    <label for="${task.id}" class="ml-2 text-sm ${alreadyCheckedInToday || isCompleted ? 'text-gray-500 line-through' : 'text-gray-300'}">${task.label}</label>
                </li>
            `;
        });

        const checkInHTML = `
            <h4 class="text-lg font-semibold mb-3 text-gray-200">Check-in Diario <span class="text-sm text-yellow-400">(Racha: ${streak} 🔥)</span></h4>
            ${alreadyCheckedInToday ? `<p class="text-green-400 mb-3 text-sm">¡Check-in completado por hoy! Vuelve mañana.</p>` : ''}
            <ul class="mb-3">${tasksHTML}</ul>
            <button id="btnCompletarCheckIn" class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded ${alreadyCheckedInToday ? 'opacity-50 cursor-not-allowed' : ''}"
                    ${alreadyCheckedInToday ? 'disabled' : ''}>
                ${alreadyCheckedInToday ? 'Completado Hoy' : 'Completar Check-in'}
            </button>
        `;
        containerElement.innerHTML = checkInHTML;

        if (!alreadyCheckedInToday) {
            containerElement.querySelector('#btnCompletarCheckIn')?.addEventListener('click', () => this.handleCompleteCheckIn());
        }
    }

    handleCompleteCheckIn() {
        const today = new Date().toDateString();
        const lastCheckInDate = this.appCore.stateManager.getState('user.dailyCheckIn.lastCheckInDate');

        if (lastCheckInDate === today) {
            alert("Ya has completado el check-in de hoy.");
            return;
        }

        const selectedTasks = [];
        this.checkInTasks.forEach(task => {
            const checkbox = document.getElementById(task.id);
            if (checkbox && checkbox.checked) {
                selectedTasks.push(task.id);
            }
        });

        if (selectedTasks.length === 0) {
            alert("Por favor, completa al menos una tarea para el check-in.");
            return;
        }

        // Simular ganancia de XP
        this.appCore.addXP('checkin_diario', { count: selectedTasks.length, tasks: selectedTasks });

        // Actualizar estado de check-in
        const currentStreak = this.appCore.stateManager.getState('user.dailyCheckIn.streak', 0);
        // Lógica simple de racha: si el último check-in fue ayer, incrementa. Sino, resetea a 1.
        // Para una lógica robusta se necesitaría comparar fechas exactas.
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const newStreak = (lastCheckInDate === yesterday.toDateString()) ? currentStreak + 1 : 1;

        this.appCore.stateManager.setState('user.dailyCheckIn', {
            lastCheckInDate: today,
            streak: newStreak,
            completedTasksToday: selectedTasks
        });

        alert(`¡Check-in completado! ${selectedTasks.length} tarea(s) registradas. Racha: ${newStreak}.`);

        // Re-renderizar la sección de check-in
        const checkInContainer = document.getElementById('checkInContainer'); // Asume que este ID existe
        if (checkInContainer) {
            this.renderCheckIn(checkInContainer);
        }
    }

    handleSocialCombinadoClick() {
        console.log("Inicio: Botón Social Combinado clickeado.");
        this.appCore.stateManager.setState('app.currentSection', 'social');
        // Podría llevar a un feed específico o una vista combinada en el futuro
        this.appCore.stateManager.setState('app.social.currentSubSection', 'feed');
    }

    getDashboardSummary() { // Método de ejemplo, no usado por UIManager directamente
        return "<h2>Panel Principal</h2><p>Resumen del día, versículo destacado, etc. (de Inicio.js)</p>";
    }
}

// window.Inicio = Inicio;
