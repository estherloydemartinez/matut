/**
 * BibliaApp Pro - Bible Data
 * Datos Bíblicos Completos y Estructura
 */

// ============================================================================
// CONFIGURACIÓN DE VERSIONES BÍBLICAS
// ============================================================================

export const BIBLE_VERSIONS = {
    'rv1960': {
        name: 'Reina-Valera 1960',
        abbreviation: 'RV1960',
        language: 'es',
        year: 1960,
        description: 'La versión más utilizada en español',
        copyright: 'Sociedades Bíblicas en América Latina',
        default: true
    },
    'nvi': {
        name: 'Nueva Versión Internacional',
        abbreviation: 'NVI',
        language: 'es',
        year: 1999,
        description: 'Traducción contemporánea de fácil comprensión'
    },
    'lbla': {
        name: 'La Biblia de las Américas',
        abbreviation: 'LBLA',
        language: 'es',
        year: 1986,
        description: 'Traducción literal y precisa'
    },
    'dhh': {
        name: 'Dios Habla Hoy',
        abbreviation: 'DHH',
        language: 'es',
        year: 1979,
        description: 'Lenguaje popular y accesible'
    }
};

// ============================================================================
// ESTRUCTURA DE LIBROS BÍBLICOS
// ============================================================================

export const BIBLE_BOOKS = {
    // ANTIGUO TESTAMENTO
    'genesis': {
        name: 'Génesis',
        abbreviation: 'Gn',
        testament: 'antiguo',
        order: 1,
        chapters: 50,
        category: 'pentateuco',
        author: 'Moisés',
        theme: 'Orígenes',
        keyVerse: '1:1',
        summary: 'El libro de los orígenes: creación, humanidad, pecado y promesa de redención.'
    },
    'exodo': {
        name: 'Éxodo',
        abbreviation: 'Ex',
        testament: 'antiguo',
        order: 2,
        chapters: 40,
        category: 'pentateuco',
        author: 'Moisés',
        theme: 'Liberación',
        keyVerse: '20:2',
        summary: 'La liberación de Israel de Egipto y la entrega de la Ley en el Sinaí.'
    },
    'levitico': {
        name: 'Levítico',
        abbreviation: 'Lv',
        testament: 'antiguo',
        order: 3,
        chapters: 27,
        category: 'pentateuco',
        author: 'Moisés',
        theme: 'Santidad',
        keyVerse: '19:2',
        summary: 'Leyes ceremoniales y morales para la santidad del pueblo de Dios.'
    },
    'numeros': {
        name: 'Números',
        abbreviation: 'Nm',
        testament: 'antiguo',
        order: 4,
        chapters: 36,
        category: 'pentateuco',
        author: 'Moisés',
        theme: 'Peregrinaje',
        keyVerse: '14:34',
        summary: 'El peregrinaje de Israel por el desierto durante 40 años.'
    },
    'deuteronomio': {
        name: 'Deuteronomio',
        abbreviation: 'Dt',
        testament: 'antiguo',
        order: 5,
        chapters: 34,
        category: 'pentateuco',
        author: 'Moisés',
        theme: 'Segunda Ley',
        keyVerse: '6:4-5',
        summary: 'Repetición y aplicación de la Ley antes de entrar a la Tierra Prometida.'
    },
    
    // LIBROS HISTÓRICOS
    'josue': {
        name: 'Josué',
        abbreviation: 'Jos',
        testament: 'antiguo',
        order: 6,
        chapters: 24,
        category: 'historicos',
        author: 'Josué',
        theme: 'Conquista',
        keyVerse: '1:8',
        summary: 'La conquista y distribución de la Tierra Prometida.'
    },
    'jueces': {
        name: 'Jueces',
        abbreviation: 'Jue',
        testament: 'antiguo',
        order: 7,
        chapters: 21,
        category: 'historicos',
        author: 'Desconocido',
        theme: 'Ciclos',
        keyVerse: '21:25',
        summary: 'Ciclos de apostasía, opresión, clamor y liberación en Israel.'
    },
    'rut': {
        name: 'Rut',
        abbreviation: 'Rt',
        testament: 'antiguo',
        order: 8,
        chapters: 4,
        category: 'historicos',
        author: 'Desconocido',
        theme: 'Lealtad',
        keyVerse: '1:16',
        summary: 'Historia de lealtad y redención en tiempos de los jueces.'
    },
    '1samuel': {
        name: '1 Samuel',
        abbreviation: '1 S',
        testament: 'antiguo',
        order: 9,
        chapters: 31,
        category: 'historicos',
        author: 'Samuel',
        theme: 'Transición',
        keyVerse: '15:22',
        summary: 'Transición de jueces a reyes: Samuel, Saúl y David.'
    },
    '2samuel': {
        name: '2 Samuel',
        abbreviation: '2 S',
        testament: 'antiguo',
        order: 10,
        chapters: 24,
        category: 'historicos',
        author: 'Desconocido',
        theme: 'Reino de David',
        keyVerse: '7:16',
        summary: 'El reinado de David y el establecimiento de su dinastía.'
    },
    '1reyes': {
        name: '1 Reyes',
        abbreviation: '1 R',
        testament: 'antiguo',
        order: 11,
        chapters: 22,
        category: 'historicos',
        author: 'Desconocido',
        theme: 'Reino Unido/Dividido',
        keyVerse: '11:11',
        summary: 'Salomón y la división del reino en Israel y Judá.'
    },
    '2reyes': {
        name: '2 Reyes',
        abbreviation: '2 R',
        testament: 'antiguo',
        order: 12,
        chapters: 25,
        category: 'historicos',
        author: 'Desconocido',
        theme: 'Caída de los Reinos',
        keyVerse: '17:23',
        summary: 'Historia de los reinos divididos hasta su caída y exilio.'
    },
    '1cronicas': {
        name: '1 Crónicas',
        abbreviation: '1 Cr',
        testament: 'antiguo',
        order: 13,
        chapters: 29,
        category: 'historicos',
        author: 'Esdras',
        theme: 'Genealogías',
        keyVerse: '17:14',
        summary: 'Genealogías y el reinado de David desde perspectiva sacerdotal.'
    },
    '2cronicas': {
        name: '2 Crónicas',
        abbreviation: '2 Cr',
        testament: 'antiguo',
        order: 14,
        chapters: 36,
        category: 'historicos',
        author: 'Esdras',
        theme: 'Reino de Judá',
        keyVerse: '7:14',
        summary: 'Historia del reino de Judá con énfasis en el templo y la adoración.'
    },
    'esdras': {
        name: 'Esdras',
        abbreviation: 'Esd',
        testament: 'antiguo',
        order: 15,
        chapters: 10,
        category: 'historicos',
        author: 'Esdras',
        theme: 'Restauración',
        keyVerse: '7:10',
        summary: 'Retorno del exilio y reconstrucción del templo.'
    },
    'nehemias': {
        name: 'Nehemías',
        abbreviation: 'Neh',
        testament: 'antiguo',
        order: 16,
        chapters: 13,
        category: 'historicos',
        author: 'Nehemías',
        theme: 'Reconstrucción',
        keyVerse: '2:20',
        summary: 'Reconstrucción de los muros de Jerusalén y reformas espirituales.'
    },
    'ester': {
        name: 'Ester',
        abbreviation: 'Est',
        testament: 'antiguo',
        order: 17,
        chapters: 10,
        category: 'historicos',
        author: 'Desconocido',
        theme: 'Providencia',
        keyVerse: '4:14',
        summary: 'Providencia divina para preservar al pueblo judío en Persia.'
    },
    
    // LIBROS POÉTICOS
    'job': {
        name: 'Job',
        abbreviation: 'Job',
        testament: 'antiguo',
        order: 18,
        chapters: 42,
        category: 'poeticos',
        author: 'Desconocido',
        theme: 'Sufrimiento',
        keyVerse: '19:25',
        summary: 'El problema del sufrimiento del justo y la soberanía de Dios.'
    },
    'salmos': {
        name: 'Salmos',
        abbreviation: 'Sal',
        testament: 'antiguo',
        order: 19,
        chapters: 150,
        category: 'poeticos',
        author: 'Varios',
        theme: 'Adoración',
        keyVerse: '23:1',
        summary: 'Himnario de Israel: alabanza, lamento, gratitud y adoración.'
    },
    'proverbios': {
        name: 'Proverbios',
        abbreviation: 'Pr',
        testament: 'antiguo',
        order: 20,
        chapters: 31,
        category: 'poeticos',
        author: 'Salomón y otros',
        theme: 'Sabiduría',
        keyVerse: '1:7',
        summary: 'Sabiduría práctica para la vida diaria y el temor de Jehová.'
    },
    'eclesiastes': {
        name: 'Eclesiastés',
        abbreviation: 'Ec',
        testament: 'antiguo',
        order: 21,
        chapters: 12,
        category: 'poeticos',
        author: 'Salomón',
        theme: 'Vanidad',
        keyVerse: '12:13',
        summary: 'La búsqueda del significado de la vida bajo el sol.'
    },
    'cantares': {
        name: 'Cantares',
        abbreviation: 'Cnt',
        testament: 'antiguo',
        order: 22,
        chapters: 8,
        category: 'poeticos',
        author: 'Salomón',
        theme: 'Amor',
        keyVerse: '8:7',
        summary: 'Celebración del amor conyugal y la belleza del matrimonio.'
    },
    
    // PROFETAS MAYORES
    'isaias': {
        name: 'Isaías',
        abbreviation: 'Is',
        testament: 'antiguo',
        order: 23,
        chapters: 66,
        category: 'profetas_mayores',
        author: 'Isaías',
        theme: 'Salvación',
        keyVerse: '53:6',
        summary: 'Juicio y salvación; el Mesías sufriente y glorioso.'
    },
    'jeremias': {
        name: 'Jeremías',
        abbreviation: 'Jer',
        testament: 'antiguo',
        order: 24,
        chapters: 52,
        category: 'profetas_mayores',
        author: 'Jeremías',
        theme: 'Juicio',
        keyVerse: '31:31',
        summary: 'Llamado al arrepentimiento antes del juicio babilónico.'
    },
    'lamentaciones': {
        name: 'Lamentaciones',
        abbreviation: 'Lm',
        testament: 'antiguo',
        order: 25,
        chapters: 5,
        category: 'profetas_mayores',
        author: 'Jeremías',
        theme: 'Lamento',
        keyVerse: '3:22-23',
        summary: 'Lamento por la destrucción de Jerusalén y esperanza en Dios.'
    },
    'ezequiel': {
        name: 'Ezequiel',
        abbreviation: 'Ez',
        testament: 'antiguo',
        order: 26,
        chapters: 48,
        category: 'profetas_mayores',
        author: 'Ezequiel',
        theme: 'Gloria de Dios',
        keyVerse: '36:26',
        summary: 'La gloria de Dios se aparta y regresa; restauración futura.'
    },
    'daniel': {
        name: 'Daniel',
        abbreviation: 'Dn',
        testament: 'antiguo',
        order: 27,
        chapters: 12,
        category: 'profetas_mayores',
        author: 'Daniel',
        theme: 'Soberanía',
        keyVerse: '2:44',
        summary: 'Soberanía de Dios sobre las naciones y profecías del futuro.'
    },
    
    // PROFETAS MENORES
    'oseas': {
        name: 'Oseas',
        abbreviation: 'Os',
        testament: 'antiguo',
        order: 28,
        chapters: 14,
        category: 'profetas_menores',
        author: 'Oseas',
        theme: 'Amor fiel',
        keyVerse: '11:1',
        summary: 'El amor fiel de Dios hacia su pueblo infiel.'
    },
    'joel': {
        name: 'Joel',
        abbreviation: 'Jl',
        testament: 'antiguo',
        order: 29,
        chapters: 3,
        category: 'profetas_menores',
        author: 'Joel',
        theme: 'Día del Señor',
        keyVerse: '2:28',
        summary: 'El día del Señor: juicio y bendición; derramamiento del Espíritu.'
    },
    'amos': {
        name: 'Amós',
        abbreviation: 'Am',
        testament: 'antiguo',
        order: 30,
        chapters: 9,
        category: 'profetas_menores',
        author: 'Amós',
        theme: 'Justicia',
        keyVerse: '5:24',
        summary: 'Llamado a la justicia social y la verdadera adoración.'
    },
    'abdias': {
        name: 'Abdías',
        abbreviation: 'Abd',
        testament: 'antiguo',
        order: 31,
        chapters: 1,
        category: 'profetas_menores',
        author: 'Abdías',
        theme: 'Orgullo',
        keyVerse: '1:3',
        summary: 'Juicio contra Edom por su orgullo y traición a Judá.'
    },
    'jonas': {
        name: 'Jonás',
        abbreviation: 'Jon',
        testament: 'antiguo',
        order: 32,
        chapters: 4,
        category: 'profetas_menores',
        author: 'Jonás',
        theme: 'Misericordia',
        keyVerse: '4:2',
        summary: 'La misericordia de Dios se extiende a todas las naciones.'
    },
    'miqueas': {
        name: 'Miqueas',
        abbreviation: 'Miq',
        testament: 'antiguo',
        order: 33,
        chapters: 7,
        category: 'profetas_menores',
        author: 'Miqueas',
        theme: 'Justicia y misericordia',
        keyVerse: '6:8',
        summary: 'Demanda de justicia y predicción del Mesías nacido en Belén.'
    },
    'nahum': {
        name: 'Nahúm',
        abbreviation: 'Nah',
        testament: 'antiguo',
        order: 34,
        chapters: 3,
        category: 'profetas_menores',
        author: 'Nahúm',
        theme: 'Venganza divina',
        keyVerse: '1:7',
        summary: 'Juicio divino contra Nínive por su crueldad.'
    },
    'habacuc': {
        name: 'Habacuc',
        abbreviation: 'Hab',
        testament: 'antiguo',
        order: 35,
        chapters: 3,
        category: 'profetas_menores',
        author: 'Habacuc',
        theme: 'Fe',
        keyVerse: '2:4',
        summary: 'Diálogo con Dios sobre la justicia; vivir por fe.'
    },
    'sofonias': {
        name: 'Sofonías',
        abbreviation: 'Sof',
        testament: 'antiguo',
        order: 36,
        chapters: 3,
        category: 'profetas_menores',
        author: 'Sofonías',
        theme: 'Día del Señor',
        keyVerse: '3:17',
        summary: 'El gran día del Señor y la purificación del remanente.'
    },
    'hageo': {
        name: 'Hageo',
        abbreviation: 'Hag',
        testament: 'antiguo',
        order: 37,
        chapters: 2,
        category: 'profetas_menores',
        author: 'Hageo',
        theme: 'Prioridades',
        keyVerse: '1:8',
        summary: 'Llamado a reconstruir el templo y poner a Dios primero.'
    },
    'zacarias': {
        name: 'Zacarías',
        abbreviation: 'Zac',
        testament: 'antiguo',
        order: 38,
        chapters: 14,
        category: 'profetas_menores',
        author: 'Zacarías',
        theme: 'Restauración',
        keyVerse: '4:6',
        summary: 'Visiones de restauración y profecías mesiánicas.'
    },
    'malaquias': {
        name: 'Malaquías',
        abbreviation: 'Mal',
        testament: 'antiguo',
        order: 39,
        chapters: 4,
        category: 'profetas_menores',
        author: 'Malaquías',
        theme: 'Reforma',
        keyVerse: '3:10',
        summary: 'Llamado a la reforma espiritual y promesa del Mesías.'
    },
    
    // NUEVO TESTAMENTO - EVANGELIOS
    'mateo': {
        name: 'Mateo',
        abbreviation: 'Mt',
        testament: 'nuevo',
        order: 40,
        chapters: 28,
        category: 'evangelios',
        author: 'Mateo',
        theme: 'Rey Mesías',
        keyVerse: '16:16',
        summary: 'Jesús como el Rey Mesías prometido al pueblo judío.'
    },
    'marcos': {
        name: 'Marcos',
        abbreviation: 'Mr',
        testament: 'nuevo',
        order: 41,
        chapters: 16,
        category: 'evangelios',
        author: 'Marcos',
        theme: 'Siervo',
        keyVerse: '10:45',
        summary: 'Jesús como el Siervo sufriente que vino a servir.'
    },
    'lucas': {
        name: 'Lucas',
        abbreviation: 'Lc',
        testament: 'nuevo',
        order: 42,
        chapters: 24,
        category: 'evangelios',
        author: 'Lucas',
        theme: 'Hijo del Hombre',
        keyVerse: '19:10',
        summary: 'Jesús como el Hijo del Hombre, Salvador de todos.'
    },
    'juan': {
        name: 'Juan',
        abbreviation: 'Jn',
        testament: 'nuevo',
        order: 43,
        chapters: 21,
        category: 'evangelios',
        author: 'Juan',
        theme: 'Hijo de Dios',
        keyVerse: '20:31',
        summary: 'Jesús como el Hijo de Dios, dador de vida eterna.'
    },
    
    // HISTORIA
    'hechos': {
        name: 'Hechos',
        abbreviation: 'Hch',
        testament: 'nuevo',
        order: 44,
        chapters: 28,
        category: 'historia',
        author: 'Lucas',
        theme: 'Iglesia primitiva',
        keyVerse: '1:8',
        summary: 'La expansión del evangelio y el crecimiento de la iglesia primitiva.'
    },
    
    // EPÍSTOLAS PAULINAS
    'romanos': {
        name: 'Romanos',
        abbreviation: 'Ro',
        testament: 'nuevo',
        order: 45,
        chapters: 16,
        category: 'epistolas_paulinas',
        author: 'Pablo',
        theme: 'Salvación',
        keyVerse: '1:16',
        summary: 'La salvación por fe y la justicia de Dios revelada.'
    },
    '1corintios': {
        name: '1 Corintios',
        abbreviation: '1 Co',
        testament: 'nuevo',
        order: 46,
        chapters: 16,
        category: 'epistolas_paulinas',
        author: 'Pablo',
        theme: 'Problemas de iglesia',
        keyVerse: '13:13',
        summary: 'Soluciones a problemas de la iglesia y el amor cristiano.'
    },
    '2corintios': {
        name: '2 Corintios',
        abbreviation: '2 Co',
        testament: 'nuevo',
        order: 47,
        chapters: 13,
        category: 'epistolas_paulinas',
        author: 'Pablo',
        theme: 'Ministerio',
        keyVerse: '5:17',
        summary: 'La naturaleza del ministerio cristiano y la reconciliación.'
    },
    'galatas': {
        name: 'Gálatas',
        abbreviation: 'Gá',
        testament: 'nuevo',
        order: 48,
        chapters: 6,
        category: 'epistolas_paulinas',
        author: 'Pablo',
        theme: 'Libertad en Cristo',
        keyVerse: '5:1',
        summary: 'Libertad de la ley a través de la fe en Cristo.'
    },
    'efesios': {
        name: 'Efesios',
        abbreviation: 'Ef',
        testament: 'nuevo',
        order: 49,
        chapters: 6,
        category: 'epistolas_paulinas',
        author: 'Pablo',
        theme: 'Unidad en Cristo',
        keyVerse: '2:8-9',
        summary: 'La unidad de la iglesia en Cristo y la vida cristiana práctica.'
    },
    'filipenses': {
        name: 'Filipenses',
        abbreviation: 'Fil',
        testament: 'nuevo',
        order: 50,
        chapters: 4,
        category: 'epistolas_paulinas',
        author: 'Pablo',
        theme: 'Gozo',
        keyVerse: '4:13',
        summary: 'El gozo cristiano en todas las circunstancias.'
    },
    'colosenses': {
        name: 'Colosenses',
        abbreviation: 'Col',
        testament: 'nuevo',
        order: 51,
        chapters: 4,
        category: 'epistolas_paulinas',
        author: 'Pablo',
        theme: 'Supremacía de Cristo',
        keyVerse: '1:18',
        summary: 'La supremacía y suficiencia de Cristo sobre todas las cosas.'
    },
    '1tesalonicenses': {
        name: '1 Tesalonicenses',
        abbreviation: '1 Ts',
        testament: 'nuevo',
        order: 52,
        chapters: 5,
        category: 'epistolas_paulinas',
        author: 'Pablo',
        theme: 'Segunda venida',
        keyVerse: '4:16-17',
        summary: 'Esperanza en la segunda venida de Cristo.'
    },
    '2tesalonicenses': {
        name: '2 Tesalonicenses',
        abbreviation: '2 Ts',
        testament: 'nuevo',
        order: 53,
        chapters: 3,
        category: 'epistolas_paulinas',
        author: 'Pablo',
        theme: 'Paciencia',
        keyVerse: '3:16',
        summary: 'Paciencia mientras se espera la segunda venida.'
    },
    '1timoteo': {
        name: '1 Timoteo',
        abbreviation: '1 Ti',
        testament: 'nuevo',
        order: 54,
        chapters: 6,
        category: 'epistolas_pastorales',
        author: 'Pablo',
        theme: 'Liderazgo',
        keyVerse: '3:15',
        summary: 'Instrucciones para el liderazgo y orden en la iglesia.'
    },
    '2timoteo': {
        name: '2 Timoteo',
        abbreviation: '2 Ti',
        testament: 'nuevo',
        order: 55,
        chapters: 4,
        category: 'epistolas_pastorales',
        author: 'Pablo',
        theme: 'Perseverancia',
        keyVerse: '3:16-17',
        summary: 'Perseverancia en el ministerio y la fidelidad a la Palabra.'
    },
    'tito': {
        name: 'Tito',
        abbreviation: 'Tit',
        testament: 'nuevo',
        order: 56,
        chapters: 3,
        category: 'epistolas_pastorales',
        author: 'Pablo',
        theme: 'Buenas obras',
        keyVerse: '2:11-12',
        summary: 'La gracia de Dios enseña a vivir en santidad.'
    },
    'filemon': {
        name: 'Filemón',
        abbreviation: 'Flm',
        testament: 'nuevo',
        order: 57,
        chapters: 1,
        category: 'epistolas_paulinas',
        author: 'Pablo',
        theme: 'Perdón',
        keyVerse: '1:16',
        summary: 'El perdón cristiano y la restauración de relaciones.'
    },
    
    // EPÍSTOLAS GENERALES
    'hebreos': {
        name: 'Hebreos',
        abbreviation: 'He',
        testament: 'nuevo',
        order: 58,
        chapters: 13,
        category: 'epistolas_generales',
        author: 'Desconocido',
        theme: 'Superioridad de Cristo',
        keyVerse: '1:1-2',
        summary: 'La superioridad de Cristo sobre el sistema del Antiguo Testamento.'
    },
    'santiago': {
        name: 'Santiago',
        abbreviation: 'Stg',
        testament: 'nuevo',
        order: 59,
        chapters: 5,
        category: 'epistolas_generales',
        author: 'Santiago',
        theme: 'Fe práctica',
        keyVerse: '2:26',
        summary: 'La fe genuina se manifiesta en obras prácticas.'
    },
    '1pedro': {
        name: '1 Pedro',
        abbreviation: '1 P',
        testament: 'nuevo',
        order: 60,
        chapters: 5,
        category: 'epistolas_generales',
        author: 'Pedro',
        theme: 'Sufrimiento',
        keyVerse: '1:6-7',
        summary: 'Esperanza y conducta cristiana en medio del sufrimiento.'
    },
    '2pedro': {
        name: '2 Pedro',
        abbreviation: '2 P',
        testament: 'nuevo',
        order: 61,
        chapters: 3,
        category: 'epistolas_generales',
        author: 'Pedro',
        theme: 'Conocimiento',
        keyVerse: '3:18',
        summary: 'Crecimiento en el conocimiento y advertencia contra falsos maestros.'
    },
    '1juan': {
        name: '1 Juan',
        abbreviation: '1 Jn',
        testament: 'nuevo',
        order: 62,
        chapters: 5,
        category: 'epistolas_generales',
        author: 'Juan',
        theme: 'Amor y comunión',
        keyVerse: '4:8',
        summary: 'Amor, luz, vida y las marcas de los verdaderos creyentes.'
    },
    '2juan': {
        name: '2 Juan',
        abbreviation: '2 Jn',
        testament: 'nuevo',
        order: 63,
        chapters: 1,
        category: 'epistolas_generales',
        author: 'Juan',
        theme: 'Verdad y amor',
        keyVerse: '1:6',
        summary: 'Caminar en amor y verdad, rechazando el error.'
    },
    '3juan': {
        name: '3 Juan',
        abbreviation: '3 Jn',
        testament: 'nuevo',
        order: 64,
        chapters: 1,
        category: 'epistolas_generales',
        author: 'Juan',
        theme: 'Hospitalidad',
        keyVerse: '1:8',
        summary: 'Hospitalidad cristiana y cooperación en la verdad.'
    },
    'judas': {
        name: 'Judas',
        abbreviation: 'Jud',
        testament: 'nuevo',
        order: 65,
        chapters: 1,
        category: 'epistolas_generales',
        author: 'Judas',
        theme: 'Contender por la fe',
        keyVerse: '1:3',
        summary: 'Contender por la fe contra los falsos maestros.'
    },
    
    // PROFECÍA
    'apocalipsis': {
        name: 'Apocalipsis',
        abbreviation: 'Ap',
        testament: 'nuevo',
        order: 66,
        chapters: 22,
        category: 'profetico',
        author: 'Juan',
        theme: 'Victoria final',
        keyVerse: '1:7',
        summary: 'La revelación de Jesucristo y Su victoria final sobre el mal.'
    }
};

// ============================================================================
// CATEGORÍAS DE LIBROS
// ============================================================================

export const BOOK_CATEGORIES = {
    'pentateuco': {
        name: 'Pentateuco',
        description: 'Los cinco libros de Moisés',
        books: ['genesis', 'exodo', 'levitico', 'numeros', 'deuteronomio'],
        color: '#4F46E5',
        icon: '📜'
    },
    'historicos': {
        name: 'Históricos',
        description: 'Historia del pueblo de Israel',
        books: ['josue', 'jueces', 'rut', '1samuel', '2samuel', '1reyes', '2reyes', '1cronicas', '2cronicas', 'esdras', 'nehemias', 'ester'],
        color: '#059669',
        icon: '🏛️'
    },
    'poeticos': {
        name: 'Poéticos',
        description: 'Literatura sapiencial y poética',
        books: ['job', 'salmos', 'proverbios', 'eclesiastes', 'cantares'],
        color: '#DC2626',
        icon: '🎵'
    },
    'profetas_mayores': {
        name: 'Profetas Mayores',
        description: 'Los grandes profetas',
        books: ['isaias', 'jeremias', 'lamentaciones', 'ezequiel', 'daniel'],
        color: '#7C3AED',
        icon: '👨‍🎓'
    },
    'profetas_menores': {
        name: 'Profetas Menores',
        description: 'Los doce profetas menores',
        books: ['oseas', 'joel', 'amos', 'abdias', 'jonas', 'miqueas', 'nahum', 'habacuc', 'sofonias', 'hageo', 'zacarias', 'malaquias'],
        color: '#EA580C',
        icon: '📢'
    },
    'evangelios': {
        name: 'Evangelios',
        description: 'La vida y ministerio de Jesús',
        books: ['mateo', 'marcos', 'lucas', 'juan'],
        color: '#0891B2',
        icon: '✝️'
    },
    'historia': {
        name: 'Historia',
        description: 'Historia de la iglesia primitiva',
        books: ['hechos'],
        color: '#65A30D',
        icon: '⛪'
    },
    'epistolas_paulinas': {
        name: 'Epístolas Paulinas',
        description: 'Cartas del apóstol Pablo',
        books: ['romanos', '1corintios', '2corintios', 'galatas', 'efesios', 'filipenses', 'colosenses', '1tesalonicenses', '2tesalonicenses', 'filemon'],
        color: '#C2410C',
        icon: '✉️'
    },
    'epistolas_pastorales': {
        name: 'Epístolas Pastorales',
        description: 'Cartas pastorales de Pablo',
        books: ['1timoteo', '2timoteo', 'tito'],
        color: '#BE185D',
        icon: '👨‍🏫'
    },
    'epistolas_generales': {
        name: 'Epístolas Generales',
        description: 'Cartas de otros apóstoles',
        books: ['hebreos', 'santiago', '1pedro', '2pedro', '1juan', '2juan', '3juan', 'judas'],
        color: '#7C2D12',
        icon: '📮'
    },
    'profetico': {
        name: 'Profético',
        description: 'Profecía del tiempo del fin',
        books: ['apocalipsis'],
        color: '#991B1B',
        icon: '🔮'
    }
};

// ============================================================================
// PLANES DE LECTURA
// ============================================================================

export const READING_PLANS = {
    'anual': {
        name: 'Biblia en un Año',
        description: 'Lee toda la Biblia en 365 días',
        duration: 365,
        dailyChapters: 3.2,
        difficulty: 'medium'
    },
    'cronologica': {
        name: 'Lectura Cronológica',
        description: 'Lee la Biblia en orden cronológico de eventos',
        duration: 365,
        dailyChapters: 3.2,
        difficulty: 'medium'
    },
    'nuevo_testamento': {
        name: 'Nuevo Testamento en 90 días',
        description: 'Lee todo el Nuevo Testamento en 3 meses',
        duration: 90,
        dailyChapters: 2.9,
        difficulty: 'easy'
    },
    'salmos_proverbios': {
        name: 'Salmos y Proverbios',
        description: 'Un salmo y un proverbio cada día',
        duration: 150,
        dailyChapters: 2,
        difficulty: 'easy'
    },
    'evangelios': {
        name: 'Los Cuatro Evangelios',
        description: 'Lee los cuatro evangelios en 30 días',
        duration: 30,
        dailyChapters: 3,
        difficulty: 'easy'
    }
};

// ============================================================================
// VERSÍCULOS DESTACADOS
// ============================================================================

export const FEATURED_VERSES = [
    {
        reference: 'Juan 3:16',
        text: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
        category: 'salvacion',
        topics: ['amor', 'salvacion', 'vida_eterna']
    },
    {
        reference: 'Filipenses 4:13',
        text: 'Todo lo puedo en Cristo que me fortalece.',
        category: 'fortaleza',
        topics: ['fortaleza', 'poder', 'cristo']
    },
    {
        reference: 'Salmos 23:1',
        text: 'Jehová es mi pastor; nada me faltará.',
        category: 'confianza',
        topics: ['provision', 'cuidado', 'pastor']
    },
    {
        reference: 'Romanos 8:28',
        text: 'Y sabemos que a los que aman a Dios, todas las cosas les ayudan a bien, esto es, a los que conforme a su propósito son llamados.',
        category: 'esperanza',
        topics: ['propósito', 'esperanza', 'bien']
    },
    {
        reference: 'Proverbios 3:5-6',
        text: 'Fíate de Jehová de todo tu corazón, Y no te apoyes en tu propia prudencia. Reconócelo en todos tus caminos, Y él enderezará tus veredas.',
        category: 'confianza',
        topics: ['confianza', 'direccion', 'sabiduria']
    },
    {
        reference: 'Isaías 40:31',
        text: 'pero los que esperan a Jehová tendrán nuevas fuerzas; levantarán alas como las águilas; correrán, y no se cansarán; caminarán, y no se fatigarán.',
        category: 'fortaleza',
        topics: ['esperanza', 'renovacion', 'fortaleza']
    },
    {
        reference: 'Mateo 28:19-20',
        text: 'Por tanto, id, y haced discípulos a todas las naciones, bautizándolos en el nombre del Padre, y del Hijo, y del Espíritu Santo; enseñándoles que guarden todas las cosas que os he mandado; y he aquí yo estoy con vosotros todos los días, hasta el fin del mundo.',
        category: 'mision',
        topics: ['gran_comision', 'discipulado', 'presencia']
    },
    {
        reference: '1 Corintios 13:4-7',
        text: 'El amor es sufrido, es benigno; el amor no tiene envidia, el amor no es jactancioso, no se envanece; no hace nada indebido, no busca lo suyo, no se irrita, no guarda rencor; no se goza de la injusticia, mas se goza de la verdad. Todo lo sufre, todo lo cree, todo lo espera, todo lo soporta.',
        category: 'amor',
        topics: ['amor', 'caracter', 'relaciones']
    }
];

// ============================================================================
// TEMAS BÍBLICOS
// ============================================================================

export const BIBLICAL_THEMES = {
    'salvacion': {
        name: 'Salvación',
        description: 'La redención ofrecida por Dios a través de Jesucristo',
        keyVerses: ['Juan 3:16', 'Romanos 10:9', 'Efesios 2:8-9'],
        color: '#DC2626'
    },
    'amor': {
        name: 'Amor',
        description: 'El amor de Dios y el amor cristiano',
        keyVerses: ['1 Juan 4:8', '1 Corintios 13:13', 'Juan 13:34-35'],
        color: '#EC4899'
    },
    'fe': {
        name: 'Fe',
        description: 'Confianza y creencia en Dios',
        keyVerses: ['Hebreos 11:1', 'Romanos 1:17', 'Santiago 2:26'],
        color: '#3B82F6'
    },
    'esperanza': {
        name: 'Esperanza',
        description: 'Expectativa confiada en las promesas de Dios',
        keyVerses: ['Romanos 15:13', '1 Pedro 1:3', 'Hebreos 6:19'],
        color: '#10B981'
    },
    'oracion': {
        name: 'Oración',
        description: 'Comunicación con Dios',
        keyVerses: ['1 Tesalonicenses 5:17', 'Mateo 6:9-13', 'Filipenses 4:6'],
        color: '#8B5CF6'
    },
    'sabiduria': {
        name: 'Sabiduría',
        description: 'Discernimiento y entendimiento divino',
        keyVerses: ['Proverbios 9:10', 'Santiago 1:5', '1 Corintios 1:30'],
        color: '#F59E0B'
    },
    'santidad': {
        name: 'Santidad',
        description: 'Separación del pecado y consagración a Dios',
        keyVerses: ['1 Pedro 1:16', 'Levítico 20:7', 'Hebreos 12:14'],
        color: '#6366F1'
    },
    'servicio': {
        name: 'Servicio',
        description: 'Ministerio y servicio a Dios y al prójimo',
        keyVerses: ['Marcos 10:43-44', 'Gálatas 5:13', '1 Pedro 4:10'],
        color: '#059669'
    }
};

// ============================================================================
// CONCORDANCIA BÁSICA
// ============================================================================

export const CONCORDANCE = {
    'amor': {
        references: [
            'Juan 3:16', '1 Juan 4:8', '1 Corintios 13:4-7', 
            'Romanos 5:8', 'Juan 13:34-35', 'Deuteronomio 6:5'
        ],
        count: 686 // Número aproximado de menciones
    },
    'fe': {
        references: [
            'Hebreos 11:1', 'Romanos 1:17', 'Santiago 2:26',
            'Efesios 2:8', 'Habacuc 2:4', 'Mateo 17:20'
        ],
        count: 458
    },
    'esperanza': {
        references: [
            'Romanos 15:13', '1 Pedro 1:3', 'Hebreos 6:19',
            'Salmos 42:5', 'Jeremías 29:11', 'Romanos 8:24-25'
        ],
        count: 182
    },
    'paz': {
        references: [
            'Juan 14:27', 'Filipenses 4:7', 'Romanos 5:1',
            'Isaías 26:3', 'Colosenses 3:15', 'Juan 16:33'
        ],
        count: 298
    },
    'gozo': {
        references: [
            'Nehemías 8:10', 'Salmos 16:11', 'Gálatas 5:22',
            'Juan 15:11', 'Filipenses 4:4', '1 Pedro 1:8'
        ],
        count: 218
    }
};

// ============================================================================
// HERRAMIENTAS DE ESTUDIO
// ============================================================================

export const STUDY_TOOLS = {
    'hermeneutica': {
        name: 'Herramientas Hermenéuticas',
        tools: [
            'Análisis Contextual',
            'Método Histórico-Gramatical',
            'Tipología Bíblica',
            'Alegoría y Simbolismo',
            'Exégesis Narrativa',
            'Crítica Textual',
            'Análisis de Géneros Literarios',
            'Principios de Interpretación',
            'Contexto Cultural',
            'Comparación de Versiones',
            'Análisis Estructural',
            'Método Inductivo'
        ]
    },
    'linguistica': {
        name: 'Análisis Lingüístico',
        tools: [
            'Análisis Semántico',
            'Estructura Sintáctica',
            'Campos Semánticos',
            'Etimología Bíblica',
            'Paralelismo Hebreo',
            'Figuras Retóricas',
            'Análisis Morfológico',
            'Concordancia Temática',
            'Palabras Clave',
            'Análisis de Raíces'
        ]
    },
    'historia': {
        name: 'Contexto Histórico',
        tools: [
            'Cronología Bíblica',
            'Geografía Bíblica',
            'Cultura Antigua',
            'Arqueología Bíblica',
            'Historia del Período',
            'Contexto Político',
            'Costumbres Sociales',
            'Religiones Contemporáneas',
            'Trasfondo Histórico'
        ]
    },
    'teologia': {
        name: 'Teología Sistemática',
        tools: [
            'Análisis Doctrinal',
            'Teología Bíblica',
            'Cristología',
            'Pneumatología',
            'Escatología',
            'Soteriología',
            'Eclesiología'
        ]
    },
    'visualizacion': {
        name: 'Visualizaciones',
        tools: [
            'Mapas Conceptuales',
            'Gráficos de Radar',
            'Líneas de Tiempo',
            'Redes Semánticas',
            'Diagramas de Flujo',
            'Mapas Mentales'
        ]
    }
};

// ============================================================================
// CONFIGURACIÓN DE LECTURA
// ============================================================================

export const READING_CONFIG = {
    fontSizes: ['small', 'medium', 'large', 'extra-large'],
    themes: ['light', 'dark', 'sepia'],
    lineHeights: ['normal', 'relaxed', 'loose'],
    margins: ['narrow', 'normal', 'wide']
};

// ============================================================================
// FUNCIONES AUXILIARES
// ============================================================================

/**
 * Obtener libro por ID
 */
export function getBook(bookId) {
    return BIBLE_BOOKS[bookId] || null;
}

/**
 * Obtener libros por testamento
 */
export function getBooksByTestament(testament) {
    return Object.entries(BIBLE_BOOKS)
        .filter(([_, book]) => book.testament === testament)
        .sort(([_, a], [__, b]) => a.order - b.order)
        .map(([id, book]) => ({ id, ...book }));
}

/**
 * Obtener libros por categoría
 */
export function getBooksByCategory(category) {
    return Object.entries(BIBLE_BOOKS)
        .filter(([_, book]) => book.category === category)
        .sort(([_, a], [__, b]) => a.order - b.order)
        .map(([id, book]) => ({ id, ...book }));
}

/**
 * Buscar versículos
 */
export function searchVerses(query) {
    // Implementación básica de búsqueda
    const results = FEATURED_VERSES.filter(verse => 
        verse.text.toLowerCase().includes(query.toLowerCase()) ||
        verse.reference.toLowerCase().includes(query.toLowerCase()) ||
        verse.topics.some(topic => topic.includes(query.toLowerCase()))
    );
    
    return results;
}

/**
 * Obtener plan de lectura
 */
export function getReadingPlan(planId) {
    return READING_PLANS[planId] || null;
}

/**
 * Obtener versículos por tema
 */
export function getVersesByTheme(theme) {
    return FEATURED_VERSES.filter(verse => 
        verse.category === theme || 
        verse.topics.includes(theme)
    );
}

/**
 * Obtener estadísticas bíblicas
 */
export function getBibleStats() {
    const oldTestamentBooks = Object.values(BIBLE_BOOKS).filter(book => book.testament === 'antiguo');
    const newTestamentBooks = Object.values(BIBLE_BOOKS).filter(book => book.testament === 'nuevo');
    
    const oldTestamentChapters = oldTestamentBooks.reduce((sum, book) => sum + book.chapters, 0);
    const newTestamentChapters = newTestamentBooks.reduce((sum, book) => sum + book.chapters, 0);
    
    return {
        totalBooks: Object.keys(BIBLE_BOOKS).length,
        oldTestamentBooks: oldTestamentBooks.length,
        newTestamentBooks: newTestamentBooks.length,
        totalChapters: oldTestamentChapters + newTestamentChapters,
        oldTestamentChapters,
        newTestamentChapters,
        categories: Object.keys(BOOK_CATEGORIES).length,
        themes: Object.keys(BIBLICAL_THEMES).length
    };\n}\n\n/**\n * Validar referencia bíblica\n */\nexport function validateReference(reference) {\n    // Expresión regular para validar referencias bíblicas\n    const pattern = /^([1-3]?\\s?\\w+)\\s+(\\d+)(?::(\\d+)(?:-(\\d+))?)?$/;\n    const match = reference.match(pattern);\n    \n    if (!match) return false;\n    \n    const [, bookName, chapter, verse, endVerse] = match;\n    \n    // Buscar el libro\n    const book = Object.values(BIBLE_BOOKS).find(b => \n        b.name.toLowerCase() === bookName.toLowerCase() ||\n        b.abbreviation.toLowerCase() === bookName.toLowerCase()\n    );\n    \n    if (!book) return false;\n    \n    // Validar capítulo\n    const chapterNum = parseInt(chapter);\n    if (chapterNum < 1 || chapterNum > book.chapters) return false;\n    \n    return {\n        valid: true,\n        book: book,\n        chapter: chapterNum,\n        verse: verse ? parseInt(verse) : null,\n        endVerse: endVerse ? parseInt(endVerse) : null\n    };\n}\n\n/**\n * Formatear referencia bíblica\n */\nexport function formatReference(book, chapter, verse, endVerse) {\n    let reference = `${book.name} ${chapter}`;\n    \n    if (verse) {\n        reference += `:${verse}`;\n        if (endVerse && endVerse !== verse) {\n            reference += `-${endVerse}`;\n        }\n    }\n    \n    return reference;\n}\n\n/**\n * Obtener versículo aleatorio\n */\nexport function getRandomVerse() {\n    const randomIndex = Math.floor(Math.random() * FEATURED_VERSES.length);\n    return FEATURED_VERSES[randomIndex];\n}\n\n/**\n * Obtener color de categoría\n */\nexport function getCategoryColor(category) {\n    return BOOK_CATEGORIES[category]?.color || '#6B7280';\n}\n\n/**\n * Obtener icono de categoría\n */\nexport function getCategoryIcon(category) {\n    return BOOK_CATEGORIES[category]?.icon || '📖';\n}\n\n// ============================================================================\n// EXPORTACIÓN POR DEFECTO\n// ============================================================================\n\nexport default {\n    BIBLE_VERSIONS,\n    BIBLE_BOOKS,\n    BOOK_CATEGORIES,\n    READING_PLANS,\n    FEATURED_VERSES,\n    BIBLICAL_THEMES,\n    CONCORDANCE,\n    STUDY_TOOLS,\n    READING_CONFIG,\n    \n    // Funciones auxiliares\n    getBook,\n    getBooksByTestament,\n    getBooksByCategory,\n    searchVerses,\n    getReadingPlan,\n    getVersesByTheme,\n    getBibleStats,\n    validateReference,\n    formatReference,\n    getRandomVerse,\n    getCategoryColor,\n    getCategoryIcon\n};\n