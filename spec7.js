const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Table = require('cli-table3');

// Répertoire contenant les données des emplois du temps
const repertoirePrincipal = path.join(__dirname, 'data');

// Horaires d'ouverture des salles
const horairesOuverture = {
    Lundi: { debut: 8, fin: 22 },
    Mardi: { debut: 8, fin: 22 },
    Mercredi: { debut: 8, fin: 22 },
    Jeudi: { debut: 8, fin: 22 },
    Vendredi: { debut: 8, fin: 22 },
    Samedi: { debut: 8, fin: 12 }
};

// Correspondance des jours avec les abréviations
const joursMap = {
    L: 'Lundi',
    MA: 'Mardi',
    ME: 'Mercredi',
    J: 'Jeudi',
    V: 'Vendredi',
    S: 'Samedi'
};

// Fonction pour récupérer toutes les salles présentes dans les fichiers edt.cru
function recupererToutesLesSalles() {
    const sousRepertoires = fs.readdirSync(repertoirePrincipal).filter(rep => {
        return fs.lstatSync(path.join(repertoirePrincipal, rep)).isDirectory();
    });

    const salles = new Set();

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
                        salles.add(salleMatch[1]);
                    }
                });
            }
        });
    });

    return Array.from(salles);
}

// Fonction pour récupérer le taux d'occupation d'une salle
function recupererTauxOccupation(nomSalle, dateDebut, dateFin) {
    const sousRepertoires = fs.readdirSync(repertoirePrincipal).filter(rep => {
        return fs.lstatSync(path.join(repertoirePrincipal, rep)).isDirectory();
    });

    let totalTempsDisponible = 0;
    let totalTempsOccupe = 0;

    // Récupérer les jours et heures de la période spécifiée
    const jours = getJoursEntreDates(dateDebut, dateFin).map(date => {
        const dayIndex = new Date(date).getDay();
        const dayKeys = Object.keys(joursMap);
        return dayKeys[dayIndex]; // Retourne 'L', 'MA', etc.
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
                    const horaireMatch = ligne.match(/H=([A-Z]{1,2}) (\d{2}:\d{2}-\d{2}:\d{2})/);
                    const salleMatch = ligne.match(/S=([A-Z0-9]+)/);

                    if (horaireMatch && salleMatch && salleMatch[1] === nomSalle) {
                        const jourAbrege = horaireMatch[1];
                        const horaires = horaireMatch[2].split('-');
                        const heureDebutEvent = horaires[0];
                        const heureFinEvent = horaires[1];

                        if (jours.includes(jourAbrege)) {
                            console.log(`Événement trouvé pour la salle ${nomSalle} (${joursMap[jourAbrege]}): ${heureDebutEvent}-${heureFinEvent}`);

                            const debutEventMinutes = convertirEnMinutes(heureDebutEvent);
                            const finEventMinutes = convertirEnMinutes(heureFinEvent);

                            if (!isNaN(debutEventMinutes) && !isNaN(finEventMinutes)) {
                                totalTempsOccupe += finEventMinutes - debutEventMinutes;
                            }

                            const horairesJour = horairesOuverture[joursMap[jourAbrege]];
                            if (horairesJour) {
                                totalTempsDisponible += (horairesJour.fin - horairesJour.debut) * 60;
                            }
                        }
                    }
                });
            }
        });
    });

    if (totalTempsDisponible > 0) {
        return ((totalTempsOccupe / totalTempsDisponible) * 100).toFixed(2);
    } else {
        return 'N/A';
    }
}

// Fonction pour obtenir les jours entre deux dates
function getJoursEntreDates(dateDebut, dateFin) {
    const jours = [];
    const start = new Date(dateDebut);
    const end = new Date(dateFin);

    while (start <= end) {
        jours.push(start.toISOString().slice(0, 10)); // Format YYYY-MM-DD
        start.setDate(start.getDate() + 1);
    }

    return jours;
}

// Convertir l'heure au format HH:mm en minutes depuis minuit
function convertirEnMinutes(heure) {
    const [heures, minutes] = heure.split(':').map(Number);
    return heures * 60 + minutes;
}

// Afficher les résultats sous forme de tableau
function afficherVisualisation(tauxOccupationParSalle) {
    const table = new Table({
        head: ['Salle', 'Taux d\'occupation (%)'],
        colWidths: [20, 25]
    });

    Object.keys(tauxOccupationParSalle).forEach(salle => {
        table.push([salle, tauxOccupationParSalle[salle]]);
    });

    console.log(table.toString());
}

// Interface utilisateur pour entrer les dates
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Veuillez saisir la date de début (format : YYYYMMDD) : ', (dateDebut) => {
    rl.question('Veuillez saisir la date de fin (format : YYYYMMDD) : ', (dateFin) => {
        const toutesLesSalles = recupererToutesLesSalles();
        const tauxOccupationParSalle = {};

        toutesLesSalles.forEach(salle => {
            const tauxOccupation = recupererTauxOccupation(salle, dateDebut, dateFin);
            tauxOccupationParSalle[salle] = tauxOccupation;
        });

        afficherVisualisation(tauxOccupationParSalle);
        rl.close();
    });
});
