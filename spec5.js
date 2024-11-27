const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { v4: uuidv4 } = require('uuid');  // Import de la bibliothèque UUID

// Répertoire contenant les données
const repertoirePrincipal = path.join(__dirname, 'data');

// Fonction pour récupérer les événements des cours dans une période donnée
function recupererCoursDansPeriode(dateDebut, dateFin) {
    const evenements = [];
    const sousRepertoires = fs.readdirSync(repertoirePrincipal).filter(rep => {
        return fs.lstatSync(path.join(repertoirePrincipal, rep)).isDirectory();
    });

    // Convertir les dates de début et de fin entrées par l'utilisateur en format ISO avec l'heure 00:00:00
    const dateDebutISO = formatDate(dateDebut, '00:00:00'); // Date de début avec heure à 00:00:00
    const dateFinISO = formatDate(dateFin, '23:59:59'); // Date de fin avec heure à 23:59:59

    // Log pour vérifier la période de filtrage
    console.log(`Période sélectionnée : ${dateDebutISO} à ${dateFinISO}`);

    sousRepertoires.forEach(rep => {
        const cheminSousRepertoire = path.join(repertoirePrincipal, rep);
        const fichiers = fs.readdirSync(cheminSousRepertoire);

        fichiers.forEach(fichier => {
            if (fichier === 'edt.cru') {
                const cheminFichier = path.join(cheminSousRepertoire, fichier);
                const contenu = fs.readFileSync(cheminFichier, 'utf8');
                const lignes = contenu.split('\n').map(ligne => ligne.trim());

                lignes.forEach((ligne, index) => {  // Utilisation de l'index pour générer un UID unique
                    const horaireMatch = ligne.match(/H=([A-Z]{1,2}) (\d{2}:\d{2}-\d{2}:\d{2})/);
                    const salleMatch = ligne.match(/S=([A-Z0-9]+)/);
                    const codeCoursMatch = ligne.match(/^1,(C1|D1|T1|[A-Z0-9]+)/); // Récupérer le code du cours

                    if (horaireMatch && salleMatch && codeCoursMatch) {
                        const jourAbrege = horaireMatch[1];
                        const heures = horaireMatch[2].split('-');
                        const heureDebut = formatDate(dateDebut, `${heures[0]}:00`);
                        const heureFin = formatDate(dateFin, `${heures[1]}:00`);
                        const salle = salleMatch[1];
                        const codeCours = codeCoursMatch[1];

                        // Log pour vérifier les heures extraites
                        console.log(`Vérification de l'événement : Cours ${codeCours} - Salle ${salle}`);
                        console.log(`Heure début : ${heureDebut}, Heure fin : ${heureFin}`);
                        console.log(`Période filtrée : ${dateDebutISO} à ${dateFinISO}`);

                        // Vérification stricte des dates (DTSTART et DTEND) pour s'assurer que l'événement est dans la période
                        if (isEventCompletelyInRange(heureDebut, heureFin, dateDebutISO, dateFinISO)) {
                            // Générer un UID unique avec UUID
                            const uid = uuidv4();  // Génération d'un UUID unique pour chaque événement

                            // Correction du format de DTSTAMP, DTSTART, DTEND
                            const dtstamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'; // DTSTAMP en UTC
                            const dtstart = heureDebut.replace(/[-:]/g, '').slice(0, 15) + 'Z';  // DTSTART en UTC
                            const dtend = heureFin.replace(/[-:]/g, '').slice(0, 15) + 'Z'; // DTEND en UTC

                            // Ajouter l'événement à la liste si le filtrage est validé
                            evenements.push({
                                uid: uid,  // UID unique avec UUID
                                dtstamp: dtstamp,  // Assurez-vous que DTSTAMP est une valeur valide
                                dtstart: dtstart,  // Heure de début au format UTC
                                dtend: dtend,      // Heure de fin au format UTC
                                summary: `${codeCours} - Cours`,
                                location: salle
                            });
                        } else {
                            // Log pour vérifier les événements non inclus
                            console.log(`Événement non inclus : ${codeCours} - ${salle} (Hors de la période spécifiée)`);
                        }
                    }
                });
            }
        });
    });

    return evenements;
}

// Fonction pour vérifier si un événement est complètement dans la période spécifiée
function isEventCompletelyInRange(dtstart, dtend, dateDebutISO, dateFinISO) {
    const dtstartParsed = Date.parse(dtstart); // Parse la date de début
    const dtendParsed = Date.parse(dtend); // Parse la date de fin
    const dateDebutParsed = Date.parse(dateDebutISO); // Parse la date de début de la période
    const dateFinParsed = Date.parse(dateFinISO); // Parse la date de fin de la période

    // Log de vérification
    console.log(`Vérification stricte : DTSTART (${dtstart}) et DTEND (${dtend}) dans la plage ${dateDebutISO} à ${dateFinISO}`);

    // Vérifie que BOTH le début et la fin de l'événement sont strictement dans la période spécifiée
    return dtstartParsed >= dateDebutParsed && dtendParsed <= dateFinParsed;
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
    let contenu = "BEGIN:VCALENDAR\n";
    contenu += "PRODID:-//Your Company//NONSGML v1.0//EN\n";  // Ajout de la ligne PRODID
    contenu += "VERSION:2.0\n";

    evenements.forEach(event => {
        contenu += `BEGIN:VEVENT\n`;
        contenu += `UID:${event.uid}\n`;  // UID unique pour l'événement
        contenu += `DTSTAMP:${event.dtstamp}\n`; // Date de génération du fichier iCalendar
        contenu += `DTSTART:${event.dtstart}\n`;  // Heure de début de l'événement
        contenu += `DTEND:${event.dtend}\n`;      // Heure de fin de l'événement
        contenu += `SUMMARY:${event.summary}\n`;  // Titre de l'événement
        contenu += `LOCATION:${event.location}\n`; // Salle
        contenu += `DESCRIPTION:Cours de ${event.summary}\n`; // Description de l'événement
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
