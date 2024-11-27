const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Répertoire contenant les données
const repertoirePrincipal = path.join(__dirname, 'data');

// Fonction pour récupérer les événements des cours dans une période donnée
function recupererCoursDansPeriode(dateDebut, dateFin) {
    const evenements = [];
    const sousRepertoires = fs.readdirSync(repertoirePrincipal).filter(rep => {
        return fs.lstatSync(path.join(repertoirePrincipal, rep)).isDirectory();
    });

    // Validation de la date entrée pour s'assurer que le format est YYYYMMDD
    const dateDebutISO = formatDate(dateDebut, '00:00:00'); // Date de début avec heure à 00:00:00
    const dateFinISO = formatDate(dateFin, '23:59:59'); // Date de fin avec heure à 23:59:59

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
                    const codeCoursMatch = ligne.match(/^1,(C1|D1|T1|[A-Z0-9]+)/);

                    if (horaireMatch && salleMatch && codeCoursMatch) {
                        const jourAbrege = horaireMatch[1];
                        const heures = horaireMatch[2].split('-');
                        const heureDebut = formatDate(dateDebut, `${heures[0]}:00`); // Formatée en HH:MM
                        const heureFin = formatDate(dateFin, `${heures[1]}:00`); // Formatée en HH:MM
                        const salle = salleMatch[1];
                        const codeCours = codeCoursMatch[1];
                        const uid = `${codeCours}-${salle}@universite-sealand.fr`; // UID unique pour l'événement

                        // Vérification de la période avec comparaison d'heures
                        if (Date.parse(heureDebut) >= Date.parse(dateDebutISO) && Date.parse(heureFin) <= Date.parse(dateFinISO)) {
                            evenements.push({
                                uid: uid,
                                dtstamp: new Date().toISOString(),
                                dtstart: heureDebut,
                                dtend: heureFin,
                                summary: `${codeCours} - Cours`,
                                location: salle
                            });
                        }
                    }
                });
            }
        });
    });

    return evenements;
}

// Fonction pour formater la date et l'heure en format ISO
function formatDate(date, time) {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);

    // Retourne la date au format ISO "YYYY-MM-DDTHH:mm:ssZ"
    return `${year}-${month}-${day}T${time}Z`;
}


// Fonction pour générer le fichier iCalendar (.ics)
function genererICalendar(evenements) {
    let contenu = "BEGIN:VCALENDAR\nVERSION:2.0\n";

    evenements.forEach(event => {
        contenu += `BEGIN:VEVENT\n`;
        contenu += `UID:${event.uid}\n`;
        contenu += `DTSTAMP:${event.dtstamp}\n`;
        contenu += `DTSTART:${event.dtstart}\n`;
        contenu += `DTEND:${event.dtend}\n`;
        contenu += `SUMMARY:${event.summary}\n`;
        contenu += `LOCATION:${event.location}\n`;
        contenu += `END:VEVENT\n`;
    });

    contenu += "END:VCALENDAR";

    return contenu;
}

// Fonction pour enregistrer le fichier iCalendar
function enregistrerICalendar(contenu, cheminFichier) {
    fs.writeFileSync(cheminFichier, contenu);
    console.log(`Le fichier iCalendar a été généré avec succès : ${cheminFichier}`);
}

// Interface utilisateur pour saisir les dates de début et de fin
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Entrez la date de début (format : YYYYMMDD) : ', (dateDebut) => {
    rl.question('Entrez la date de fin (format : YYYYMMDD) : ', (dateFin) => {
        const evenements = recupererCoursDansPeriode(dateDebut, dateFin);
        if (evenements.length > 0) {
            const contenuICS = genererICalendar(evenements);
            const cheminFichier = path.join(__dirname, `cours_${dateDebut}_${dateFin}.ics`);
            enregistrerICalendar(contenuICS, cheminFichier);
        } else {
            console.log('Aucun événement trouvé pour la période spécifiée.');
        }

        rl.close();
    });
});
