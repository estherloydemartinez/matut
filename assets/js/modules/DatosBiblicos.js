// DatosBiblicos.js - Módulo para manejar los datos bíblicos
console.log("DatosBiblicos.js cargado.");

class DatosBiblicos {
    constructor() {
        console.log("Módulo DatosBiblicos inicializado.");
        this.libros = null; // Lista de nombres de libros y metadatos básicos
        this.cacheLibros = new Map(); // Cache para los datos completos de cada libro
        this.booksMetadata = null; // Para metadatos adicionales como abreviaturas, num_chapters
    }

    async init() {
        console.log("DatosBiblicos: Iniciando carga de datos...");
        await this.cargarListaLibros();
        // Opcional: Cargar metadatos adicionales si es necesario
        // await this.cargarMetadatosAdicionales();
        console.log("DatosBiblicos: Inicialización completada.");
    }

    async cargarListaLibros() {
        try {
            const response = await fetch('bakend/biblia%20offline/Books.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} al cargar Books.json`);
            }
            this.libros = await response.json();
            console.log("DatosBiblicos: Lista de libros cargada:", this.libros);
        } catch (error) {
            console.error("DatosBiblicos: Error cargando la lista de libros (Books.json):", error);
            this.libros = []; // Asegurar que libros sea un array para evitar errores posteriores
        }
    }

    // Ejemplo de cómo se podrían cargar metadatos adicionales (opcional)
    // async cargarMetadatosAdicionales() {
    //     try {
    //         const response = await fetch('path/to/V4/bible-data-enhanced.js'); // o .json
    //         if (!response.ok) throw new Error('Error cargando metadatos adicionales');
    //         const rawData = await response.text(); // Si es JS, podría necesitar parseo especial
    //         // Evaluar o parsear rawData para obtener this.booksMetadata
    //         // Ejemplo simple si fuera un JSON:
    //         // this.booksMetadata = JSON.parse(rawData);
    //         console.log("DatosBiblicos: Metadatos adicionales cargados.");
    //     } catch (error) {
    //         console.error("DatosBiblicos: Error cargando metadatos adicionales:", error);
    //     }
    // }

    getListaLibros() {
        return this.libros ? [...this.libros] : []; // Devuelve una copia o un array vacío
    }

    async getLibroData(nombreLibro) {
        if (this.cacheLibros.has(nombreLibro)) {
            console.log(`DatosBiblicos: Devolviendo datos de ${nombreLibro} desde caché.`);
            return this.cacheLibros.get(nombreLibro);
        }
        console.log(`DatosBiblicos: Solicitando datos para ${nombreLibro} desde el servidor.`);
        try {
            // Asumiendo que los nombres de archivo coinciden con 'name' en Books.json, ej: "Genesis.json"
            // Es importante que los nombres en Books.json sean compatibles con nombres de archivo.
            const nombreArchivo = nombreLibro.replace(/\s+/g, '') + '.json'; // Ej: "1 Cronicas" -> "1Cronicas.json"
            const response = await fetch(`bakend/biblia%20offline/${encodeURIComponent(nombreArchivo)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} al cargar ${nombreArchivo}`);
            }
            const data = await response.json();
            this.cacheLibros.set(nombreLibro, data);
            console.log(`DatosBiblicos: Datos de ${nombreLibro} cargados y cacheados.`);
            return data;
        } catch (error) {
            console.error(`DatosBiblicos: Error cargando datos del libro ${nombreLibro}:`, error);
            return null; // Devolver null o lanzar el error según se prefiera manejar
        }
    }

    async getCapitulo(nombreLibro, numeroCapitulo) {
        const libroData = await this.getLibroData(nombreLibro);
        if (!libroData || !libroData.chapters) {
            console.error(`DatosBiblicos: No se encontraron datos o capítulos para ${nombreLibro}.`);
            return null;
        }
        // Los capítulos en el JSON parecen estar indexados directamente por número (como string)
        const capitulo = libroData.chapters.find(ch => ch.chapter === parseInt(numeroCapitulo));
        if (!capitulo) {
             console.error(`DatosBiblicos: Capítulo ${numeroCapitulo} no encontrado en ${nombreLibro}. Los capítulos disponibles son:`, libroData.chapters.map(ch => ch.chapter));
            return null;
        }
        return capitulo;
    }

    async getNumeroCapitulos(nombreLibro) {
        const libroData = await this.getLibroData(nombreLibro);
        if (!libroData || !libroData.chapters) {
            console.warn(`DatosBiblicos: No se pudo obtener el número de capítulos para ${nombreLibro} porque no hay datos del libro o capítulos.`);
            return 0;
        }
        return libroData.chapters.length;
    }

    async getTextoCapitulo(nombreLibro, numeroCapitulo) {
        const capituloData = await this.getCapitulo(nombreLibro, numeroCapitulo);
        if (!capituloData || !capituloData.verses) {
            return "Capítulo no encontrado o sin versículos.";
        }
        let textoFormateado = `<div class="capitulo-texto"><h3>${nombreLibro} ${numeroCapitulo}</h3>`;
        capituloData.verses.forEach(v => {
            textoFormateado += `<p><strong class="numero-versiculo">${v.verse}</strong> ${v.text}</p>`;
        });
        textoFormateado += `</div>`;
        return textoFormateado;
    }

    async getTextoVersiculo(nombreLibro, numeroCapitulo, numeroVersiculo) {
        const capituloData = await this.getCapitulo(nombreLibro, numeroCapitulo);
        if (!capituloData || !capituloData.verses) {
            return "Versículo no encontrado.";
        }
        const versiculo = capituloData.verses.find(v => v.verse === parseInt(numeroVersiculo));
        return versiculo ? versiculo.text : "Versículo no encontrado.";
    }
}

// window.DatosBiblicos = DatosBiblicos;
