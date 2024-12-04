/**
 * @file spec2.js
 * @description Ce fichier contient le code permettant de consulter la capacité d'une salle donnée. 
 *              Il extrait la capacité maximale de chaque salle en se basant sur les informations 
 *              d'emploi du temps provenant des fichiers edt.cru. 
 *
 * @context Projet GL02 - Hackers
 *          SPEC_02 - Consultation de la capacité d'une salle.
 *          Les utilisateurs doivent pouvoir consulter la capacité maximale d’une salle en termes de nombre de places.
 *
 * @author Théo TORREILLES, Lucie GUÉRIN
 * @version 1.2
 * @date Décembre 2024
 *
 * @functions
 * - findRoomCapacity(directory, roomName, showResult): Recherche et affiche la capacité d'une salle donnée.
 *
 * @dependencies
 * - Module personnalisé 'parser.js' : Utilisé pour analyser les fichiers edt.cru et extraire les créneaux d'enseignement.
 *
 * @usage
 *   import { findRoomCapacity } from './spec2.js';
 *   const roomCapacity = findRoomCapacity('./data', 'B210');
 *
 * @note
 * - Les données sont extraites des fichiers edt.cru présents dans le répertoire spécifié.
 * - Si la salle n'existe pas ou si la capacité ne peut pas être déterminée, des messages d'erreur appropriés sont affichés.
 *
 * @remarks
 * - Assurez-vous que le répertoire contenant les fichiers edt.cru est correctement spécifié.
 * - Les noms de salles doivent correspondre exactement, sans tenir compte de la casse.
 */

// Importer le module nécessaire
import * as parser from '../utility/parser.js';

/**
 * Fonction pour consulter la capacité d'une salle donnée
 * @param {string} directory Le répertoire contenant les fichiers edt.cru
 * @param {string} roomName Le nom de la salle à consulter
 * @param {boolean} [showResult] Indique si les résultats doivent être affichés dans la console (par défaut : true)
 * @returns {Object} Une information sur la capacité de la salle
 */
function findRoomCapacity(directory, roomName, showResult = true) {
    // Parser tous les fichiers edt.cru dans le répertoire donné
    const allTimeSlots = parser.parseAllEdtFiles(directory);

    // Vérifier si la salle existe et collecter les informations sur la capacité
    const roomsInfo = allTimeSlots.filter(timeSlot => timeSlot.room.toLowerCase() === roomName.toLowerCase());

    // Si aucune information sur la salle n'est trouvée, retourner un message d'erreur
    if (roomsInfo.length === 0) {
        if(showResult) console.error(`❌ Erreur : La salle nommée "${roomName}" n'a pas été trouvée dans le système. Vérifiez le nom de la salle et réessayez.`);
        return {};
    }

    // Regrouper par capacité, pour s'assurer que nous avons la capacité maximale mentionnée pour la salle
    const capacities = roomsInfo.map(timeSlot => timeSlot.capacity);
    const maxCapacity = Math.max(...capacities);

    if (isNaN(maxCapacity)) {
        if(showResult) console.error(`❌ Erreur : La capacité pour la salle "${roomName}" n'a pas pu être déterminée.`);
        return {};
    }

    // Afficher la capacité de la salle
    if (showResult) {
        console.log(`✅ Capacité de la salle "${roomName}":`);
        console.log(`  - Nombre de places : ${maxCapacity}`);
    }

    return {
        roomName: roomName,
        capacity: maxCapacity
    };
}

// Exporter la fonction pour une utilisation externe
export { findRoomCapacity };
