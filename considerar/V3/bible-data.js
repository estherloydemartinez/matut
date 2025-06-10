/**
 * BibliaApp Pro - Comprehensive Bible Data
 * Complete Bible content and study resources
 * Optimized for performance and functionality
 * Version: 2.0.0
 */

window.BibleDataComplete = {
    version: '2.0.0',
    
    // Bible versions available
    versions: {
        'RV1960': {
            name: 'Reina-Valera 1960',
            language: 'es',
            year: 1960,
            copyright: 'Dominio público',
            description: 'Versión clásica en español, ampliamente utilizada'
        },
        'RV1995': {
            name: 'Reina-Valera 1995',
            language: 'es', 
            year: 1995,
            copyright: 'Sociedades Bíblicas Unidas',
            description: 'Revisión moderna de la Reina-Valera'
        },
        'NVI': {
            name: 'Nueva Versión Internacional',
            language: 'es',
            year: 1999,
            copyright: 'Biblica',
            description: 'Traducción contemporánea y dinámica'
        }
    },
    
    // Current active version
    currentVersion: 'RV1960',
    
    // Complete book structure
    books: {
        // OLD TESTAMENT
        'genesis': {
            name: 'Génesis',
            abbrev: 'Gn',
            testament: 'old',
            category: 'ley',
            chapters: 50,
            order: 1,
            author: 'Moisés',
            theme: 'Los comienzos',
            keywords: ['creación', 'pacto', 'promesa', 'familia'],
            summary: 'El libro de los orígenes: creación, caída, diluvio, y los patriarcas Abraham, Isaac, Jacob y José.'
        },
        'exodo': {
            name: 'Éxodo', 
            abbrev: 'Ex',
            testament: 'old',
            category: 'ley',
            chapters: 40,
            order: 2,
            author: 'Moisés',
            theme: 'Liberación y ley',
            keywords: ['liberación', 'pascua', 'ley', 'tabernáculo'],
            summary: 'La liberación de Israel de Egipto, el éxodo, el monte Sinaí y la entrega de la ley.'
        },
        'levitico': {
            name: 'Levítico',
            abbrev: 'Lv', 
            testament: 'old',
            category: 'ley',
            chapters: 27,
            order: 3,
            author: 'Moisés',
            theme: 'Santidad',
            keywords: ['sacrificio', 'santidad', 'ritual', 'pureza'],
            summary: 'Leyes ceremoniales, sacrificios y regulaciones para la vida santa del pueblo de Dios.'
        },
        'salmos': {
            name: 'Salmos',
            abbrev: 'Sal',
            testament: 'old',
            category: 'poeticos',
            chapters: 150,
            order: 19,
            author: 'David y otros',
            theme: 'Adoración y oración',
            keywords: ['alabanza', 'oración', 'adoración', 'confianza'],
            summary: 'Himnario de Israel: oraciones, alabanzas y reflexiones espirituales.'
        },
        'proverbios': {
            name: 'Proverbios',
            abbrev: 'Pr',
            testament: 'old', 
            category: 'poeticos',
            chapters: 31,
            order: 20,
            author: 'Salomón y otros',
            theme: 'Sabiduría práctica',
            keywords: ['sabiduría', 'prudencia', 'temor de Jehová', 'instrucción'],
            summary: 'Principios de sabiduría práctica para la vida diaria y las relaciones.'
        },
        'isaias': {
            name: 'Isaías',
            abbrev: 'Is',
            testament: 'old',
            category: 'profeticos_mayores',
            chapters: 66,
            order: 23,
            author: 'Isaías',
            theme: 'Salvación mesiánica',
            keywords: ['mesías', 'siervo', 'salvación', 'gloria'],
            summary: 'Profecías sobre el juicio, la salvación y el Mesías venidero.'
        },
        
        // NEW TESTAMENT
        'mateo': {
            name: 'Mateo',
            abbrev: 'Mt',
            testament: 'new',
            category: 'evangelios',
            chapters: 28,
            order: 40,
            author: 'Mateo',
            theme: 'Jesús como Rey',
            keywords: ['reino', 'cumplimiento', 'enseñanza', 'autoridad'],
            summary: 'Jesús presentado como el Rey mesiánico prometido a Israel.'
        },
        'marcos': {
            name: 'Marcos',
            abbrev: 'Mr',
            testament: 'new',
            category: 'evangelios', 
            chapters: 16,
            order: 41,
            author: 'Marcos',
            theme: 'Jesús como Siervo',
            keywords: ['servicio', 'acción', 'poder', 'sacrificio'],
            summary: 'Jesús presentado como el Siervo sufriente que vino a servir y dar su vida.'
        },
        'lucas': {
            name: 'Lucas',
            abbrev: 'Lc',
            testament: 'new',
            category: 'evangelios',
            chapters: 24,
            order: 42,
            author: 'Lucas',
            theme: 'Jesús como Hombre perfecto',
            keywords: ['humanidad', 'compasión', 'salvación', 'perdón'],
            summary: 'Jesús presentado como el Hombre perfecto, lleno de compasión por todos.'
        },
        'juan': {
            name: 'Juan',
            abbrev: 'Jn',
            testament: 'new',
            category: 'evangelios',
            chapters: 21,
            order: 43,
            author: 'Juan',
            theme: 'Jesús como Dios',
            keywords: ['vida eterna', 'amor', 'luz', 'verdad'],
            summary: 'Jesús presentado como el Hijo de Dios, la Palabra eterna hecha carne.'
        },
        'hechos': {
            name: 'Hechos',
            abbrev: 'Hch',
            testament: 'new',
            category: 'historicos',
            chapters: 28,
            order: 44,
            author: 'Lucas',
            theme: 'La iglesia primitiva',
            keywords: ['espíritu santo', 'iglesia', 'misiones', 'testimonio'],
            summary: 'El nacimiento y crecimiento de la iglesia cristiana primitiva.'
        },
        'romanos': {
            name: 'Romanos',
            abbrev: 'Ro',
            testament: 'new',
            category: 'epistolas_paulinas',
            chapters: 16,
            order: 45,
            author: 'Pablo',
            theme: 'Justificación por fe',
            keywords: ['justificación', 'fe', 'gracia', 'salvación'],
            summary: 'Exposición sistemática del evangelio: salvación por gracia mediante la fe.'
        },
        'filipenses': {
            name: 'Filipenses',
            abbrev: 'Fil',
            testament: 'new',
            category: 'epistolas_paulinas',
            chapters: 4,
            order: 50,
            author: 'Pablo',
            theme: 'Gozo en Cristo',
            keywords: ['gozo', 'contentamiento', 'humildad', 'cristo'],
            summary: 'Carta de gozo y gratitud, con el ejemplo supremo de Cristo Jesús.'
        },
        'apocalipsis': {
            name: 'Apocalipsis',
            abbrev: 'Ap',
            testament: 'new',
            category: 'profeticos',
            chapters: 22,
            order: 66,
            author: 'Juan',
            theme: 'La victoria final de Cristo',
            keywords: ['revelación', 'victoria', 'juicio', 'reino'],
            summary: 'Revelación de Jesucristo sobre los eventos finales y su reino eterno.'
        }
    },
    
    // Sample chapters with complete verses
    chapters: {
        'juan_3': {
            book: 'juan',
            chapter: 3,
            verses: {
                1: 'Había un hombre de los fariseos que se llamaba Nicodemo, un principal entre los judíos.',
                2: 'Este vino a Jesús de noche, y le dijo: Rabí, sabemos que has venido de Dios como maestro; porque nadie puede hacer estas señales que tú haces, si no está Dios con él.',
                3: 'Respondió Jesús y le dijo: De cierto, de cierto te digo, que el que no naciere de nuevo, no puede ver el reino de Dios.',
                4: 'Nicodemo le dijo: ¿Cómo puede un hombre nacer siendo viejo? ¿Puede acaso entrar por segunda vez en el vientre de su madre, y nacer?',
                5: 'Respondió Jesús: De cierto, de cierto te digo, que el que no naciere de agua y del Espíritu, no puede entrar en el reino de Dios.',
                6: 'Lo que es nacido de la carne, carne es; y lo que es nacido del Espíritu, espíritu es.',
                7: 'No te maravilles de que te dije: Os es necesario nacer de nuevo.',
                8: 'El viento sopla de donde quiere, y oyes su sonido; mas ni sabes de dónde viene, ni a dónde va; así es todo aquel que es nacido del Espíritu.',
                9: 'Respondió Nicodemo y le dijo: ¿Cómo puede hacerse esto?',
                10: 'Respondió Jesús y le dijo: ¿Eres tú maestro de Israel, y no sabes esto?',
                11: 'De cierto, de cierto te digo, que lo que sabemos hablamos, y lo que hemos visto, testificamos; y no recibís nuestro testimonio.',
                12: 'Si os he dicho cosas terrenales, y no creéis, ¿cómo creeréis si os dijere las celestiales?',
                13: 'Nadie subió al cielo, sino el que descendió del cielo; el Hijo del Hombre, que está en el cielo.',
                14: 'Y como Moisés levantó la serpiente en el desierto, así es necesario que el Hijo del Hombre sea levantado,',
                15: 'para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
                16: 'Porque de tal manera amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo aquel que en él cree, no se pierda, mas tenga vida eterna.',
                17: 'Porque no envió Dios a su Hijo al mundo para condenar al mundo, sino para que el mundo sea salvo por él.',
                18: 'El que en él cree, no es condenado; pero el que no cree, ya ha sido condenado, porque no ha creído en el nombre del unigénito Hijo de Dios.',
                19: 'Y esta es la condenación: que la luz vino al mundo, y los hombres amaron más las tinieblas que la luz, porque sus obras eran malas.',
                20: 'Porque todo aquel que hace lo malo, aborrece la luz y no viene a la luz, para que sus obras no sean reprendidas.',
                21: 'Mas el que practica la verdad viene a la luz, para que sea manifiesto que sus obras son hechas en Dios.'
            }
        },
        'filipenses_4': {
            book: 'filipenses', 
            chapter: 4,
            verses: {
                1: 'Así que, hermanos míos amados y deseados, gozo y corona mía, estad así firmes en el Señor, amados.',
                2: 'Ruego a Evodia y a Síntique, que sean de un mismo sentir en el Señor.',
                3: 'Asimismo te ruego también a ti, compañero fiel, que ayudes a éstas que combatieron juntamente conmigo en el evangelio, con Clemente también y los demás colaboradores míos, cuyos nombres están en el libro de la vida.',
                4: 'Regocijaos en el Señor siempre. Otra vez digo: ¡Regocijaos!',
                5: 'Vuestra gentileza sea conocida de todos los hombres. El Señor está cerca.',
                6: 'Por nada estéis afanosos, sino sean conocidas vuestras peticiones delante de Dios en toda oración y ruego, con acción de gracias.',
                7: 'Y la paz de Dios, que sobrepasa todo entendimiento, guardará vuestros corazones y vuestros pensamientos en Cristo Jesús.',
                8: 'Por lo demás, hermanos, todo lo que es verdadero, todo lo honesto, todo lo justo, todo lo puro, todo lo amable, todo lo que es de buen nombre; si hay virtud alguna, si algo digno de alabanza, en esto pensad.',
                9: 'Lo que aprendisteis y recibisteis y oísteis y visteis en mí, esto haced; y el Dios de paz estará con vosotros.',
                10: 'En gran manera me gocé en el Señor de que ya al fin habéis revivido vuestro cuidado de mí; de lo cual también estabais solícitos, pero os faltaba la oportunidad.',
                11: 'No lo digo porque tenga escasez, pues he aprendido a contentarme, cualquiera que sea mi situación.',
                12: 'Sé vivir humildemente, y sé tener abundancia; en todo y por todo estoy enseñado, así para estar saciado como para tener hambre, así para tener abundancia como para padecer necesidad.',
                13: 'Todo lo puedo en Cristo que me fortalece.',
                14: 'Sin embargo, bien hicisteis en participar conmigo en mi tribulación.',
                15: 'Y sabéis también vosotros, oh filipenses, que al principio de la predicación del evangelio, cuando partí de Macedonia, ninguna iglesia participó conmigo en razón de dar y recibir, sino vosotros solos;',
                16: 'pues aun a Tesalónica me enviasteis una y otra vez para mis necesidades.',
                17: 'No es que busque dádivas, sino que busco fruto que abunde en vuestra cuenta.',
                18: 'Pero todo lo he recibido, y tengo abundancia; estoy lleno, habiendo recibido de Epafrodito lo que enviasteis; olor fragante, sacrificio acepto, agradable a Dios.',
                19: 'Mi Dios, pues, suplirá todo lo que os falta conforme a sus riquezas en gloria en Cristo Jesús.',
                20: 'Al Dios y Padre nuestro sea gloria por los siglos de los siglos. Amén.',
                21: 'Saludad a todos los santos en Cristo Jesús. Los hermanos que están conmigo os saludan.',
                22: 'Todos los santos os saludan, y especialmente los de la casa de César.',
                23: 'La gracia de nuestro Señor Jesucristo sea con todos vosotros. Amén.'
            }
        },
        'salmos_23': {
            book: 'salmos',
            chapter: 23,
            verses: {
                1: 'Jehová es mi pastor; nada me faltará.',
                2: 'En lugares de delicados pastos me hará descansar; Junto a aguas de reposo me pastoreará.',
                3: 'Confortará mi alma; Me guiará por sendas de justicia por amor de su nombre.',
                4: 'Aunque ande en valle de sombra de muerte, No temeré mal alguno, porque tú estarás conmigo; Tu vara y tu cayado me infundirán aliento.',
                5: 'Aderezas mesa delante de mí en presencia de mis angustiadores; Unges mi cabeza con aceite; mi copa está rebosando.',
                6: 'Ciertamente el bien y la misericordia me seguirán todos los días de mi vida, Y en la casa de Jehová moraré por largos días.'
            }
        }
    },
    
    // Cross-references system
    crossReferences: {
        'juan_3_16': [
            'romanos_5_8',
            '1_juan_4_9',
            'juan_1_14',
            'isaias_53_6'
        ],
        'filipenses_4_13': [
            '2_corintios_12_9',
            'efesios_3_16',
            'colosenses_1_11',
            'filipenses_4_19'
        ],
        'salmos_23_1': [
            'juan_10_11',
            'ezequiel_34_11',
            'isaias_40_11',
            'salmos_95_7'
        ]
    },
    
    // Word definitions and original language insights
    wordStudy: {
        'agape': {
            original: 'ἀγάπη',
            transliteration: 'agape',
            definition: 'Amor incondicional, benevolente y sacrificial',
            usage: 'Amor divino caracterizado por la entrega y el sacrificio',
            verses: ['juan_3_16', '1_corintios_13_4', '1_juan_4_8'],
            etymology: 'Del griego clásico, elevado por el NT para describir el amor divino'
        },
        'pistis': {
            original: 'πίστις',
            transliteration: 'pistis',
            definition: 'Fe, confianza, fidelidad',
            usage: 'Confianza activa y compromiso personal con Dios',
            verses: ['hebreos_11_1', 'romanos_1_17', 'efesios_2_8'],
            etymology: 'Relacionado con persuasión y convicción'
        },
        'shalom': {
            original: 'שָׁלוֹם',
            transliteration: 'shalom',
            definition: 'Paz, completitud, bienestar',
            usage: 'Estado de armonía y plenitud divina',
            verses: ['isaias_26_3', 'filipenses_4_7', 'juan_14_27'],
            etymology: 'De la raíz hebrea que significa "estar completo"'
        }
    },
    
    // Reading plans
    readingPlans: {
        'chronological': {
            name: 'Plan Cronológico',
            description: 'Lee la Biblia en orden cronológico de eventos',
            duration: 365,
            type: 'annual',
            difficulty: 'intermediate',
            schedule: [
                { day: 1, readings: ['genesis_1', 'genesis_2', 'genesis_3'] },
                { day: 2, readings: ['genesis_4', 'genesis_5', 'genesis_6'] },
                { day: 3, readings: ['genesis_7', 'genesis_8', 'genesis_9'] }
                // ... continues for 365 days
            ]
        },
        'topical_salvation': {
            name: 'Salvación en Cristo',
            description: 'Estudio temático sobre la salvación',
            duration: 30,
            type: 'topical',
            difficulty: 'beginner',
            topics: ['pecado', 'gracia', 'fe', 'salvación', 'vida_nueva'],
            schedule: [
                { day: 1, topic: 'pecado', readings: ['romanos_3_23', 'isaias_59_2', 'romanos_6_23'] },
                { day: 2, topic: 'gracia', readings: ['efesios_2_8', 'romanos_11_6', 'tito_2_11'] }
                // ... continues for 30 days
            ]
        },
        'spiritual_growth': {
            name: 'Crecimiento Espiritual',
            description: 'Pasajes para el desarrollo espiritual',
            duration: 90,
            type: 'devotional',
            difficulty: 'intermediate',
            categories: ['oración', 'estudio', 'servicio', 'adoración'],
            schedule: [
                { day: 1, category: 'oración', readings: ['mateo_6_9', 'lucas_11_1', '1_tesalonicenses_5_17'] }
                // ... continues for 90 days
            ]
        }
    },
    
    // Study notes and commentary
    studyNotes: {
        'juan_3_16': {
            historical: 'Conversación nocturna entre Jesús y Nicodemo, líder fariseo.',
            theological: 'Texto central del evangelio: amor de Dios, sacrificio del Hijo, respuesta de fe.',
            practical: 'Base para entender la salvación por gracia mediante la fe.',
            crossCultural: 'Concepto universal del amor sacrificial de Dios.',
            application: 'Invitación personal a creer en Cristo para vida eterna.'
        },
        'filipenses_4_13': {
            historical: 'Pablo escribió desde prisión en Roma, c. 60-62 d.C.',
            theological: 'Capacitación divina para todas las circunstancias de la vida.',
            practical: 'No es autosuficiencia, sino dependencia en Cristo.',
            crossCultural: 'Principio universal de fortaleza espiritual.',
            application: 'Confianza en Cristo para enfrentar desafíos.'
        }
    },
    
    // Daily devotional content
    devotionals: {
        'verse_of_day': [
            {
                date: '2024-01-01',
                verse: 'filipenses_4_13',
                title: 'Fortaleza en Cristo',
                reflection: 'Este versículo no promete que podremos hacer todo lo que queramos, sino que Cristo nos dará fuerzas para todo lo que Él quiere que hagamos.',
                prayer: 'Señor, ayúdame a depender de tu fortaleza en lugar de la mía propia.',
                action: 'Identifica un área donde necesitas la fortaleza de Cristo hoy.'
            },
            {
                date: '2024-01-02', 
                verse: 'juan_3_16',
                title: 'El amor incondicional',
                reflection: 'El amor de Dios no depende de nuestro comportamiento, sino de Su carácter perfecto y eterno.',
                prayer: 'Padre, gracias por amarme tanto que diste a tu Hijo por mí.',
                action: 'Comparte el amor de Dios con alguien que lo necesite.'
            }
        ]
    },
    
    // Memorization helpers
    memorization: {
        popular_verses: [
            'juan_3_16',
            'filipenses_4_13',
            'salmos_23_1',
            'romanos_8_28',
            'jeremias_29_11',
            'isaias_41_10',
            'proverbios_3_5',
            '2_timoteo_3_16'
        ],
        
        techniques: {
            'repetition_spaced': {
                name: 'Repetición Espaciada',
                description: 'Sistema optimizado basado en el algoritmo SuperMemo',
                intervals: [1, 3, 7, 14, 30, 90], // días
                difficulty_factors: {
                    easy: 2.5,
                    medium: 2.0,
                    hard: 1.5
                }
            },
            'chunking': {
                name: 'Fragmentación',
                description: 'Dividir versículos en partes pequeñas y memorables',
                max_chunk_size: 5, // palabras
                overlap: 2 // palabras de solapamiento
            },
            'visualization': {
                name: 'Visualización',
                description: 'Asociar versículos con imágenes mentales',
                categories: ['paisajes', 'acciones', 'emociones', 'objetos']
            }
        }
    },
    
    // Prayer guides
    prayerGuides: {
        'acts_model': {
            name: 'Modelo ACTS',
            description: 'Adoración, Confesión, Thanksgiving (Gratitud), Súplica',
            structure: [
                {
                    step: 'adoracion',
                    duration: 5,
                    description: 'Alaba a Dios por quien es',
                    prompts: [
                        'Reflexiona sobre los atributos de Dios',
                        'Recuerda Sus obras poderosas',
                        'Exalta Su nombre santo'
                    ],
                    verses: ['salmos_95_6', 'salmos_100_4', 'apocalipsis_4_11']
                },
                {
                    step: 'confesion',
                    duration: 3,
                    description: 'Confiesa tus pecados a Dios',
                    prompts: [
                        'Examina tu corazón',
                        'Reconoce pecados específicos',
                        'Acepta el perdón de Dios'
                    ],
                    verses: ['1_juan_1_9', 'salmos_51_10', 'salmos_139_23']
                },
                {
                    step: 'gratitud',
                    duration: 4,
                    description: 'Agradece a Dios por Sus bendiciones',
                    prompts: [
                        'Cuenta las bendiciones recibidas',
                        'Agradece por la salvación',
                        'Reconoce Su providencia'
                    ],
                    verses: ['1_tesalonicenses_5_18', 'salmos_136_1', 'filipenses_4_6']
                },
                {
                    step: 'suplica',
                    duration: 8,
                    description: 'Presenta tus peticiones a Dios',
                    prompts: [
                        'Ora por tus necesidades',
                        'Intercede por otros',
                        'Busca la voluntad de Dios'
                    ],
                    verses: ['mateo_7_7', 'filipenses_4_6', '1_timoteo_2_1']
                }
            ]
        }
    },
    
    // Study tools data
    studyTools: {
        concordance: {
            // Sample concordance entries
            'amor': [
                { verse: 'juan_3_16', context: 'amó Dios al mundo' },
                { verse: '1_corintios_13_4', context: 'el amor es sufrido' },
                { verse: '1_juan_4_8', context: 'Dios es amor' }
            ],
            'fe': [
                { verse: 'hebreos_11_1', context: 'la fe es la certeza' },
                { verse: 'romanos_10_17', context: 'la fe es por el oír' },
                { verse: 'efesios_2_8', context: 'por gracia sois salvos por medio de la fe' }
            ]
        },
        
        maps: {
            'palestine_nt': {
                name: 'Palestina en tiempos del NT',
                regions: ['judea', 'samaria', 'galilea', 'perea'],
                cities: {
                    'jerusalen': { lat: 31.7683, lng: 35.2137, importance: 'high' },
                    'nazaret': { lat: 32.7009, lng: 35.3035, importance: 'high' },
                    'capernaum': { lat: 32.8815, lng: 35.5752, importance: 'medium' }
                }
            }
        },
        
        timelines: {
            'nt_chronology': {
                name: 'Cronología del Nuevo Testamento',
                events: [
                    { year: -4, event: 'Nacimiento de Jesús', reference: 'mateo_2_1' },
                    { year: 30, event: 'Crucifixión y Resurrección', reference: 'mateo_27_50' },
                    { year: 33, event: 'Conversión de Pablo', reference: 'hechos_9_3' },
                    { year: 49, event: 'Concilio de Jerusalén', reference: 'hechos_15_6' }
                ]
            }
        }
    },
    
    // API methods
    methods: {
        // Get verse text
        getVerse(book, chapter, verse) {
            const chapterKey = `${book}_${chapter}`;
            const chapterData = this.chapters[chapterKey];
            return chapterData?.verses[verse] || null;
        },
        
        // Get full chapter
        getChapter(book, chapter) {
            const chapterKey = `${book}_${chapter}`;
            return this.chapters[chapterKey] || null;
        },
        
        // Search verses
        searchVerses(query, books = null) {
            const results = [];
            const searchTerm = query.toLowerCase();
            
            for (const [chapterKey, chapterData] of Object.entries(this.chapters)) {
                if (books && !books.includes(chapterData.book)) continue;
                
                for (const [verseNum, verseText] of Object.entries(chapterData.verses)) {
                    if (verseText.toLowerCase().includes(searchTerm)) {
                        results.push({
                            book: chapterData.book,
                            chapter: chapterData.chapter,
                            verse: parseInt(verseNum),
                            text: verseText,
                            reference: `${chapterData.book}_${chapterData.chapter}_${verseNum}`
                        });
                    }
                }
            }
            
            return results;
        },
        
        // Get cross references
        getCrossReferences(reference) {
            return this.crossReferences[reference] || [];
        },
        
        // Get word study
        getWordStudy(word) {
            return this.wordStudy[word.toLowerCase()] || null;
        },
        
        // Get reading plan
        getReadingPlan(planId) {
            return this.readingPlans[planId] || null;
        },
        
        // Get daily devotional
        getDailyDevotional(date = null) {
            const targetDate = date || new Date().toISOString().split('T')[0];
            return this.devotionals.verse_of_day.find(d => d.date === targetDate) || 
                   this.devotionals.verse_of_day[0]; // fallback
        },
        
        // Get memorization data
        getMemorizationHelp(reference) {
            const verse = this.getVerseByReference(reference);
            if (!verse) return null;
            
            return {
                text: verse,
                chunks: this.chunkVerse(verse),
                difficulty: this.calculateDifficulty(verse),
                techniques: this.memorization.techniques
            };
        },
        
        // Helper methods
        getVerseByReference(reference) {
            const parts = reference.split('_');
            if (parts.length !== 3) return null;
            
            const [book, chapter, verse] = parts;
            return this.getVerse(book, parseInt(chapter), parseInt(verse));
        },
        
        chunkVerse(verseText) {
            const words = verseText.split(' ');
            const chunks = [];
            const chunkSize = this.memorization.techniques.chunking.max_chunk_size;
            
            for (let i = 0; i < words.length; i += chunkSize) {
                chunks.push(words.slice(i, i + chunkSize).join(' '));
            }
            
            return chunks;
        },
        
        calculateDifficulty(verseText) {
            const wordCount = verseText.split(' ').length;
            const complexWords = verseText.split(' ').filter(word => word.length > 8).length;
            
            if (wordCount <= 10 && complexWords <= 2) return 'easy';
            if (wordCount <= 25 && complexWords <= 5) return 'medium';
            return 'hard';
        },
        
        // Format verse reference for display
        formatReference(book, chapter, verse) {
            const bookData = this.books[book];
            if (!bookData) return `${book} ${chapter}:${verse}`;
            
            return `${bookData.name} ${chapter}:${verse}`;
        },
        
        // Get book info
        getBookInfo(bookId) {
            return this.books[bookId] || null;
        },
        
        // Get books by category
        getBooksByCategory(category) {
            return Object.entries(this.books)
                .filter(([id, book]) => book.category === category)
                .map(([id, book]) => ({ id, ...book }));
        },
        
        // Get testament books
        getTestamentBooks(testament) {
            return Object.entries(this.books)
                .filter(([id, book]) => book.testament === testament)
                .sort((a, b) => a[1].order - b[1].order)
                .map(([id, book]) => ({ id, ...book }));
        }
    }
};

// Extend window.BibleData with complete data
if (window.BibleData) {
    Object.assign(window.BibleData, window.BibleDataComplete);
} else {
    window.BibleData = window.BibleDataComplete;
}

console.log('📖 Complete Bible data loaded successfully');