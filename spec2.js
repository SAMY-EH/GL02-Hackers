// Importer les modules 'fs', 'path', 'readline' et 'cli-table3' pour lire les fichiers, interagir et afficher le tableau
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Table = require('cli-table3');

// Définir le répertoire principal des données
const repertoirePrincipal = path.join(__dirname, 'data');

// Fonction pour lister toutes les salles présentes dans les fichiers edt.cru
function listerSallesDisponibles() {
    const sallesMap = new Map();
    const sousRepertoires = fs.readdirSync(repertoirePrincipal).filter(rep => {
        return fs.lstatSync(path.join(repertoirePrincipal, rep)).isDirectory();
    });

    sousRepertoires.forEach(rep => {
        const cheminSousRepertoire = path.join(repertoirePrincipal, rep);
        const fichiers = fs.readdirSync(cheminSousRepertoire);

        fichiers.forEach(fichier => {
            if (fichier === 'edt.cru') {
                const cheminFichier = path.join(cheminSousRepertoire, fichier);
                const contenu = fs.readFileSync(cheminFichier, 'utf8');
                const lignes = contenu.split('\n');

                lignes.forEach(ligne => {
                    const salleMatch = ligne.match(/S=([A-Z0-9]+)/);
                    if (salleMatch) {
                        const salle = salleMatch[1];
                        if (/^[A-Z]/.test(salle)) {
                            const premiereLettre = salle[0].toUpperCase();
                            if (!sallesMap.has(premiereLettre)) {
                                sallesMap.set(premiereLettre, new Set());
                            }
                            sallesMap.get(premiereLettre).add(salle);
                        }
                    }
                });
            }
        });
    });

    console.log('Liste des salles disponibles :');
    Array.from(sallesMap.keys()).sort().forEach(lettre => {
        console.log(`Salles ${lettre}`);
        Array.from(sallesMap.get(lettre)).sort().forEach(salle => {
            console.log(`- ${salle}`);
        });
        console.log();
    });
}

// Fonction pour trouver la capacité maximale d'une salle
function trouverCapaciteMaximale(nomSalle) {
    let capaciteMaximale = 0;
    let salleTrouvee = false;

    const sousRepertoires = fs.readdirSync(repertoirePrincipal).filter(rep => {
        return fs.lstatSync(path.join(repertoirePrincipal, rep)).isDirectory();
    });

    sousRepertoires.forEach(rep => {
        const cheminSousRepertoire = path.join(repertoirePrincipal, rep);
        const fichiers = fs.readdirSync(cheminSousRepertoire);

        fichiers.forEach(fichier => {
            if (fichier === 'edt.cru') {
                const cheminFichier = path.join(cheminSousRepertoire, fichier);
                const contenu = fs.readFileSync(cheminFichier, 'utf8');
                const lignes = contenu.split('\n').map(ligne => ligne.trim());

                lignes.forEach(ligne => {
                    const salleMatch = ligne.match(/S=([A-Z0-9]+)/);
                    const capaciteMatch = ligne.match(/P=(\d+)/);

                    if (salleMatch && capaciteMatch) {
                        const salle = salleMatch[1];
                        const capacite = parseInt(capaciteMatch[1], 10);
                        if (salle === nomSalle) {
                            salleTrouvee = true;
                            if (capacite > capaciteMaximale) {
                                capaciteMaximale = capacite;
                            }
                        }
                    }
                });
            }
        });
    });

    if (salleTrouvee) {
        console.log(`La capacité maximale de la salle ${nomSalle} est de ${capaciteMaximale} places.`);
    } else {
        console.log(`La salle "${nomSalle}" n'a pas été trouvée dans les données.`);
    }
}

// Fonction pour afficher la capacité maximale des salles d'un bâtiment sous forme de tableau
function afficherCapacitesBâtiment(batiment) {
    const sallesCapacites = [];
    let batimentTrouvé = false;

    const sousRepertoires = fs.readdirSync(repertoirePrincipal).filter(rep => {
        return fs.lstatSync(path.join(repertoirePrincipal, rep)).isDirectory();
    });

    sousRepertoires.forEach(rep => {
        const cheminSousRepertoire = path.join(repertoirePrincipal, rep);
        const fichiers = fs.readdirSync(cheminSousRepertoire);

        fichiers.forEach(fichier => {
            if (fichier === 'edt.cru') {
                const cheminFichier = path.join(cheminSousRepertoire, fichier);
                const contenu = fs.readFileSync(cheminFichier, 'utf8');
                const lignes = contenu.split('\n').map(ligne => ligne.trim());

                lignes.forEach(ligne => {
                    const salleMatch = ligne.match(/S=([A-Z0-9]+)/);
                    const capaciteMatch = ligne.match(/P=(\d+)/);

                    if (salleMatch && capaciteMatch) {
                        const salle = salleMatch[1];
                        const capacite = parseInt(capaciteMatch[1], 10);

                        if (salle.startsWith(batiment)) {
                            batimentTrouvé = true;
                            const existe = sallesCapacites.find((s) => s.salle === salle);
                            if (!existe) {
                                sallesCapacites.push({ salle: salle, capaciteMax: capacite });
                            } else if (capacite > existe.capaciteMax) {
                                existe.capaciteMax = capacite;
                            }
                        }
                    }
                });
            }
        });
    });

    if (batimentTrouvé) {
        const table = new Table({
            head: ['n° de salle', 'Capacité max'],
            colWidths: [20, 20]
        });
        sallesCapacites.sort((a, b) => a.salle.localeCompare(b.salle)).forEach(({ salle, capaciteMax }) => {
            table.push([salle, capaciteMax]);
        });

        console.log(`\nCapacités maximales des salles du bâtiment ${batiment} :`);
        console.log(table.toString());
    } else {
        console.log(`Le bâtiment "${batiment}" n'a pas été trouvé dans les données.`);
    }
}

// Interface utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Souhaitez-vous :\n" +
    "- Réponse A : Saisir le nom d'une salle pour connaitre sa capacité maximale ?\n" +
    "- Réponse B : Consulter la liste de toutes les salles de l'université ?\n" +
    "- Réponse C : Afficher la capacité des salles d'un bâtiment en particulier ?\n" +
    "Veuillez saisir A, B ou C : ", (choix) => {

    if (choix.toLowerCase() === 'a') {
        rl.question('Veuillez saisir le nom de la salle : ', (nomSalle) => {
            trouverCapaciteMaximale(nomSalle.toUpperCase());
            rl.close();
        });
    } else if (choix.toLowerCase() === 'b') {
        listerSallesDisponibles();
        rl.question('Veuillez saisir le nom de la salle pour connaitre sa capacité maximale: ', (nomSalle) => {
            trouverCapaciteMaximale(nomSalle.toUpperCase());
            rl.close();
        }); 
    } else if (choix.toLowerCase() === 'c') {
        rl.question('Veuillez saisir le nom du bâtiment  (A, B, C, D, E, G, I, J, M, N, P ou S) : ', (batiment) => {
            afficherCapacitesBâtiment(batiment.toUpperCase());
            rl.close();
        });
    } else {
        console.log('Choix invalide. Veuillez relancer le programme.');
        rl.close();
    }
});
