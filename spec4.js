const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Répertoire contenant les données
const repertoirePrincipal = path.join(__dirname, 'data');

// Mapping des jours abrégés vers les noms complets
const joursMap = {
    L: 'Lundi',
    MA: 'Mardi',
    ME: 'Mercredi',
    J: 'Jeudi',
    V: 'Vendredi',
    S: 'Samedi'
};

// Fonction pour analyser les créneaux occupés dans tous les fichiers
function analyserOccupations(jour, heureDebut, heureFin) {
    const sallesOccupees = new Set(); // Stocker les salles occupées pour ce créneau
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

                        if (joursMap[jourAbrege] === jour) {
                            const debut = heures[0];
                            const fin = heures[1];

                            // Si le créneau occupé chevauche le créneau demandé
                            if (debut < heureFin && fin > heureDebut) {
                                sallesOccupees.add(salle);
                            }
                        }
                    }
                });
            }
        });
    });

    return sallesOccupees;
}

// Fonction pour lister les salles disponibles pour un créneau donné
function rechercherSallesDisponibles(jour, heureDebut, heureFin) {
    console.log(`\nRecherche des salles disponibles le ${jour} entre ${heureDebut}h et ${heureFin}h...\n`);

    const sallesOccupees = analyserOccupations(jour, heureDebut, heureFin);

    // Parcourir toutes les salles
    const toutesLesSalles = new Set();
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
                    if (salleMatch) {
                        toutesLesSalles.add(salleMatch[1]);
                    }
                });
            }
        });
    });

    // Calculer les salles libres
    const sallesLibres = Array.from(toutesLesSalles).filter(salle => !sallesOccupees.has(salle));

    // Afficher les résultats
    if (sallesLibres.length > 0) {
        console.log(`Salles disponibles : ${sallesLibres.join(', ')}`);
    } else {
        console.log('Aucune salle disponible pour ce créneau.');
    }
}

// Interface utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Entrez le jour (ex : Lundi, Mardi) : ', (jour) => {
    rl.question('Entrez l’heure de début (ex : 10) : ', (debut) => {
        rl.question('Entrez l’heure de fin (ex : 12) : ', (fin) => {
            const heureDebut = parseInt(debut, 10);
            const heureFin = parseInt(fin, 10);

            if (joursMap[jour.substring(0, 2).toUpperCase()]) {
                rechercherSallesDisponibles(jour, heureDebut, heureFin);
            } else {
                console.log('Jour invalide. Veuillez réessayer.');
            }

            rl.close();
        });
    });
});
