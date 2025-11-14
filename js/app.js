// Tab switching logic
function showTab(tabName) {
    // Hide all main content sections
    document.getElementById('content-teoria').classList.add('hidden');
    document.getElementById('content-practica').classList.add('hidden');
    document.getElementById('content-inicio').classList.add('hidden'); // For sidebar nav
    document.getElementById('content-ajustes').classList.add('hidden'); // For sidebar nav

    // Deactivate all main tabs
    document.getElementById('tab-teoria').classList.remove('active');
    document.getElementById('tab-teoria').classList.remove('bg-[var(--color-primary)]', 'text-white');
    document.getElementById('tab-teoria').classList.add('bg-[var(--color-surface)]', 'text-[var(--color-text-secondary)]', 'border-b-2', 'border-[var(--color-border)]');


    document.getElementById('tab-practica').classList.remove('active');
    document.getElementById('tab-practica').classList.remove('bg-[var(--color-primary)]', 'text-white');
    document.getElementById('tab-practica').classList.add('bg-[var(--color-surface)]', 'text-[var(--color-text-secondary)]', 'border-b-2', 'border-[var(--color-border)]');

    // Activate the selected tab and show its content
    document.getElementById('content-' + tabName).classList.remove('hidden');
    const activeTabButton = document.getElementById('tab-' + tabName);
    activeTabButton.classList.add('active');
    activeTabButton.classList.add('bg-[var(--color-primary)]', 'text-white');
    activeTabButton.classList.remove('bg-[var(--color-surface)]', 'text-[var(--color-text-secondary)]', 'border-b-2', 'border-[var(--color-border)]');
}

function showTeoriaSubTab(subTabName) {
    document.getElementById('teoria-content-lectura').classList.add('hidden');
    document.getElementById('teoria-content-memorizacion').classList.add('hidden');

    // Reset styles for all teoria sub-tabs
    const teoriaSubTabs = ['lectura', 'memorizacion'];
    teoriaSubTabs.forEach(tabId => {
        const tabElement = document.getElementById('subtab-' + tabId);
        if (tabElement) {
            tabElement.classList.remove('text-[var(--color-primary)]', 'border-[var(--color-primary)]');
            tabElement.classList.add('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'border-transparent');
        }
    });

    // Activate the selected teoria sub-tab
    document.getElementById('teoria-content-' + subTabName).classList.remove('hidden');
    const activeSubTabElement = document.getElementById('subtab-' + subTabName);
    if (activeSubTabElement) {
        activeSubTabElement.classList.add('text-[var(--color-primary)]', 'border-[var(--color-primary)]');
        activeSubTabElement.classList.remove('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'border-transparent');
    }
}

function showPracticaSubTab(subTabName) {
    document.getElementById('practica-content-recibir').classList.add('hidden');
    document.getElementById('practica-content-dar').classList.add('hidden');

    // Reset styles for all practica sub-tabs
    const practicaSubTabs = ['recibir', 'dar'];
    practicaSubTabs.forEach(tabId => {
        const tabElement = document.getElementById('subtab-' + tabId);
        if (tabElement) {
            tabElement.classList.remove('text-[var(--color-primary)]', 'border-[var(--color-primary)]');
            tabElement.classList.add('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'border-transparent');
        }
    });

    // Activate the selected practica sub-tab
    document.getElementById('practica-content-' + subTabName).classList.remove('hidden');
    const activeSubTabElement = document.getElementById('subtab-' + subTabName);
    if (activeSubTabElement) {
        activeSubTabElement.classList.add('text-[var(--color-primary)]', 'border-[var(--color-primary)]');
        activeSubTabElement.classList.remove('text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300', 'border-transparent');
    }
}

function showLecturaMode(modeName) {
    document.getElementById('lectura-content-simple').classList.add('hidden');
    document.getElementById('lectura-content-profundo').classList.add('hidden');

    // Reset styles for lectura mode buttons
    const lecturaModeButtons = ['simple', 'profundo'];
    lecturaModeButtons.forEach(modeId => {
        const buttonElement = document.getElementById('lectura-mode-' + modeId);
        if (buttonElement) {
            buttonElement.classList.remove('bg-[var(--color-secondary)]', 'text-white');
            buttonElement.classList.add('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
        }
    });

    // Activate the selected lectura mode
    document.getElementById('lectura-content-' + modeName).classList.remove('hidden');
    const activeButtonElement = document.getElementById('lectura-mode-' + modeName);
    if (activeButtonElement) {
        activeButtonElement.classList.add('bg-[var(--color-secondary)]', 'text-white');
        activeButtonElement.classList.remove('bg-gray-200', 'text-gray-700', 'hover:bg-gray-300');
    }
}

// Sidebar toggle logic
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebar-overlay');
const sidebarToggleButton = document.getElementById('sidebar-toggle-button');

function toggleSidebar() {
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
        sidebarOverlay.classList.remove('hidden');
        // Delay adding opacity class to allow for transition
        setTimeout(() => sidebarOverlay.classList.add('opacity-100'), 10);
    } else {
        sidebarOverlay.classList.remove('opacity-100');
        // Delay adding hidden class to allow for transition
        setTimeout(() => sidebarOverlay.classList.add('hidden'), 300);
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Main Tabs
    document.getElementById('tab-teoria').addEventListener('click', () => showTab('teoria'));
    document.getElementById('tab-practica').addEventListener('click', () => showTab('practica'));

    // Teoría Sub-Tabs
    document.getElementById('subtab-lectura').addEventListener('click', () => showTeoriaSubTab('lectura'));
    document.getElementById('subtab-memorizacion').addEventListener('click', () => showTeoriaSubTab('memorizacion'));

    // Lectura Modes
    document.getElementById('lectura-mode-simple').addEventListener('click', () => showLecturaMode('simple'));
    document.getElementById('lectura-mode-profundo').addEventListener('click', () => showLecturaMode('profundo'));

    // Practica Sub-Tabs
    document.getElementById('subtab-recibir').addEventListener('click', () => showPracticaSubTab('recibir'));
    document.getElementById('subtab-dar').addEventListener('click', () => showPracticaSubTab('dar'));

    // Sidebar
    if (sidebarToggleButton) {
        sidebarToggleButton.addEventListener('click', toggleSidebar);
    }
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', toggleSidebar);
    }

    // Sidebar navigation
    const navInicio = document.getElementById('nav-inicio');
    if (navInicio) {
        navInicio.addEventListener('click', (e) => {
            e.preventDefault();
            showTab('inicio');
            toggleSidebar(); // Close sidebar after navigation
        });
    }
    const navAjustes = document.getElementById('nav-ajustes');
    if (navAjustes) {
        navAjustes.addEventListener('click', (e) => {
            e.preventDefault();
            showTab('ajustes');
            toggleSidebar(); // Close sidebar after navigation
        });
    }

    // Default states
    showTab('teoria');
    showTeoriaSubTab('lectura');
    showLecturaMode('simple');
    showPracticaSubTab('recibir');

    // Populate analytical tools categories
    populateAnalyticalCategories();

    // Bible Passage Selection
    populateBookSelector();

    const loadPassageButton = document.getElementById('load-passage-button');
    if (loadPassageButton) {
        loadPassageButton.addEventListener('click', handleLoadPassage);
    }

    // Memorization UI Event Listeners
    const fetchVerseBtn = document.getElementById('memorization-fetch-verse-btn');
    const startPracticeBtn = document.getElementById('memorization-start-btn');
    const revealBtn = document.getElementById('memorization-reveal-btn');

    if (fetchVerseBtn) {
        fetchVerseBtn.addEventListener('click', fetchVerseForMemorization);
    }
    if (startPracticeBtn) {
        startPracticeBtn.addEventListener('click', startMemorizationPractice);
    }
    if (revealBtn) {
        revealBtn.addEventListener('click', revealMemorizationText);
    }

    // Prayer Journal Event Listeners & Initial Load
    const savePrayerBtn = document.getElementById('save-prayer-entry-btn');
    if (savePrayerBtn) {
        savePrayerBtn.addEventListener('click', savePrayerEntry);
    }

    const prayerEntriesListDiv = document.getElementById('prayer-journal-entries-list');
    if (prayerEntriesListDiv) {
        prayerEntriesListDiv.addEventListener('click', function(event) {
            if (event.target.classList.contains('delete-prayer-entry-btn')) {
                const entryId = event.target.dataset.entryId;
                if (entryId) {
                    deletePrayerEntry(entryId);
                }
            }
        });
    }
    // Close modal if clicking outside the content area
    const competencyModal = document.getElementById('competency-detail-modal');
    if (competencyModal) {
        competencyModal.addEventListener('click', function(event) {
            if (event.target === competencyModal) { // Clicked on the overlay itself
                competencyModal.classList.add('hidden');
                competencyModal.classList.remove('flex');
            }
        });
    }
    loadPrayerEntries();

    // Práctica Competencies
    populatePracticaCompetencies();

    const closeCompetencyModalButton = document.getElementById('close-competency-modal-btn');
    if (closeCompetencyModalButton) {
        closeCompetencyModalButton.addEventListener('click', () => {
            const modal = document.getElementById('competency-detail-modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        });
    }
    // Close modal if clicking outside the content area
    const competencyModal = document.getElementById('competency-detail-modal');
    if (competencyModal) {
        competencyModal.addEventListener('click', function(event) {
            if (event.target === competencyModal) { // Clicked on the overlay itself
                competencyModal.classList.add('hidden');
                competencyModal.classList.remove('flex');
            }
        });
    }


});

const PRAYER_JOURNAL_STORAGE_KEY = 'bibliaApp_prayerJournalEntries';
const PRACTICA_COMPETENCY_STATUS_KEY = 'bibliaApp_practicaCompetencyStatus';
let originalMemorizationText = ""; // Store the original text for reveal

async function fetchVerseForMemorization() {
    const referenceInput = document.getElementById('memorization-verse-input');
    const textArea = document.getElementById('memorization-text-area');
    const fetchVerseBtn = document.getElementById('memorization-fetch-verse-btn');

    if (!referenceInput || !textArea || !fetchVerseBtn) return;

    const reference = referenceInput.value.trim();
    if (!reference) {
        alert("Por favor, ingrese una referencia bíblica.");
        return;
    }

    // Basic parser: "Book Chapter:Verse" or "Book Chapter:Start-End"
    // Example: "Génesis 1:1", "Juan 3:16-17", "1 Juan 1:9"
    // Improved regex to handle book names with spaces and numbers (e.g., "1 Juan")
    const parts = reference.match(/^(.+?)\s+(\d+):([\d]+)(-([\d]+))?$/);
    if (!parts) {
        alert("Formato de referencia no válido. Use 'Libro Capítulo:Versículo' o 'Libro Capítulo:VersículoInicial-VersículoFinal'. Ejemplo: Juan 3:16 o Génesis 1:1-3 o 1 Juan 1:9");
        return;
    }

    const bookName = parts[1].trim();
    const chapter = parts[2];
    const verseStart = parseInt(parts[3]);
    const verseEnd = parts[5] ? parseInt(parts[5]) : verseStart;

    if (isNaN(verseStart) || (parts[5] && isNaN(verseEnd)) || verseStart <= 0 || (verseEnd && verseEnd < verseStart) ) {
        alert("Número de versículo(s) inválido.");
        return;
    }

    let versesArray = [];
    for (let i = verseStart; i <= verseEnd; i++) {
        versesArray.push(i);
    }

    // Construct filename, simple replacement for now. A mapping would be more robust.
    const filename = bookName.replace(/\s+/g, ' ') + ".json";

    const originalButtonText = fetchVerseBtn.textContent;
    fetchVerseBtn.textContent = "Cargando...";
    fetchVerseBtn.disabled = true;
    textArea.value = ""; // Clear previous text

    try {
        // Path assumes index.html is at root, and js/ is a folder in root.
        // Bible data files are in 'bakend/biblia offline/'
        const response = await fetch(`bakend/biblia offline/${filename}`);
        if (!response.ok) {
             // Try to find the book in Books.json to give a better error if the filename was the issue
            try {
                const booksListResponse = await fetch('bakend/biblia offline/Books.json');
                const booksList = await booksListResponse.json();
                if (!booksList.includes(bookName)) { // Check if the parsed bookName is in the official list
                     throw new Error(`El libro '${bookName}' no se encuentra en la lista de libros disponibles. Verifique el nombre.`);
                }
            } catch (booksError) {
                // If Books.json fails or book not in list, throw original error or the new one.
                if (booksError.message.includes("no se encuentra")) throw booksError;
            }
            throw new Error(`No se pudo cargar el libro '${filename}' (Status: ${response.status}). Verifique el nombre del libro y que el archivo exista.`);
        }
        const bookData = await response.json();

        const chapterData = bookData.chapters.find(ch => ch.chapter === parseInt(chapter));
        let fetchedText = "";
        if (chapterData) {
            const versesToDisplay = chapterData.verses.filter(v => versesArray.includes(v.verse));
            if (versesToDisplay.length > 0) {
                fetchedText = versesToDisplay.map(v => v.text).join(" ");
            } else {
                throw new Error(`Versículo(s) ${versesArray.join('-')} no encontrados en ${bookName} ${chapter}.`);
            }
        } else {
            throw new Error(`Capítulo ${chapter} no encontrado en ${bookName}.`);
        }
        textArea.value = fetchedText;
        originalMemorizationText = fetchedText;
        document.getElementById('memorization-practice-area').innerHTML = '<p class="text-gray-400 text-base">Texto cargado. Presione "Iniciar Práctica".</p>';
    } catch (error) {
        alert(`Error al cargar el versículo: ${error.message}`);
        textArea.value = "";
        originalMemorizationText = "";
        document.getElementById('memorization-practice-area').innerHTML = '<p class="text-red-500 text-base">Error al cargar. Intente de nuevo.</p>';
    } finally {
        fetchVerseBtn.textContent = originalButtonText;
        fetchVerseBtn.disabled = false;
    }
}

function startMemorizationPractice() {
    const textArea = document.getElementById('memorization-text-area');
    const practiceArea = document.getElementById('memorization-practice-area');
    const difficultySelect = document.getElementById('memorization-difficulty');
    const revealBtn = document.getElementById('memorization-reveal-btn');

    if (!textArea || !practiceArea || !difficultySelect || !revealBtn) return;

    const text = textArea.value.trim();
    if (!text) {
        practiceArea.innerHTML = '<p class="text-gray-400 text-base">Por favor, ingrese o cargue texto para memorizar.</p>';
        return;
    }
    originalMemorizationText = text;

    const words = text.split(/\s+/);
    const difficulty = difficultySelect.value;
    let hideRatio = 0.25;
    if (difficulty === 'medium') hideRatio = 0.50;
    if (difficulty === 'hard') hideRatio = 0.75;

    // Ensure at least one word is visible if possible, unless text is very short
    let wordsToHideCount = Math.floor(words.length * hideRatio);
    if (words.length > 1 && wordsToHideCount === words.length) {
        wordsToHideCount = words.length -1;
    }


    let hiddenIndices = new Set();
    // Ensure we don't try to hide more words than available if text is very short
    const maxPossibleToHide = words.length > 0 ? words.length : 0;
    wordsToHideCount = Math.min(wordsToHideCount, maxPossibleToHide);


    while (hiddenIndices.size < wordsToHideCount) {
        hiddenIndices.add(Math.floor(Math.random() * words.length));
    }

    let practiceTextHtml = words.map((word, index) => {
        if (hiddenIndices.has(index)) {
            return `<span class="memorization-hidden-word bg-gray-300 hover:bg-gray-400 cursor-pointer p-1 rounded" data-original-word="${word.replace(/"/g, '&quot;')}">${'_'.repeat(Math.min(word.length, 15))}</span>`; // Limit underscore length
        } else {
            return `<span class="memorization-visible-word">${word}</span>`;
        }
    }).join(' ');

    practiceArea.innerHTML = practiceTextHtml;

    practiceArea.querySelectorAll('.memorization-hidden-word').forEach(span => {
        span.addEventListener('click', () => {
            span.textContent = span.dataset.originalWord;
            span.classList.remove('memorization-hidden-word', 'bg-gray-300', 'hover:bg-gray-400', 'cursor-pointer', 'p-1', 'rounded');
            span.classList.add('text-green-600', 'font-semibold');
        });
    });

    revealBtn.classList.remove('hidden');
}

function revealMemorizationText() {
    const practiceArea = document.getElementById('memorization-practice-area');
    if (!practiceArea || !originalMemorizationText) return;
    const words = originalMemorizationText.split(/\s+/);
    practiceArea.innerHTML = words.map(word => `<span class="memorization-revealed-word">${word}</span>`).join(' ');
    document.getElementById('memorization-reveal-btn').classList.add('hidden');
}

function getPrayerEntries() {
    const entriesJSON = localStorage.getItem(PRAYER_JOURNAL_STORAGE_KEY);
    return entriesJSON ? JSON.parse(entriesJSON) : [];
}

function saveEntriesToStorage(entries) {
    localStorage.setItem(PRAYER_JOURNAL_STORAGE_KEY, JSON.stringify(entries));
}

function loadPrayerEntries() {
    const entriesListDiv = document.getElementById('prayer-journal-entries-list');
    if (!entriesListDiv) return;

    const entries = getPrayerEntries();
    if (entries.length === 0) {
        entriesListDiv.innerHTML = '<p class="text-gray-500">No hay entradas guardadas todavía.</p>';
        return;
    }

    entriesListDiv.innerHTML = '';
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));

    entries.forEach(entry => {
        const entryDiv = document.createElement('div');
        entryDiv.className = 'bg-gray-50 p-3 rounded-md shadow-sm border border-gray-200';

        const dateString = new Date(entry.date).toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        entryDiv.innerHTML = `
            <p class="text-xs text-gray-500 mb-1">${dateString}</p>
            <p class="text-gray-700 whitespace-pre-wrap">${entry.text.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            <div class="text-right mt-2">
                <button data-entry-id="${entry.id}" class="delete-prayer-entry-btn text-xs text-red-500 hover:text-red-700">Eliminar</button>
            </div>
        `;
        entriesListDiv.appendChild(entryDiv);
    });
}

function savePrayerEntry() {
    const textArea = document.getElementById('prayer-journal-entry');
    if (!textArea) return;

    const entryText = textArea.value.trim();
    if (!entryText) {
        alert("La entrada de oración no puede estar vacía.");
        return;
    }

    const newEntry = {
        id: Date.now().toString(),
        text: entryText,
        date: new Date().toISOString()
    };

    const entries = getPrayerEntries();
    entries.push(newEntry);
    saveEntriesToStorage(entries);

    textArea.value = '';
    loadPrayerEntries();
}

function deletePrayerEntry(entryIdToDelete) {
    if (!confirm("¿Está seguro de que desea eliminar esta entrada?")) return;

    let entries = getPrayerEntries();
    entries = entries.filter(entry => entry.id !== entryIdToDelete);
    saveEntriesToStorage(entries);
    loadPrayerEntries();
}


function getCompetencyStatuses() {
    const statusesJSON = localStorage.getItem(PRACTICA_COMPETENCY_STATUS_KEY);
    return statusesJSON ? JSON.parse(statusesJSON) : {}; // { competencyId: "status", ... }
}

function updateCompetencyStatus(competencyId, newStatus) {
    const statuses = getCompetencyStatuses();
    statuses[competencyId] = newStatus;
    localStorage.setItem(PRACTICA_COMPETENCY_STATUS_KEY, JSON.stringify(statuses));

    // Refresh UI
    populatePracticaCompetencies(); // Re-render the list to show updated status

    // If modal is open and showing this competency, refresh its button
    const modal = document.getElementById('competency-detail-modal');
    const trackButton = document.getElementById('track-competency-progress-btn');
    if (modal && !modal.classList.contains('hidden') && trackButton && trackButton.dataset.competencyId === competencyId) {
        // Re-fetch details to update button, or just update button directly
        showPracticaCompetencyDetails(competencyId);
    }
}


function populatePracticaCompetencies() {
    if (!window.socialEngine || !window.socialEngine.competencies || !window.socialEngine.competencies.practica) {
        console.warn('Social Engine or practica competencies not ready for populate. Retrying in 1s...');
        setTimeout(populatePracticaCompetencies, 1000);
        return;
    }

    const competencies = window.socialEngine.competencies.practica;
    const listDiv = document.getElementById('practica-competencies-list');
    const statuses = getCompetencyStatuses();

    if (!listDiv) {
        console.error('practica-competencies-list element not found');
        return;
    }
    listDiv.innerHTML = '';

    if (!competencies || competencies.length === 0) {
        listDiv.innerHTML = '<p class="text-gray-500">No hay competencias prácticas disponibles.</p>';
        return;
    }

    competencies.forEach(comp => {
        const status = statuses[comp.id] || 'not_started';
        let statusBadge = '';
        if (status === 'in_progress') {
            statusBadge = `<span class="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 ml-2">En Progreso</span>`;
        } else if (status === 'completed') {
            statusBadge = `<span class="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800 ml-2">Completada</span>`;
        }

        const itemDiv = document.createElement('div');
        itemDiv.className = 'bg-white p-4 rounded-lg shadow border border-gray-200 cursor-pointer hover:border-purple-400 transition-all duration-150 ease-in-out';
        itemDiv.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h4 class="text-md font-semibold text-purple-700 mb-1">${comp.name || 'Competencia sin nombre'}</h4>
                    <p class="text-sm text-gray-600 line-clamp-2">${comp.description || 'Sin descripción.'}</p>
                </div>
                <div>${statusBadge}</div>
            </div>
            <div class="mt-2">
                <span class="text-xs px-2 py-1 rounded-full ${getCompetencyLevelClass(comp.level)}">${formatCompetencyLevel(comp.level)}</span>
            </div>
        `;
        itemDiv.addEventListener('click', () => showPracticaCompetencyDetails(comp.id));
        listDiv.appendChild(itemDiv);
    });
}


function getCompetencyLevelClass(level) {
    const levelClasses = {
        beginner: 'bg-green-100 text-green-700',
        intermediate: 'bg-yellow-100 text-yellow-700',
        advanced: 'bg-blue-100 text-blue-700',
        expert: 'bg-red-100 text-red-700'
    };
    return levelClasses[level ? level.toLowerCase() : ''] || 'bg-gray-100 text-gray-700';
}

function formatCompetencyLevel(level) {
    if (!level) return 'N/A';
    return level.charAt(0).toUpperCase() + level.slice(1);
}

function showPracticaCompetencyDetails(competencyId) {
    if (!window.socialEngine || !window.socialEngine.competencies || !window.socialEngine.competencies.practica) {
        console.error("Social engine not available for competency details.");
        alert("No se pueden cargar los detalles de la competencia en este momento.");
        return;
    }
    const competency = window.socialEngine.competencies.practica.find(c => c.id === competencyId);
    if (!competency) {
        alert("Detalles de la competencia no encontrados.");
        return;
    }

    const modalContentDiv = document.getElementById('competency-modal-content');
    const modal = document.getElementById('competency-detail-modal');
    const trackButton = document.getElementById('track-competency-progress-btn');

    if (!modalContentDiv || !modal || !trackButton) {
        console.error("Modal elements for competency details not found.");
        return;
    }

    trackButton.dataset.competencyId = competencyId;

    // Populate modal content (re-pasted and verified)
    let skillsHTML = competency.skills && competency.skills.length > 0 ?
        competency.skills.map(skill => `<span class="inline-block bg-gray-200 text-gray-700 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">${skill}</span>`).join(' ') :
        '<span class="text-xs text-gray-500">No especificadas</span>';

    let prereqHTML = '';
    if (competency.prerequisites && competency.prerequisites.length > 0) {
        prereqHTML = competency.prerequisites.map(prereqId => {
            let prereqName = prereqId;
            // Attempt to find the prerequisite name in any competency list
            const allCompetencies = [
                ...(window.socialEngine.competencies.teoria || []),
                ...(window.socialEngine.competencies.practica || [])
            ];
            const prereqComp = allCompetencies.find(p => p.id === prereqId);
            if (prereqComp) prereqName = prereqComp.name;
            return `<li class="text-sm text-gray-600">${prereqName}</li>`;
        }).join('');
        prereqHTML = `<h5 class="font-semibold mt-3 mb-1 text-gray-800">Prerequisitos:</h5><ul class="list-disc list-inside space-y-0.5">${prereqHTML}</ul>`;
    }

    modalContentDiv.innerHTML = `
        <h3 class="text-2xl font-bold text-purple-800 mb-3">${competency.name || 'Competencia sin Nombre'}</h3>
        <p class="text-sm text-gray-700 mb-3 leading-relaxed">${competency.description || 'Sin descripción detallada.'}</p>
        <div class="space-y-2 text-sm">
            <div><strong>Nivel:</strong> <span class="${getCompetencyLevelClass(competency.level)} px-2 py-0.5 rounded-full text-xs font-medium">${formatCompetencyLevel(competency.level)}</span></div>
            <div><strong>Categoría:</strong> <span class="text-gray-700">${competency.category || 'N/A'}</span></div>
            <div><strong>Horas Prácticas Requeridas:</strong> <span class="text-gray-700">${competency.requiredPracticeHours || 'N/A'} hrs</span></div>
            <div class="mt-1"><strong>Habilidades:</strong> <div class="flex flex-wrap gap-2 mt-1">${skillsHTML}</div></div>
            ${prereqHTML}
            <div class="mt-3"><strong>Verificación:</strong> <span class="text-gray-700">${competency.verification || 'N/A'}</span></div>
            <div><strong>Recompensa XP:</strong> <span class="text-gray-700">${competency.xpReward || 'N/A'}</span></div>
        </div>
    `;
    // --- End of re-pasted modal content HTML ---


    const statuses = getCompetencyStatuses();
    const currentStatus = statuses[competencyId] || 'not_started';

    trackButton.classList.remove('bg-green-500', 'hover:bg-green-600', 'bg-blue-500', 'hover:bg-blue-600', 'bg-gray-400', 'hover:bg-gray-500', 'cursor-not-allowed');
    trackButton.disabled = false;

    if (currentStatus === 'not_started') {
        trackButton.textContent = 'Comenzar Competencia';
        trackButton.classList.add('bg-green-500', 'hover:bg-green-600');
    } else if (currentStatus === 'in_progress') {
        trackButton.textContent = 'Marcar como Completada';
        trackButton.classList.add('bg-blue-500', 'hover:bg-blue-600');
    } else { // completed
        trackButton.textContent = 'Completada'; // Could add a (Reiniciar?) option here or a separate button
        trackButton.classList.add('bg-gray-400', 'hover:bg-gray-500', 'cursor-not-allowed');
        trackButton.disabled = true;
    }

    trackButton.onclick = () => {
        // Ensure we're using the competencyId from the button's dataset for safety,
        // though it should be the same as the one passed to showPracticaCompetencyDetails
        const competencyIdFromButton = trackButton.dataset.competencyId;
        const currentStatuses = getCompetencyStatuses();
        const statusOnClick = currentStatuses[competencyIdFromButton] || 'not_started';
        let newStatus = statusOnClick;

        if (statusOnClick === 'not_started') {
            newStatus = 'in_progress';
            alert(`Competencia '${competency.name}' marcada como 'En Progreso'.`);
        } else if (statusOnClick === 'in_progress') {
            if (confirm(`¿Marcar la competencia '${competency.name}' como completada?`)) {
                newStatus = 'completed';
                alert(`¡Felicidades! Competencia '${competency.name}' completada.`);
            } else {
                return;
            }
        }
        // Note: Resetting 'completed' status is not implemented here as per the plan.

        if (newStatus !== statusOnClick) {
            updateCompetencyStatus(competencyIdFromButton, newStatus);
        }
    };

    modal.classList.remove('hidden');
    modal.classList.add('flex');
}


async function populateBookSelector() {
    const bookSelect = document.getElementById('bible-book-select');
    if (!bookSelect) {
        console.warn("bible-book-select not found for population.");
        return;
    }

    try {
        // Path assumes index.html is at root, and js/ is a folder in root.
        // Bible data files (including Books.json) are in 'bakend/biblia offline/'
        const response = await fetch('bakend/biblia offline/Books.json');
        if (!response.ok) {
            throw new Error(`No se pudo cargar la lista de libros (status: ${response.status})`);
        }
        const bookNames = await response.json();

        bookSelect.innerHTML = ''; // Clear "Cargando libros..."
        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "-- Seleccione un Libro --";
        bookSelect.appendChild(defaultOption);

        bookNames.forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            bookSelect.appendChild(option);
        });
        // Set default selection for faster testing if needed, or leave to user
        // bookSelect.value = 'Génesis';
        // document.getElementById('bible-chapter-input').value = '1';
        // handleLoadPassage(); // Optionally auto-load a default passage
    } catch (error) {
        console.error('Error al popular libros:', error);
        bookSelect.innerHTML = '<option value="">Error al cargar libros</option>';
    }
}

function handleLoadPassage() {
    const bookSelect = document.getElementById('bible-book-select');
    const chapterInput = document.getElementById('bible-chapter-input');
    const versesInput = document.getElementById('bible-verses-input');

    const selectedBookName = bookSelect.value;
    const chapter = chapterInput.value;
    const versesString = versesInput.value.trim();

    if (!selectedBookName) {
        alert('Por favor, seleccione un libro.');
        return;
    }
    if (!chapter || parseInt(chapter) < 1) {
        alert('Por favor, ingrese un número de capítulo válido.');
        return;
    }

    const filename = selectedBookName + ".json";

    let parsedVersesArray = null;
    if (versesString) {
        parsedVersesArray = [];
        const parts = versesString.split(',');
        parts.forEach(part => {
            part = part.trim();
            if (part.includes('-')) {
                const range = part.split('-');
                const start = parseInt(range[0]);
                const end = parseInt(range[1]);
                if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start) {
                    for (let i = start; i <= end; i++) {
                        parsedVersesArray.push(i);
                    }
                } else {
                    console.warn(`Rango de versículos inválido: ${part}`);
                }
            } else {
                const verseNum = parseInt(part);
                if (!isNaN(verseNum) && verseNum > 0) {
                    parsedVersesArray.push(verseNum);
                } else {
                     console.warn(`Número de versículo inválido: ${part}`);
                }
            }
        });
        if(parsedVersesArray.length === 0 && versesString !== "") { // Non-empty input but nothing parsed
             alert('Formato de versículos inválido. Use números, comas o guiones (ej: 1-3 o 5,7).');
             return;
        }
        if(parsedVersesArray.length === 0 && versesString === "") { // Empty input string means load all
            parsedVersesArray = null;
        }

    }

    if (window.BibleDisplay && typeof window.BibleDisplay.loadPassage === 'function') {
        window.BibleDisplay.loadPassage(filename, selectedBookName, chapter, parsedVersesArray);
    } else {
        console.error('BibleDisplay.loadPassage no está disponible.');
        alert('Error: La funcionalidad de carga de la Biblia no está lista.');
    }
}

// Analytical Tools UI Population
// This function should be called after analyticalEngine is initialized
function populateAnalyticalCategories() {
    if (window.analyticalEngine && typeof window.analyticalEngine.getAllCategories === 'function') {
        const categories = window.analyticalEngine.getAllCategories();
        const categoriesListElement = document.getElementById('analytical-categories-list');

        if (categoriesListElement) {
            categoriesListElement.innerHTML = ''; // Clear "Cargando..."
            for (const categoryId in categories) {
                if (categories.hasOwnProperty(categoryId)) {
                    const category = categories[categoryId];
                    const listItem = document.createElement('li');
                    listItem.textContent = category.name;
                    listItem.className = 'p-2 hover:bg-purple-200 rounded-md cursor-pointer text-sm text-purple-800';
                    listItem.dataset.categoryId = categoryId;
                    // Add event listener to load tools for this category when clicked
                    listItem.addEventListener('click', () => {
                        // Placeholder for loading tools of the selected category
                        console.log('Category clicked:', categoryId);
                        // TODO: Implement function to display tools for this category
                        displayToolsForCategory(categoryId);
                    });
                    categoriesListElement.appendChild(listItem);
                }
            }
        } else {
            console.error('analytical-categories-list element not found');
        }
    } else {
        console.warn('Analytical Engine not ready or getAllCategories not found. Retrying in 1s...');
        setTimeout(populateAnalyticalCategories, 1000); // Retry if not loaded yet
    }
}

function displayToolsForCategory(categoryId) {
    if (!window.analyticalEngine) return;

    const tools = window.analyticalEngine.getToolsByCategory(categoryId);
    const toolContentArea = document.getElementById('analytical-tool-content');

    if (toolContentArea) {
        toolContentArea.innerHTML = `<h5 class="text-md font-semibold text-purple-700 mb-3">Herramientas para ${window.analyticalEngine.getAllCategories()[categoryId].name}</h5>`;
        const toolsList = document.createElement('ul');
        toolsList.className = 'space-y-1';

        if (tools && tools.length > 0) {
            tools.forEach(tool => {
                const toolItem = document.createElement('li');
                toolItem.textContent = tool.name;
                toolItem.className = 'p-2 hover:bg-gray-100 rounded-md cursor-pointer text-sm';
                toolItem.title = tool.description; // Tooltip with description
                toolItem.dataset.toolId = tool.id;
                toolItem.addEventListener('click', () => {
                    activateAnalyticalTool(tool.id, toolContentArea, tool.name); // Pass tool.name
                });
                toolsList.appendChild(toolItem);
            });
        } else {
            toolsList.innerHTML = '<li class="text-sm text-gray-500">No hay herramientas disponibles para esta categoría.</li>';
        }
        toolContentArea.appendChild(toolsList);
    }
}

function activateAnalyticalTool(toolId, container, toolName) {
    if (!window.analyticalEngine) {
        container.innerHTML = '<p class="text-red-500">Motor analítico no disponible.</p>';
        return;
    }

    let toolSpecificUI = '';
    if (toolId === 'concordance_analysis') {
        toolSpecificUI = `
            <div class="my-2">
                <label for="concordance-search-term" class="block text-sm font-medium text-gray-700">Término de Búsqueda:</label>
                <input type="text" id="concordance-search-term" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" placeholder="Ej: amor">
            </div>
        `;
    } else if (toolId === 'semantic_analysis') {
        const defaultSemanticFields = JSON.stringify([
            { "name": "Amor Divino", "keywords": ["amor", "misericordia", "gracia", "compasión", "amar", "amo", "bondad"] },
            { "name": "Juicio/Ira", "keywords": ["juicio", "castigo", "ira", "condenación", "venganza"] },
            { "name": "Fe/Creer", "keywords": ["fe", "creer", "confiar", "esperanza", "fiel"] },
            { "name": "Pecado/Maldad", "keywords": ["pecado", "maldad", "iniquidad", "rebelión", "transgresión"] }
        ], null, 2);

        toolSpecificUI = `
            <div class="my-2">
                <label for="semantic-fields-input" class="block text-sm font-medium text-gray-700">Campos Semánticos (JSON):</label>
                <textarea id="semantic-fields-input" rows="6" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm">${defaultSemanticFields}</textarea>
                <p class="text-xs text-gray-500 mt-1">Edite o use los campos predefinidos. Cada campo debe tener "name" (string) y "keywords" (array de strings).</p>
            </div>
        `;
    }


    // Clear previous tool UI from container, but keep the main title of the tool area if it exists
    const toolAreaTitle = container.querySelector('h5');
    container.innerHTML = ''; // Clear previous content
    if (toolAreaTitle) container.appendChild(toolAreaTitle); // Re-add title if it was there

    const toolDisplayDiv = document.createElement('div');
    toolDisplayDiv.innerHTML = `
        <h3 class="text-lg font-semibold text-purple-700 mb-2">${toolName}</h3>
        ${toolSpecificUI}
        <button id="run-analysis-btn-${toolId}" class="mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
            Ejecutar Análisis
        </button>
        <div id="results-${toolId}" class="analytical-results mt-4 text-sm p-2 border border-gray-200 rounded bg-gray-50 min-h-[50px]"></div>
    `;
    container.appendChild(toolDisplayDiv);

    const analysisButton = document.getElementById(`run-analysis-btn-${toolId}`);
    analysisButton.onclick = function() {
        const toolIdToRun = toolId;
        const resultsDiv = document.getElementById(`results-${toolIdToRun}`);
        if (!resultsDiv) return;
        resultsDiv.innerHTML = '<p class="text-blue-500">Procesando análisis...</p>';

        const passageText = window.BibleDisplay.getCurrentText ? window.BibleDisplay.getCurrentText() : "";
        if (!passageText) {
            resultsDiv.innerHTML = '<p class="text-red-500">No hay texto bíblico cargado o seleccionado en Modo Simple.</p>';
            return;
        }

        let analysisOptions = {};
        if (toolIdToRun === 'concordance_analysis') {
            const searchTermInput = document.getElementById('concordance-search-term');
            if (!searchTermInput || !searchTermInput.value.trim()) {
                resultsDiv.innerHTML = '<p class="text-red-500">Por favor, ingrese un término de búsqueda para la concordancia.</p>';
                return;
            }
            analysisOptions.searchTerm = searchTermInput.value.trim();
        } else if (toolIdToRun === 'semantic_analysis') {
            const fieldsInput = document.getElementById('semantic-fields-input');
            try {
                analysisOptions.semanticFields = JSON.parse(fieldsInput.value);
                if (!Array.isArray(analysisOptions.semanticFields) ||
                    !analysisOptions.semanticFields.every(f => f.name && typeof f.name === 'string' && Array.isArray(f.keywords) && f.keywords.every(k => typeof k === 'string'))) {
                    resultsDiv.innerHTML = '<p class="text-red-500">Error: El formato de los campos semánticos es incorrecto. Verifique la estructura JSON y que los keywords sean strings.</p>';
                    return;
                }
            } catch (e) {
                resultsDiv.innerHTML = '<p class="text-red-500">Error en el formato JSON de los campos semánticos: ' + e.message + '</p>';
                return;
            }
        }


        setTimeout(() => { // Simulate async for UI update
            try {
                const resultPromise = window.analyticalEngine.executeAnalysis(toolIdToRun, passageText, analysisOptions);
                Promise.resolve(resultPromise)
                    .then(analysisResult => {
                        displayFormattedResults(toolIdToRun, analysisResult, resultsDiv); // Pass toolIdToRun for context
                    })
                    .catch(error => {
                        console.error(`Error during analysis for ${toolIdToRun}:`, error);
                        resultsDiv.innerHTML = `<p class="text-red-500">Error en el análisis: ${error.message || 'Error desconocido'}.</p>`;
                    });
            } catch (error) {
                console.error(`Error executing analysis for ${toolIdToRun}:`, error);
                resultsDiv.innerHTML = `<p class="text-red-500">Error al ejecutar el análisis: ${error.message || 'Error desconocido'}.</p>`;
            }
        }, 100);
    };
}

function displayFormattedResults(toolId, result, container) {
    if (!result) {
        container.innerHTML = '<p class="text-red-500">No se recibieron resultados del análisis.</p>';
        return;
    }
    if (result.error) {
        container.innerHTML = `<p class="text-red-500">${result.error}</p>`;
        return;
    }

    let html = '';
    switch (result.type) {
        case 'frequency_analysis':
            html = `<h4 class="font-semibold text-gray-700 mb-1">Frecuencia de Palabras:</h4>`;
            if (result.topWords && result.topWords.length > 0) {
                html += `<p class="text-xs text-gray-500 mb-2">Total de palabras procesadas (filtradas): ${result.totalProcessedWords}, Palabras únicas (filtradas): ${result.uniqueWords}</p>`;
                html += '<ul class="list-disc pl-5 space-y-1 max-h-60 overflow-y-auto bg-gray-50 p-2 rounded">';
                result.topWords.forEach(item => {
                    html += `<li><span class="font-medium">${item.word}</span>: ${item.count}</li>`;
                });
                html += '</ul>';
            } else {
                html += '<p>No se encontraron palabras según los criterios.</p>';
            }
            break;
        case 'concordance_analysis':
            html = `<h4 class="font-semibold text-gray-700 mb-1">Concordancia para "${result.searchTerm}":</h4>`;
            if (result.results && result.results.length > 0) {
                 html += `<p class="text-xs text-gray-500 mb-2">Se encontraron ${result.occurrences} ocurrencias (mostrando hasta ${result.results.length}).</p>`;
                html += '<ul class="space-y-2 max-h-60 overflow-y-auto bg-gray-50 p-2 rounded">';
                result.results.forEach(item => {
                    html += `<li class="border-b border-gray-200 pb-1 mb-1 text-xs">
                                ...${item.left.slice(-50)}<strong class="text-purple-600 bg-purple-100 px-1">${item.term}</strong>${item.right.slice(0, 50)}...
                             </li>`;
                });
                html += '</ul>';
            } else {
                html += `<p>No se encontraron ocurrencias de "${result.searchTerm}".</p>`;
            }
            break;
        case 'semantic_analysis':
            html = `<h4 class="font-semibold text-gray-700 mb-1">Análisis de Campos Semánticos:</h4>`;
            if (result.fields && result.fields.length > 0) {
                html += '<ul class="list-disc pl-5 space-y-1 max-h-60 overflow-y-auto bg-gray-50 p-2 rounded">';
                result.fields.forEach(item => {
                    html += `<li><span class="font-medium">${item.fieldName}</span>: ${item.count} ocurrencias</li>`;
                });
                html += '</ul>';
            } else {
                html += '<p>No se procesaron campos semánticos o no se encontraron ocurrencias.</p>';
            }
            break;
        case 'basic_text_stats':
            html = `<h4 class="font-semibold text-gray-700 mb-1">Estadísticas Básicas del Texto:</h4>`;
            if(result){
                html += '<ul class="list-disc pl-5 space-y-1 bg-gray-50 p-2 rounded">';
                html += `<li>Caracteres (con espacios): ${result.charCountWithSpaces !== undefined ? result.charCountWithSpaces : 'N/A'}</li>`;
                html += `<li>Caracteres (sin espacios): ${result.charCountWithoutSpaces !== undefined ? result.charCountWithoutSpaces : 'N/A'}</li>`;
                html += `<li>Total de Palabras: ${result.wordCount !== undefined ? result.wordCount : 'N/A'}</li>`;
                html += `<li>Longitud Promedio de Palabra: ${result.averageWordLength !== undefined ? result.averageWordLength : 'N/A'}</li>`;
                html += '</ul>';
            } else {
                html += '<p>No se pudieron calcular las estadísticas.</p>';
            }
            break;
        default:
            html = '<h4 class="font-semibold text-gray-700 mb-1">Resultados del Análisis:</h4>';
            html += '<pre class="bg-gray-100 p-2 rounded text-xs overflow-x-auto">' + JSON.stringify(result, null, 2) + '</pre>';
    }
    container.innerHTML = html;
}

// Remove the old global window.runAnalysis if it exists
if (typeof window.runAnalysis === 'function') {
    delete window.runAnalysis;
}
