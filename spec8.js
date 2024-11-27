const fs = require('fs');
const path = require('path');
const readline = require('readline');
const Table = require('cli-table3');

// Répertoire contenant les données des emplois du temps
const repertoirePrincipal = path.join(__dirname, 'data');

// Fonction pour récupérer les capacités maximales des salles
function recupererCapacitesDesSalles() {
    const sousRepertoires = fs.readdirSync(repertoirePrincipal).filter(rep => {
        return fs.lstatSync(path.join(repertoirePrincipal, rep)).isDirectory();
    });

    const sallesCapacites = new Map(); // Utiliser une Map pour stocker les capacités maximales des salles

    sousRepertoires.forEach(rep => {
        const cheminSousRepertoire = path.join(repertoirePrincipal, rep);
        const fichiers = fs.readdirSync(cheminSousRepertoire);

        fichiers.forEach(fichier => {
            if (fichier === 'edt.cru') {
                const cheminFichier = path.join(cheminSousRepertoire, fichier);
                const contenu = fs.readFileSync(cheminFichier, 'utf8');
                const lignes = contenu.split('\n').map(ligne => ligne.trim());

                lignes.forEach(ligne => {
                    const salleMatch = ligne.match(/S=([A-Z0-9]+)/); // Identifier la salle
                    const capaciteMatch = ligne.match(/P=(\d+)/);    // Identifier la capacité

                    if (salleMatch && capaciteMatch) {
                        const salle = salleMatch[1];
                        const capacite = parseInt(capaciteMatch[1], 10);

                        // Mettre à jour la capacité maximale pour la salle
                        if (sallesCapacites.has(salle)) {
                            const capaciteExistante = sallesCapacites.get(salle);
                            sallesCapacites.set(salle, Math.max(capaciteExistante, capacite)); // Garder la capacité maximale
                        } else {
                            sallesCapacites.set(salle, capacite); // Ajouter la salle avec sa capacité
                        }
                    }
                });
            }
        });
    });

    // Convertir la Map en tableau d'objets { salle, capacite }
    return Array.from(sallesCapacites.entries()).map(([salle, capacite]) => ({
        salle,
        capacite
    }));
}

// Fonction pour trier les salles par capacité
function trierSallesParCapacite(sallesCapacites, ordre) {
    return sallesCapacites.sort((a, b) => {
        if (ordre === 'croissant') {
            return a.capacite - b.capacite;
        } else if (ordre === 'decroissant') {
            return b.capacite - a.capacite;
        }
        return 0;
    });
}

// Fonction pour afficher les salles triées dans un tableau
function afficherSallesClassees(sallesClassees) {
    const table = new Table({
        head: ['Salle', 'Capacité'],
        colWidths: [20, 15]
    });

    sallesClassees.forEach(({ salle, capacite }) => {
        table.push([salle, capacite]);
    });

    console.log(table.toString());
}

// Interface utilisateur pour choisir l'ordre de classement
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Souhaitez-vous classer les salles par capacité dans l\'ordre croissant ou décroissant ? (croissant/decroissant) : ', (ordre) => {
    if (ordre !== 'croissant' && ordre !== 'decroissant') {
        console.log('Erreur : Ordre invalide. Veuillez relancer le programme.');
        rl.close();
        return;
    }

    console.log('Récupération des données des salles...');
    const sallesCapacites = recupererCapacitesDesSalles();

    if (sallesCapacites.length === 0) {
        console.log('Erreur : Les données de capacité des salles sont indisponibles.');
        rl.close();
        return;
    }

    console.log('Tri des salles en cours...');
    const sallesClassees = trierSallesParCapacite(sallesCapacites, ordre);

    console.log('\nClassement des salles par capacité :');
    afficherSallesClassees(sallesClassees);

    rl.close();
});
