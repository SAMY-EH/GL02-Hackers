const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Table = require('cli-table3');

// Répertoire principal contenant les données
const repertoirePrincipal = path.join(__dirname, 'data');

// Heures d'ouverture des salles
const horairesOuverture = {
    Lundi: { debut: 8, fin: 22 },
    Mardi: { debut: 8, fin: 22 },
    Mercredi: { debut: 8, fin: 22 },
    Jeudi: { debut: 8, fin: 22 },
    Vendredi: { debut: 8, fin: 22 },
    Samedi: { debut: 8, fin: 12 }
};

// Mapping des abréviations de jours vers les noms complets
const joursMap = {
    L: 'Lundi',
    MA: 'Mardi',
    ME: 'Mercredi',
    J: 'Jeudi',
    V: 'Vendredi',
    S: 'Samedi'
};

// Fonction pour analyser les créneaux occupés d'une salle
function analyserOccupations(nomSalle) {
    const occupations = {}; // Stocker les créneaux occupés par jour
    Object.keys(horairesOuverture).forEach(jour => (occupations[jour] = []));

    let salleTrouvee = false;

    // Parcourir les fichiers pour trouver les créneaux occupés
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
                    const horaireMatch = ligne.match(/H=([A-Z]{1,2}) (\d{2}:\d{2}-\d{2}:\d{2})/);

                    if (salleMatch && horaireMatch) {
                        const salle = salleMatch[1];
                        const jourAbrege = horaireMatch[1];
                        const heures = horaireMatch[2].split('-').map(h => parseInt(h.split(':')[0], 10));

                        if (salle === nomSalle) {
                            salleTrouvee = true;

                            // Convertir le jour abrégé en jour complet
                            const jourComplet = joursMap[jourAbrege];
                            if (jourComplet) {
                                occupations[jourComplet].push({ debut: heures[0], fin: heures[1] });
                            }
                        }
                    }
                });
            }
        });
    });

    return { occupations, salleTrouvee };
}

// Fonction pour afficher les créneaux libres d'une salle
function afficherDisponibilites(nomSalle) {
    console.log(`\nRecherche des disponibilités pour la salle : ${nomSalle}\n`);

    const { occupations, salleTrouvee } = analyserOccupations(nomSalle);

    // Vérifier si la salle a été trouvée
    if (!salleTrouvee) {
        console.log(`Erreur : La salle "${nomSalle}" n'existe pas dans les données.`);
        return;
    }

    // Préparer les résultats à afficher
    const table = new Table({
        head: ['Jour', 'Créneaux disponibles'],
        colWidths: [15, 50]
    });

    Object.keys(horairesOuverture).forEach(jour => {
        const jourOccupations = occupations[jour];
        const libres = [];
        let derniereFin = horairesOuverture[jour].debut;

        jourOccupations.sort((a, b) => a.debut - b.debut);

        // Identifier les créneaux libres
        jourOccupations.forEach(creneau => {
            if (derniereFin < creneau.debut) {
                libres.push(`${derniereFin}h - ${creneau.debut}h`);
            }
            derniereFin = Math.max(derniereFin, creneau.fin);
        });

        // Ajouter le créneau libre après la dernière occupation
        if (derniereFin < horairesOuverture[jour].fin) {
            libres.push(`${derniereFin}h - ${horairesOuverture[jour].fin}h`);
        }

        // Résultat pour chaque jour
        if (libres.length > 0) {
            table.push([jour, libres.join(', ')]);
        } else {
            table.push([jour, 'Aucun créneau libre']);
        }
    });

    console.log(table.toString());
}

// Interface utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Veuillez saisir le nom de la salle pour vérifier ses disponibilités : ', (nomSalle) => {
    nomSalle = nomSalle.toUpperCase();

    console.log('\nRecherche en cours...');
    afficherDisponibilites(nomSalle);

    rl.close();
});
