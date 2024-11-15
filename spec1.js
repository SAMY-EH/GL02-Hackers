// Importer le module 'fs' pour lire les fichiers
const fs = require('fs');
const path = require('path');

// Fonction pour déterminer le sous-répertoire correspondant à la première lettre du cours
function determinerSousRepertoire(nomCours) {
    const premiereLettre = nomCours[0].toUpperCase();
    const sousRepertoires = ["AB", "CD", "EF", "GH", "IJ", "KL", "MN", "OP", "QR", "ST"];
    
    // Trouver le sous-répertoire où la lettre du cours appartient
    for (const rep of sousRepertoires) {
        if (rep.includes(premiereLettre)) {
            return rep;
        }
    }
    return null; // Si aucune correspondance n'est trouvée
}

// Fonction pour lire le contenu du fichier edt.cru dans le bon sous-répertoire
function lireDonneesFichier(nomCours) {
    const sousRepertoire = determinerSousRepertoire(nomCours);
    if (!sousRepertoire) {
        console.error(`Sous-répertoire introuvable pour le cours : ${nomCours}`);
        return null;
    }

    const cheminFichier = path.join(__dirname, 'SujetA_data', sousRepertoire, 'edt.cru');
    console.log(`Chemin du fichier : ${cheminFichier}`);

    try {
        // Lecture synchronisée du fichier
        const contenu = fs.readFileSync(cheminFichier, 'utf8');
        return contenu;
    } catch (err) {
        console.error(`Erreur lors de la lecture du fichier ${cheminFichier} : ${err.message}`);
        return null;
    }
}

// Fonction pour extraire les informations des salles d'un cours donné
function rechercherSallesPourCours(nomCours, contenuDonnees) {
    // Découper les données en sections par cours
    const sections = contenuDonnees.trim().split('+').filter(section => section.trim() !== "");

    // Rechercher la section correspondant au cours donné
    for (const section of sections) {
        const lignes = section.split('\n').map(ligne => ligne.trim());
        const codeCours = lignes[0]; // Le premier élément est le nom du cours (e.g., MC01)

        if (codeCours === nomCours) {
            console.log(`Cours trouvé : ${codeCours}`);
            console.log(`Salles associées :`);

            // Analyser les créneaux de la section
            for (let i = 1; i < lignes.length; i++) {
                const ligne = lignes[i];
                const salleMatch = ligne.match(/S=([A-Z0-9]+)/);
                const horaireMatch = ligne.match(/H=([A-Z]+ \d{2}:\d{2}-\d{2}:\d{2})/);

                if (salleMatch && horaireMatch) {
                    const salle = salleMatch[1];
                    const horaire = horaireMatch[1];
                    console.log(`- Salle : ${salle}, Horaire : ${horaire}`);
                }
            }
            return;
        }
    }

    console.log(`Cours "${nomCours}" non trouvé dans les données.`);
}

// Demander à l'utilisateur d'entrer un nom de cours via la ligne de commande
const args = process.argv.slice(2);
if (args.length === 0) {
    console.log('Veuillez fournir un nom de cours en argument, exemple : node rechercheSalle.js MC01');
} else {
    const nomCours = args[0].toUpperCase(); // Pour normaliser le nom du cours
    const contenuDonnees = lireDonneesFichier(nomCours);
    if (contenuDonnees) {
        rechercherSallesPourCours(nomCours, contenuDonnees);
    }
}

