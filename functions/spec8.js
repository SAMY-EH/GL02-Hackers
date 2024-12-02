/**
 * @file spec8.js
 * @description Ce fichier contient le code permettant de classer les salles par capacité pour le projet.
 *              Le classement peut être effectué de manière croissante ou décroissante, et un nombre minimum de places
 *              peut être spécifié pour filtrer les salles.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_08 - Classement des salles par capacité
 *          Le logiciel doit permettre le classement des salles par leur capacité d’accueil (par exemple, combien de salles de 24 places sont disponibles).
 *
 * @author Théo TORREILLES, Julie VAN HOUDENHOVE
 * @version 1.1
 * @date Décembre 2024
 *
 * @functions
 * - classifyRoomsByCapacity(directory, ascending, minCapacity): Classe les salles en fonction de leur capacité,
 *   avec une option de tri croissant/décroissant et un nombre minimum de places.
 *
 * @dependencies
 * - Module personnalisé 'parser.js' : Utilisé pour analyser les fichiers edt.cru et extraire les créneaux d'enseignement.
 *
 * @usage
 *   import { classifyRoomsByCapacity } from './spec8.js';
 *   const directory = './data';
 *   const ascending = false; // Trier en ordre décroissant
 *   const minCapacity = 20; // Capacité minimale des salles à afficher
 *   classifyRoomsByCapacity(directory, ascending, minCapacity);
 *
 * @note
 * - Les données sont extraites des fichiers edt.cru présents dans le répertoire spécifié.
 * - Les salles sont classées par capacité, avec un filtre optionnel pour le nombre minimum de places.
 * - Les salles sont regroupées par capacité et affichées de manière structurée.
 * - Si aucune salle ne correspond aux critères spécifiés, un message d'erreur est affiché.
 * 
 * @remarks
 * - Assurez-vous que le répertoire contenant les fichiers edt.cru est correctement spécifié.
 * - La capacité des salles est déterminée par le nombre de places maximales disponibles.
 * - Le tri peut être effectué de manière croissante ou décroissante, en fonction de la valeur de 'ascending'.
 * - Le nombre minimum de places peut être spécifié pour filtrer les salles à afficher.
 */

// Importer le module nécessaire
import * as parser from '../utility/parser.js';

/**
 * Fonction pour classer les salles par capacité
 * @param {string} directory Le répertoire contenant les fichiers edt.cru
 * @param {boolean} ascending Tri croissant si true, décroissant sinon
 * @param {number} minCapacity Nombre de places minimum pour les salles à afficher (optionnel)
 * @returns {void}
 */
function classifyRoomsByCapacity(directory, ascending = true, minCapacity = 0) {
    // Parser tous les fichiers edt.cru dans le répertoire donné
    const allTimeSlots = parser.parseAllEdtFiles(directory);

    // Créer un objet pour stocker la capacité maximale de chaque salle
    const roomMaxCapacities = {};

    // Parcourir tous les créneaux pour trouver la capacité maximale de chaque salle
    allTimeSlots.forEach(timeSlot => {
        if (!roomMaxCapacities[timeSlot.room] || roomMaxCapacities[timeSlot.room] < timeSlot.capacity) {
            roomMaxCapacities[timeSlot.room] = timeSlot.capacity;
        }
    });

    // Filtrer les salles selon la capacité minimale spécifiée
    let filteredRooms = Object.entries(roomMaxCapacities)
        .filter(([room, capacity]) => capacity >= minCapacity);

    // Trier les salles par capacité
    filteredRooms.sort(([, capacityA], [, capacityB]) => ascending ? capacityA - capacityB : capacityB - capacityA);

    // Afficher les résultats
    if (filteredRooms.length === 0) {
        console.error("❌ Aucune salle ne correspond aux critères spécifiés.");
        return;
    }

    console.log(`✅ Classement des salles par capacité (min. ${minCapacity} places, ${ascending ? 'Croissant' : 'Décroissant'}) :\n`);
    
    // Regrouper les salles par capacité et les afficher
    let currentCapacity = null;
    filteredRooms.forEach(([room, capacity], index) => {
        if (capacity !== currentCapacity) {
            if (index > 0) {
                console.log('-----------------------------------');
            }
            console.log(`Capacité : ${capacity}`);
            currentCapacity = capacity;
        }
        console.log(`  - Salle : ${room}`);
    });
    console.log('-----------------------------------');
}

// Exporter la fonction pour une utilisation externe
export { classifyRoomsByCapacity };
