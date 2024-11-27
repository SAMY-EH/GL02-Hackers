const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Table = require('cli-table3');

// Répertoire contenant les données des emplois du temps
const repertoirePrincipal = path.join(__dirname, 'data');

// Seuils pour définir les salles sous et sur-exploitées
const SEUIL_SOUS_EXPLOITE = 30; // Taux d'occupation inférieur à 30%
const SEUIL_SUR_EXPLOITE = 80; // Taux d'occupation supérieur à 80%

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

    const sallesCapacites = new Map();

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

                        if (sallesCapacites.has(salle)) {
                            const capaciteExistante = sallesCapacites.get(salle);
                            sallesCapacites.set(salle, Math.max(capaciteExistante, capacite));
                        } else {
                            sallesCapacites.set(salle, capacite);
                        }
                    }
                });
            }
        });
    });

    return Array.from(sallesCapacites.entries()).map(([salle, capacite]) => ({
        salle,
        capacite
    }));
}

// Fonction pour calculer le taux d’occupation d’une salle
function recupererTauxOccupation(salle, dateDebut, dateFin) {
    let totalTempsDisponible = 0;
    let totalTempsOccupe = 0;

    // Récupérer les jours de la période spécifiée
    const joursDates = getJoursEntreDates(dateDebut, dateFin);
    const joursAbr = ['D', 'L', 'MA', 'ME', 'J', 'V', 'S']; // Correspondance des jours
    const jours = joursDates.map(date => {
        const dayIndex = new Date(date).getDay(); // Index du jour (0 = Dimanche, 6 = Samedi)
        return joursAbr[dayIndex]; // Correspond à 'L', 'MA', etc.
    });

    console.log(`Jours générés pour la période ${dateDebut} à ${dateFin} : ${jours.join(', ')}`);

    // Parcourir les fichiers edt.cru
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
                    const horaireMatch = ligne.match(/H=([A-Z]{1,2}) (\d{2}:\d{2}-\d{2}:\d{2})/);
                    const salleMatch = ligne.match(/S=([A-Z0-9]+)/);

                    if (horaireMatch && salleMatch && salleMatch[1] === salle) {
                        const jourAbrege = horaireMatch[1]; // Ex: 'L', 'MA', etc.
                        const horaires = horaireMatch[2].split('-');
                        const heureDebutEvent = horaires[0];
                        const heureFinEvent = horaires[1];

                        console.log(`Événement détecté pour ${salle} : Jour=${jourAbrege}, Horaire=${heureDebutEvent}-${heureFinEvent}`);

                        // Vérifier si le jour de l'événement correspond à la période analysée
                        if (jours.includes(jourAbrege)) {
                            console.log(`Événement valide pour ${salle} : Jour=${jourAbrege}, ${heureDebutEvent}-${heureFinEvent}`);

                            // Convertir les horaires en minutes
                            const debutEventMinutes = convertirEnMinutes(heureDebutEvent);
                            const finEventMinutes = convertirEnMinutes(heureFinEvent);

                            totalTempsOccupe += finEventMinutes - debutEventMinutes;

                            // Appliquer les heures d'ouverture
                            const horairesJour = horairesOuverture[joursMap[jourAbrege]];
                            if (horairesJour) {
                                const tempsDisponible = (horairesJour.fin - horairesJour.debut) * 60;
                                console.log(`Temps disponible ajouté pour ${joursMap[jourAbrege]} : ${tempsDisponible} minutes`);
                                totalTempsDisponible += tempsDisponible;
                            }
                        } else {
                            console.log(`Jour de l'événement (${jourAbrege}) non inclus dans la période spécifiée.`);
                        }
                    }
                });
            }
        });
    });

    console.log(`Salle: ${salle}, Temps occupé: ${totalTempsOccupe} minutes, Temps disponible: ${totalTempsDisponible} minutes`);

    if (totalTempsDisponible > 0) {
        return ((totalTempsOccupe / totalTempsDisponible) * 100).toFixed(2);
    } else {
        return null;
    }
}

// Convertir l'heure HH:mm en minutes
function convertirEnMinutes(heure) {
    const [heures, minutes] = heure.split(':').map(Number);
    return heures * 60 + minutes;
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

// Afficher les salles sur et sous-exploitées
function afficherRapportSalles(sallesSurExpl, sallesSousExpl) {
    const tableSur = new Table({
        head: ['Salle', 'Taux d\'occupation (%)'],
        colWidths: [20, 25]
    });

    const tableSous = new Table({
        head: ['Salle', 'Taux d\'occupation (%)'],
        colWidths: [20, 25]
    });

    sallesSurExpl.forEach(({ salle, taux }) => {
        tableSur.push([salle, taux]);
    });

    sallesSousExpl.forEach(({ salle, taux }) => {
        tableSous.push([salle, taux]);
    });

    console.log('\nSalles sur-exploitées :');
    console.log(tableSur.toString());

    console.log('\nSalles sous-exploitées :');
    console.log(tableSous.toString());
}

// Interface utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Veuillez saisir la date de début (format : YYYYMMDD) : ', (dateDebut) => {
    rl.question('Veuillez saisir la date de fin (format : YYYYMMDD) : ', (dateFin) => {
        const salles = recupererToutesLesSalles();
        const sallesSurExpl = [];
        const sallesSousExpl = [];

        salles.forEach(({ salle }) => {
            const taux = recupererTauxOccupation(salle, dateDebut, dateFin);
            if (taux !== null) {
                if (taux > SEUIL_SUR_EXPLOITE) {
                    sallesSurExpl.push({ salle, taux });
                } else if (taux < SEUIL_SOUS_EXPLOITE) {
                    sallesSousExpl.push({ salle, taux });
                }
            }
        });

        afficherRapportSalles(sallesSurExpl, sallesSousExpl);
        rl.close();
    });
});
