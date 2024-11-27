const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Répertoire contenant les données des emplois du temps
const repertoirePrincipal = path.join(__dirname, 'data');

// Fonction pour vérifier la disponibilité d'une salle pour un créneau horaire spécifique
function verifierDisponibiliteSalle(nomSalle, dateDebut, heureDebut, heureFin) {
    const sousRepertoires = fs.readdirSync(repertoirePrincipal).filter(rep => {
        return fs.lstatSync(path.join(repertoirePrincipal, rep)).isDirectory();
    });

    // Formater la date et heure du début et de la fin pour la recherche
    const dateDebutISO = formatDate(dateDebut, heureDebut);
    const dateFinISO = formatDate(dateDebut, heureFin);

    // Log pour vérifier la période de filtrage
    console.log(`Vérification de la disponibilité de la salle ${nomSalle} pour le créneau : ${dateDebutISO} à ${dateFinISO}`);

    let disponibilite = "Disponible";  // Par défaut, la salle est disponible
    let conflitDetails = null;  // Détails sur le conflit (si un événement chevauche)

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
                    const codeCoursMatch = ligne.match(/^1,(C1|D1|T1|[A-Z0-9]+)/); // Récupérer le code du cours

                    if (horaireMatch && salleMatch && salleMatch[1] === nomSalle) {
                        const jourAbrege = horaireMatch[1];
                        const horaires = horaireMatch[2].split('-');
                        const heureDebutEvent = horaires[0];  // Heure de début de l'événement
                        const heureFinEvent = horaires[1];   // Heure de fin de l'événement

                        // Vérification si l'événement chevauche la période spécifiée
                        if (estDansPlage(heureDebut, heureFin, heureDebutEvent, heureFinEvent)) {
                            disponibilite = "Occupée";  // Si l'événement chevauche, la salle est occupée
                            conflitDetails = {
                                cours: codeCoursMatch[1],
                                horaire: `${heureDebutEvent} - ${heureFinEvent}`,
                                jour: jourAbrege
                            };
                        }
                    }
                });
            }
        });
    });

    // Affichage du résultat
    if (disponibilite === "Disponible") {
        console.log(`La salle ${nomSalle} est Disponible pour le créneau ${dateDebutISO} à ${dateFinISO}.`);
    } else {
        // Affichage du détail sur le conflit si la salle est occupée
        console.log(`La salle ${nomSalle} est Occupée pour le créneau ${dateDebutISO} à ${dateFinISO}.`);
        console.log(`Conflit avec l'événement : ${conflitDetails.cours} à ${conflitDetails.jour} de ${conflitDetails.horaire}.`);
    }
}

// Fonction pour vérifier si un événement chevauche le créneau spécifié
function estDansPlage(heureDebut, heureFin, heureDebutEvent, heureFinEvent) {
    // Comparaison des heures sous forme de nombres pour faciliter le calcul
    const heureDebutUser = convertirEnMinutes(heureDebut);
    const heureFinUser = convertirEnMinutes(heureFin);
    const heureDebutEventMinutes = convertirEnMinutes(heureDebutEvent);
    const heureFinEventMinutes = convertirEnMinutes(heureFinEvent);

    // Vérifier si l'événement chevauche le créneau
    return !(heureFinUser <= heureDebutEventMinutes || heureDebutUser >= heureFinEventMinutes);
}

// Fonction pour convertir l'heure HH:mm en minutes depuis minuit
function convertirEnMinutes(heure) {
    const [heures, minutes] = heure.split(':').map(num => parseInt(num));
    return heures * 60 + minutes;
}

// Fonction pour formater la date et l'heure en format ISO
function formatDate(date, heure) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    return `${year}-${month}-${day}T${heure}:00Z`;
}

// Interface utilisateur pour saisir la salle et le créneau horaire
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Veuillez saisir le nom de la salle : ', (nomSalle) => {
    rl.question('Veuillez saisir la date (format : YYYYMMDD) : ', (date) => {
        rl.question('Veuillez saisir l\'heure de début (format : HH:mm) : ', (heureDebut) => {
            rl.question('Veuillez saisir l\'heure de fin (format : HH:mm) : ', (heureFin) => {
                verifierDisponibiliteSalle(nomSalle, date, heureDebut, heureFin);
                rl.close();
            });
        });
    });
});
