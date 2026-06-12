use("porto_alegre_alema");

// As imagens da pasta UPAA-frontend/public/images foram enviadas para este bucket S3
// (mesmo nome/caminho). As URLs abaixo apontam para esses objetos públicos.
const S3 = "https://liderpoaalema.s3.us-east-2.amazonaws.com";

const adminId = ObjectId("000000000000000000000000");
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
        portrait_url: `${S3}/images/theodor.png`,
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
        // Os icon_url relativos (/icons/*.svg) são servidos pelo frontend a partir
        // de UPAA-frontend/public/icons/.
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
                url: `${S3}/images/margs/planta_baixa.jpg`,
                type: "planta_baixa",
                caption: {
                    pt: "Planta baixa do segundo pavimento",
                    en: "Floor plan of the second floor",
                    de: "Grundriss des zweiten Obergeschosses"
                }
            },
            {
                url: `${S3}/images/margs/fachadas.jpg`,
                type: "fachada",
                caption: {
                    pt: "Detalhe da fachada com colunas e ornamentos",
                    en: "Façade detail with columns and ornaments",
                    de: "Fassadendetail mit Säulen und Ornamenten"
                }
            },
            {
                url: `${S3}/images/margs/fotos_externas.jpg`,
                type: "externa",
                caption: {
                    pt: "Vista externa do edifício na Praça da Alfândega",
                    en: "Exterior view of the building at Praça da Alfândega",
                    de: "Außenansicht des Gebäudes an der Praça da Alfândega"
                }
            },
            {
                url: `${S3}/images/Margs_2.jpg`,
                type: "externa",
                caption: {
                    pt: "Vista externa do MARGS",
                    en: "Exterior view of MARGS",
                    de: "Außenansicht des MARGS"
                }
            },
            {
                url: `${S3}/images/margs/Margs.jpg`,
                type: "externa",
                caption: {
                    pt: "Edifício do MARGS",
                    en: "MARGS building",
                    de: "MARGS-Gebäude"
                }
            },
            {
                url: `${S3}/images/margs/fotos_internas.jpg`,
                type: "interna",
                caption: {
                    pt: "Saguão interno com abóbada",
                    en: "Internal hall with vaulted ceiling",
                    de: "Innenhalle mit Gewölbedecke"
                }
            },
            {
                url: `${S3}/images/margs/escadaria_interna.jpeg`,
                type: "interna",
                caption: {
                    pt: "Escadaria interna",
                    en: "Internal staircase",
                    de: "Innentreppe"
                }
            },
            {
                url: `${S3}/images/margs/superior.jpeg`,
                type: "interna",
                caption: {
                    pt: "Vista do pavimento superior",
                    en: "View of the upper floor",
                    de: "Blick auf das Obergeschoss"
                }
            },
            {
                url: `${S3}/images/margs/teto.jpeg`,
                type: "interna",
                caption: {
                    pt: "Detalhe do teto ornamentado",
                    en: "Detail of the ornate ceiling",
                    de: "Detail der verzierten Decke"
                }
            },
            {
                url: `${S3}/images/margs/pintura.jpeg`,
                type: "interna",
                caption: {
                    pt: "Pintura decorativa",
                    en: "Decorative painting",
                    de: "Dekorative Malerei"
                }
            },
            {
                url: `${S3}/images/margs/esculturas.jpeg`,
                type: "interna",
                caption: {
                    pt: "Esculturas e ornamentos internos",
                    en: "Internal sculptures and ornaments",
                    de: "Innenskulpturen und Ornamente"
                }
            },
            {
                url: `${S3}/images/margs/esculturas2.jpeg`,
                type: "interna",
                caption: {
                    pt: "Detalhe de esculturas internas",
                    en: "Detail of internal sculptures",
                    de: "Detail der Innenskulpturen"
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
                // O nome do arquivo tem espaço, codificado como %20 na URL do objeto S3.
                url: `${S3}/images/Memorial%20RS.jpg`,
                type: "fachada",
                caption: {
                    pt: "Fachada do Memorial do Rio Grande do Sul",
                    en: "Façade of the Rio Grande do Sul Memorial",
                    de: "Fassade des Memorial von Rio Grande do Sul"
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
        imageURL: `${S3}/images/theodor.png`,
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
        imageURL: `${S3}/images/home/imigracao-alema-rs.jpg`,
        imgSubtitle: {
            pt: "Registros da imigração alemã no Rio Grande do Sul",
            en: "Records of German immigration in Rio Grande do Sul",
            de: "Aufzeichnungen der deutschen Einwanderung in Rio Grande do Sul"
        },
        title: {
            pt: "Imigração alemã",
            en: "German immigration",
            de: "Deutsche Einwanderung"
        },
        subtitle: {
            pt: "Das colônias ao Centro Histórico",
            en: "From colonies to the Historic Center",
            de: "Von den Kolonien ins historische Zentrum"
        },
        content: {
            pt: "A partir de 1824, imigrantes alemães chegaram ao Rio Grande do Sul e estabeleceram colônias que influenciaram profundamente a cultura, a economia e a arquitetura da região. Em Porto Alegre, essa presença se materializou em edificações do Centro Histórico que até hoje marcam a paisagem urbana da cidade.",
            en: "From 1824 onwards, German immigrants arrived in Rio Grande do Sul and established colonies that deeply influenced the culture, economy and architecture of the region. In Porto Alegre, this presence materialized in buildings in the Historic Center that still mark the city's urban landscape today.",
            de: "Ab 1824 kamen deutsche Einwanderer nach Rio Grande do Sul und gründeten Kolonien, die Kultur, Wirtschaft und Architektur der Region nachhaltig prägten. In Porto Alegre materialisierte sich diese Präsenz in Gebäuden des historischen Zentrums, die das Stadtbild bis heute prägen."
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
                id: "inst-margs",
                title: {
                    pt: "MARGS",
                    en: "MARGS",
                    de: "MARGS"
                },
                description: {
                    pt: "Museu instalado em edifício histórico associado a Theodor Wiederspahn.",
                    en: "Museum housed in a historic building associated with Theodor Wiederspahn.",
                    de: "Museum in einem historischen Gebäude, das mit Theodor Wiederspahn verknüpft ist."
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
                imageURL: `${S3}/images/Margs_2.jpg`,
                order: 1
            },
            {
                id: "inst-memorial",
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
                imageURL: `${S3}/images/Memorial%20RS.jpg`,
                order: 2
            }
        ]
    },
    updatedById: adminId,
    updatedAt: new Date()
});

print("Seed inserida com sucesso.");