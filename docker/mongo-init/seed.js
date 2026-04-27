use("porto_alegre_alema");

const adminId = new ObjectId();
const architectId = new ObjectId();
const margsId = new ObjectId();
const memorialId = new ObjectId();

db.admin_users.deleteMany({});
db.landing_page.deleteMany({});
db.architects.deleteMany({});
db.buildings.deleteMany({});

db.admin_users.insertOne({
    _id: adminId,
    name: "Administrador Principal",
    email: "admin@poaalema.com",
    passwordHash: "$2b$10$seed.exemplo.hash",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date()
});

db.architects.insertOne({
    _id: architectId,
    slug: "theodor-wiederspahn",
    status: "published",
    name: {
        first: "Theodor",
        last: "Wiederspahn",
        full: "Theodor Wiederspahn"
    },
    media: {
        portrait_url: "/images/architects/theodor-wiederspahn.jpg",
        alt_text: {
            pt: "Retrato de Theodor Wiederspahn",
            en: "Portrait of Theodor Wiederspahn",
            de: "Porträt von Theodor Wiederspahn"
        }
    },
    birth: {
        date: {
            day: 19,
            month: 2,
            year: 1878,
            iso: "1878-02-19"
        },
        place: {
            city: "Wiesbaden",
            country: "Alemanha"
        }
    },
    death: {
        date: {
            day: 12,
            month: 11,
            year: 1953,
            iso: "1953-11-12"
        },
        place: {
            city: "Porto Alegre",
            country: "Brasil"
        }
    },
    citizenship: "alemã",
    occupation: "Arquiteto",
    about: {
        pt: "Theodor Wiederspahn foi um arquiteto alemão de forte atuação em Porto Alegre e no Rio Grande do Sul. Seu nome está associado a edifícios emblemáticos do Centro Histórico e da Praça da Alfândega, tornando-se uma referência importante para a memória arquitetônica da cidade.",
        en: "Theodor Wiederspahn was a German architect with a strong presence in Porto Alegre and Rio Grande do Sul. His name is associated with landmark buildings in the Historic Center and Praça da Alfândega, making him an important figure in the city's architectural memory.",
        de: "Theodor Wiederspahn war ein deutscher Architekt mit starker Präsenz in Porto Alegre und im Bundesstaat Rio Grande do Sul. Sein Name ist mit bedeutenden Gebäuden im historischen Zentrum und an der Praça da Alfândega verbunden."
    },
    characteristics: {
        style: {
            pt: "Arquitetura eclética com forte presença ornamental e diálogo com a paisagem urbana do início do século XX.",
            en: "Eclectic architecture with rich ornamentation and a strong dialogue with the urban landscape of the early twentieth century.",
            de: "Ekletische Architektur mit reicher Ornamentik und engem Bezug zur Stadtlandschaft des frühen 20. Jahrhunderts."
        },
        influences: {
            pt: "Formação europeia e adaptação ao contexto urbano e institucional de Porto Alegre.",
            en: "European training adapted to the urban and institutional context of Porto Alegre.",
            de: "Europäische Ausbildung, angepasst an den städtischen und institutionellen Kontext von Porto Alegre."
        },
        legacy: {
            pt: "Seu legado permanece vivo em edifícios históricos que hoje abrigam instituições culturais e ajudam a contar a história da cidade.",
            en: "His legacy lives on in historic buildings that now house cultural institutions and help tell the city's history.",
            de: "Sein Erbe lebt in historischen Gebäuden weiter, die heute kulturelle Institutionen beherbergen und die Geschichte der Stadt erzählen."
        }
    },
    createdById: adminId,
    updatedById: adminId,
    createdAt: new Date(),
    updatedAt: new Date()
});

db.buildings.insertMany([
    {
        _id: margsId,
        slug: "margs-museu-de-arte-do-rio-grande-do-sul",
        status: "published",
        qrCodeKey: "POA-TW-MARGS-001",
        architectId: architectId,
        name: {
            pt: "Museu de Arte do Rio Grande do Sul Ado Malagoli",
            en: "Rio Grande do Sul Museum of Art Ado Malagoli",
            de: "Kunstmuseum des Bundesstaates Rio Grande do Sul Ado Malagoli"
        },
        originalName: {
            pt: "Delegacia Fiscal",
            en: "Fiscal Delegation Building",
            de: "Gebäude der Steuerbehörde"
        },
        location: {
            pt: "Praça da Alfândega, s/n - Centro Histórico, Porto Alegre - RS, Brasil",
            en: "Praça da Alfândega, downtown historic center, Porto Alegre, RS, Brazil",
            de: "Praça da Alfândega, historisches Zentrum, Porto Alegre, RS, Brasilien"
        },
        coordinates: {
            lat: -30.0299,
            lng: -51.2316
        },
        constructionPeriod: "1913",
        constructor: "Firma de Rodolfo Ahrons",
        ornamentsAuthor: "Oficina de João Vicente Friederichs",
        builtArea: "4.855 m²",
        currentOccupation: {
            pt: "Museu de arte",
            en: "Art museum",
            de: "Kunstmuseum"
        },
        restorationAndHeritage: {
            pt: "Edifício histórico tombado e reutilizado como sede do MARGS desde 1978.",
            en: "Historic listed building reused as the headquarters of MARGS since 1978.",
            de: "Historisches denkmalgeschütztes Gebäude, seit 1978 Sitz des MARGS."
        },
        description: {
            pt: "Edificação monumental da Praça da Alfândega, projetada por Theodor Wiederspahn para abrigar originalmente a Delegacia Fiscal. Hoje, o prédio é um dos marcos culturais mais reconhecidos de Porto Alegre.",
            en: "A monumental building in Praça da Alfândega, designed by Theodor Wiederspahn to originally house the Fiscal Delegation. Today it is one of Porto Alegre's most recognized cultural landmarks.",
            de: "Ein monumentales Gebäude an der Praça da Alfândega, entworfen von Theodor Wiederspahn ursprünglich für die Steuerbehörde. Heute ist es eines der bekanntesten Kulturdenkmäler Porto Alegres."
        },
        history: {
            pt: "Construído em 1913, o edifício foi projetado por Theo Wiederspahn e mais tarde passou a sediar o MARGS, consolidando-se como referência artística e patrimonial no Centro Histórico.",
            en: "Built in 1913, the building was designed by Theo Wiederspahn and later became the home of MARGS, establishing itself as an artistic and heritage landmark in the historic center.",
            de: "Das 1913 errichtete Gebäude wurde von Theo Wiederspahn entworfen und wurde später Sitz des MARGS. Es gilt heute als künstlerisches und denkmalpflegerisches Wahrzeichen des historischen Zentrums."
        },
        features: [
            {
                title: {
                    pt: "Arquitetura monumental",
                    en: "Monumental architecture",
                    de: "Monumentale Architektur"
                },
                description: {
                    pt: "Fachada marcante e presença urbana forte na Praça da Alfândega.",
                    en: "Striking façade and strong urban presence at Praça da Alfândega.",
                    de: "Markante Fassade und starke städtebauliche Präsenz an der Praça da Alfândega."
                },
                icon_url: "/icons/monumental.svg"
            },
            {
                title: {
                    pt: "Uso cultural",
                    en: "Cultural use",
                    de: "Kulturelle Nutzung"
                },
                description: {
                    pt: "Atualmente abriga uma das principais instituições museológicas do estado.",
                    en: "Currently houses one of the state's main museum institutions.",
                    de: "Beherbergt heute eine der wichtigsten musealen Institutionen des Bundesstaates."
                },
                icon_url: "/icons/museum.svg"
            }
        ],
        mediaGallery: [
            {
                url: "/images/buildings/margs/fachada-1.jpg",
                type: "fachada",
                caption: {
                    pt: "Fachada principal do MARGS",
                    en: "Main façade of MARGS",
                    de: "Hauptfassade des MARGS"
                }
            },
            {
                url: "/images/buildings/margs/externa-1.jpg",
                type: "externa",
                caption: {
                    pt: "Vista externa do edifício na Praça da Alfândega",
                    en: "Exterior view of the building at Praça da Alfândega",
                    de: "Außenansicht des Gebäudes an der Praça da Alfândega"
                }
            }
        ],
        sources: [
            "MARGS - Sobre o Museu",
            "Turismo RS - Museu de Arte do Rio Grande do Sul Ado Malagoli"
        ],
        createdById: adminId,
        updatedById: adminId,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: memorialId,
        slug: "memorial-do-rio-grande-do-sul",
        status: "published",
        qrCodeKey: "POA-TW-MEMORIAL-002",
        architectId: architectId,
        name: {
            pt: "Memorial do Rio Grande do Sul",
            en: "Rio Grande do Sul Memorial",
            de: "Memorial von Rio Grande do Sul"
        },
        originalName: {
            pt: "Correios e Telégrafos",
            en: "Post and Telegraph Building",
            de: "Post- und Telegrafengebäude"
        },
        location: {
            pt: "Praça da Alfândega - Centro Histórico, Porto Alegre - RS, Brasil",
            en: "Praça da Alfândega, Historic Center, Porto Alegre, RS, Brazil",
            de: "Praça da Alfândega, historisches Zentrum, Porto Alegre, RS, Brasilien"
        },
        coordinates: {
            lat: -30.0305,
            lng: -51.2311
        },
        constructionPeriod: "1910-1913",
        constructor: "Não definido na seed inicial",
        ornamentsAuthor: "Não definido na seed inicial",
        builtArea: "Não definido na seed inicial",
        currentOccupation: {
            pt: "Centro cultural e espaço de memória",
            en: "Cultural center and memory space",
            de: "Kulturzentrum und Erinnerungsort"
        },
        restorationAndHeritage: {
            pt: "Prédio histórico tombado pelo Iphan, com obra de restauração iniciada em 2025.",
            en: "Historic building listed by Iphan, with restoration works started in 2025.",
            de: "Historisches, vom Iphan geschütztes Gebäude, dessen Restaurierung 2025 begonnen hat."
        },
        description: {
            pt: "Edifício histórico da Praça da Alfândega projetado por Theodor Wiederspahn, originalmente ligado aos Correios e Telégrafos. Hoje abriga o Memorial do RS e outras instituições culturais.",
            en: "Historic building at Praça da Alfândega designed by Theodor Wiederspahn, originally linked to the Post and Telegraph service. Today it houses the Memorial do RS and other cultural institutions.",
            de: "Historisches Gebäude an der Praça da Alfândega, entworfen von Theodor Wiederspahn und ursprünglich für Post und Telegrafie bestimmt. Heute beherbergt es das Memorial do RS und weitere kulturelle Einrichtungen."
        },
        history: {
            pt: "Construído entre 1910 e 1913, o prédio tornou-se uma referência do patrimônio arquitetônico do Centro Histórico de Porto Alegre e segue em processo de preservação e restauração.",
            en: "Built between 1910 and 1913, the building became a heritage landmark in Porto Alegre's historic center and remains under preservation and restoration efforts.",
            de: "Zwischen 1910 und 1913 erbaut, wurde das Gebäude zu einem bedeutenden Baudenkmal im historischen Zentrum von Porto Alegre und wird weiterhin erhalten und restauriert."
        },
        features: [
            {
                title: {
                    pt: "Patrimônio histórico",
                    en: "Historic heritage",
                    de: "Historisches Erbe"
                },
                description: {
                    pt: "Edifício simbólico do Centro Histórico e da Praça da Alfândega.",
                    en: "Symbolic building in the historic center and Praça da Alfândega.",
                    de: "Symbolisches Gebäude des historischen Zentrums und der Praça da Alfândega."
                },
                icon_url: "/icons/heritage.svg"
            },
            {
                title: {
                    pt: "Memória institucional",
                    en: "Institutional memory",
                    de: "Institutionelles Gedächtnis"
                },
                description: {
                    pt: "Abriga espaços dedicados à memória e à cultura do Rio Grande do Sul.",
                    en: "Houses spaces dedicated to the memory and culture of Rio Grande do Sul.",
                    de: "Beherbergt Räume, die dem Gedächtnis und der Kultur von Rio Grande do Sul gewidmet sind."
                },
                icon_url: "/icons/archive.svg"
            }
        ],
        mediaGallery: [
            {
                url: "/images/buildings/memorial/fachada-1.jpg",
                type: "fachada",
                caption: {
                    pt: "Fachada do Memorial do Rio Grande do Sul",
                    en: "Façade of the Rio Grande do Sul Memorial",
                    de: "Fassade des Memorial von Rio Grande do Sul"
                }
            },
            {
                url: "/images/buildings/memorial/externa-1.jpg",
                type: "externa",
                caption: {
                    pt: "Vista externa do prédio histórico",
                    en: "Exterior view of the historic building",
                    de: "Außenansicht des historischen Gebäudes"
                }
            }
        ],
        sources: [
            "Secretaria da Cultura do RS - Memorial do Rio Grande do Sul inicia obra de restauração"
        ],
        createdById: adminId,
        updatedById: adminId,
        createdAt: new Date(),
        updatedAt: new Date()
    }
]);

db.landing_page.insertOne({
    _id: new ObjectId(),
    mainTitle: {
        pt: "Uma Porto Alegre alemã",
        en: "A German Porto Alegre",
        de: "Ein deutsches Porto Alegre"
    },
    subtitle: {
        pt: "Arquitetura, memória e cidade a partir do legado de Theodor Wiederspahn.",
        en: "Architecture, memory and city through the legacy of Theodor Wiederspahn.",
        de: "Architektur, Erinnerung und Stadt aus dem Vermächtnis von Theodor Wiederspahn."
    },
    architectSection: {
        imageURL: "/images/architects/theodor-wiederspahn.jpg",
        imageSubtitle: {
            pt: "Theodor Wiederspahn",
            en: "Theodor Wiederspahn",
            de: "Theodor Wiederspahn"
        },
        title: {
            pt: "O arquiteto",
            en: "The architect",
            de: "Der Architekt"
        },
        subtitle: {
            pt: "Um nome central na paisagem de Porto Alegre",
            en: "A central name in Porto Alegre's landscape",
            de: "Ein zentraler Name in der Stadtlandschaft von Porto Alegre"
        },
        content: {
            pt: "A trajetória de Theodor Wiederspahn ajuda a entender parte importante da formação visual e simbólica do Centro Histórico de Porto Alegre.",
            en: "The trajectory of Theodor Wiederspahn helps explain an important part of the visual and symbolic formation of Porto Alegre's historic center.",
            de: "Die Laufbahn von Theodor Wiederspahn hilft, einen wichtigen Teil der visuellen und symbolischen Prägung des historischen Zentrums von Porto Alegre zu verstehen."
        },
        CTA: {
            label: {
                pt: "Conhecer arquiteto",
                en: "Meet the architect",
                de: "Architekten kennenlernen"
            },
            target: "/architects/theodor-wiederspahn",
            icon: "user"
        },
        order: 1
    },
    immigrationSection: {
        imageURL: "/images/home/porto-alegre-centro-historico.jpg",
        imgSubtitle: {
            pt: "Centro Histórico de Porto Alegre",
            en: "Porto Alegre Historic Center",
            de: "Historisches Zentrum von Porto Alegre"
        },
        title: {
            pt: "Cidade e memória",
            en: "City and memory",
            de: "Stadt und Erinnerung"
        },
        subtitle: {
            pt: "Patrimônio urbano e presença alemã",
            en: "Urban heritage and German presence",
            de: "Städtisches Erbe und deutsche Präsenz"
        },
        content: {
            pt: "A arquitetura do início do século XX revela conexões entre imigração, urbanização e identidade cultural em Porto Alegre.",
            en: "Early twentieth-century architecture reveals connections between immigration, urbanization and cultural identity in Porto Alegre.",
            de: "Die Architektur des frühen 20. Jahrhunderts zeigt Verbindungen zwischen Einwanderung, Urbanisierung und kultureller Identität in Porto Alegre."
        },
        order: 2
    },
    institutionsSection: {
        title: {
            pt: "Instituições em destaque",
            en: "Featured institutions",
            de: "Hervorgehobene Institutionen"
        },
        institutions: [
            {
                title: {
                    pt: "MARGS",
                    en: "MARGS",
                    de: "MARGS"
                },
                description: {
                    pt: "Museu instalado em edifício histórico associado a Theodor Wiederspahn.",
                    en: "Museum housed in a historic building associated with Theodor Wiederspahn.",
                    de: "Museum in einem historischen Gebäude, das mit Theodor Wiederspahn verbunden ist."
                },
                CTA: {
                    label: {
                        pt: "Ver edifício",
                        en: "View building",
                        de: "Gebäude ansehen"
                    },
                    target: "/buildings/margs-museu-de-arte-do-rio-grande-do-sul",
                    icon: "building"
                },
                order: 1
            },
            {
                title: {
                    pt: "Memorial do RS",
                    en: "Memorial do RS",
                    de: "Memorial do RS"
                },
                description: {
                    pt: "Espaço cultural em prédio histórico da Praça da Alfândega.",
                    en: "Cultural space in a historic Praça da Alfândega building.",
                    de: "Kulturraum in einem historischen Gebäude an der Praça da Alfândega."
                },
                CTA: {
                    label: {
                        pt: "Ver edifício",
                        en: "View building",
                        de: "Gebäude ansehen"
                    },
                    target: "/buildings/memorial-do-rio-grande-do-sul",
                    icon: "landmark"
                },
                order: 2
            }
        ]
    },
    updatedById: adminId,
    updatedAt: new Date()
});

print("Seed inserida com sucesso.");