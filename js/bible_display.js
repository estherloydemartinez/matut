// js/bible_display.js
document.addEventListener('DOMContentLoaded', () => {
    const bibleDisplayElement = document.getElementById('bible-display-simple');
    let currentTextContent = ""; // To store plain text

    async function loadBiblePassage(bookFilename, bookName, chapter, versesArray = null) {
        if (!bibleDisplayElement) {
            console.error('Element with ID "bible-display-simple" not found.');
            return;
        }
        bibleDisplayElement.innerHTML = '<p class="text-gray-500">Cargando pasaje...</p>';

        try {
            // Path assumes index.html is at root, and js/ is a folder in root.
            // The Bible data was intended to be copied to a top-level 'data/' folder.
            // However, due to previous tooling issues, files are still in 'bakend/biblia offline/'.
            // Adjusting path to reflect the actual current location of the files.
            const response = await fetch(`bakend/biblia offline/${bookFilename}`);
            if (!response.ok) {
                throw new Error(`Error al cargar el libro (${bookFilename}): ${response.statusText} (status: ${response.status})`);
            }
            const bookData = await response.json();

            let passageHtml = `<h4 class="text-lg font-semibold text-gray-800 mb-2">${bookName} ${chapter}</h4>`;
            currentTextContent = ""; // Reset current text

            const chapterData = bookData.chapters.find(ch => ch.chapter === parseInt(chapter));

            if (chapterData) {
                let versesToDisplay;
                if (versesArray && versesArray.length > 0) {
                    // Ensure versesArray contains numbers if chapterData.verses.verse are numbers
                    const numericVersesArray = versesArray.map(v => parseInt(v));
                    versesToDisplay = chapterData.verses.filter(v => numericVersesArray.includes(v.verse));
                } else {
                    versesToDisplay = chapterData.verses; // Display all verses in the chapter
                }

                if (versesToDisplay && versesToDisplay.length > 0) {
                    versesToDisplay.forEach(v => {
                        passageHtml += `<p class="mb-1"><strong class="text-purple-600">${v.verse}</strong> ${v.text}</p>`;
                        currentTextContent += `${v.text} `;
                    });
                } else {
                    passageHtml += `<p class="text-red-500">Versículos no encontrados en el capítulo ${chapter} (buscados: ${versesArray ? versesArray.join(', ') : 'todos'}).</p>`;
                }
            } else {
                passageHtml += `<p class="text-red-500">Capítulo ${chapter} no encontrado en ${bookName}.</p>`;
            }
            bibleDisplayElement.innerHTML = passageHtml;
            currentTextContent = currentTextContent.trim();

        } catch (error) {
            console.error('Error en loadBiblePassage:', error);
            bibleDisplayElement.innerHTML = `<p class="text-red-500">Error al cargar el pasaje: ${error.message}. Verifique la consola y la ruta del archivo.</p>`;
            currentTextContent = "";
        }
    }

    function getCurrentBibleText() {
        if (!currentTextContent && bibleDisplayElement) {
            // Fallback if currentTextContent is empty but element has text (e.g. error message)
            // This is not ideal, should rely on currentTextContent being accurate.
             const paragraphs = bibleDisplayElement.querySelectorAll('p:not([class*="text-red-500"]):not([class*="text-gray-500"])');
             let text = '';
             paragraphs.forEach(p => {
                 const verseNumberElement = p.querySelector('strong');
                 if (verseNumberElement) {
                     text += p.textContent.replace(verseNumberElement.textContent, '').trim() + ' ';
                 } else {
                     text += p.textContent.trim() + ' ';
                 }
             });
             return text.trim();
        }
        return currentTextContent;
    }

    // Expose functions and load default passage
    window.BibleDisplay = {
        loadPassage: loadBiblePassage,
        getCurrentText: getCurrentBibleText
    };

    // Initial load is now handled by user interaction or specific calls from app.js
    // loadBiblePassage('Génesis.json', 'Génesis', '1', [1, 2, 3]);
    // Example call for a whole chapter:
    // loadBiblePassage('Salmos.json', 'Salmos', '23');
});
