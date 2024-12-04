/**
 * @file spec1.js
 * @description Ce fichier contient le code permettant de rechercher et d'afficher les salles utilisées pour un cours donné
 *              dans les fichiers d'emploi du temps (edt.cru). Les créneaux sont regroupés par salle et par jour, triés,
 *              et affichés de manière structurée et lisible.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_01 - Recherche des salles pour un cours donné.
 *          Le logiciel doit permettre aux utilisateurs de rechercher les salles attribuées à un cours spécifique.
 *
 * @author Théo TORREILLES, Lucie GUÉRIN
 * @version 1.3
 * @date Décembre 2024
 *
 * @functions
 * - findRoomsForCourse(directory, courseName, showResult): Recherche les salles et créneaux associés à un cours donné, et les affiche.
 * - groupBy(array, key): Regroupe les éléments d'un tableau par une clé spécifique.
 *
 * @dependencies
 * - Module personnalisé 'functions.js' : Fournit des fonctions utilitaires.
 * - Module personnalisé 'parser.js' : Utilisé pour analyser les fichiers edt.cru et extraire les créneaux d'enseignement.
 *
 * @usage
 *   import { findRoomsForCourse } from './spec1.js';
 *   const rooms = findRoomsForCourse('./data', 'MATH02');
 *
 * @note
 * - Les données sont extraites des fichiers edt.cru présents dans le répertoire spécifié.
 * - Les créneaux sont regroupés par salle, puis par jour, et triés dans l'ordre chronologique.
 * - Si aucun créneau n'est trouvé pour le cours demandé, un message d'erreur est affiché.
 *
 * @remarks
 * - Assurez-vous que le répertoire contenant les fichiers edt.cru est correctement spécifié.
 * - Les noms de cours doivent correspondre exactement, sans tenir compte de la casse.
 */

// Importer les modules nécessaires
import * as functions from '../utility/functions.js';
import * as parser from '../utility/parser.js';

/**
 * Fonction pour rechercher les salles utilisées pour un cours donné
 * @param {string} directory Le répertoire contenant les fichiers edt.cru
 * @param {string} courseName Le nom du cours à rechercher
 * @param {boolean} [showResult] Indique si les résultats doivent être affichés dans la console (par défaut : true)
 * @returns {Object} Une liste des salles attribuées au cours, regroupées par salle et par jour
 */
function findRoomsForCourse(directory, courseName, showResult = true) {
    // Parser tous les fichiers edt.cru dans le répertoire donné
    const allTimeSlots = parser.parseAllEdtFiles(directory);

    // Vérifier si le cours existe et collecter les informations sur les salles associées
    const roomsForCourse = allTimeSlots
        .filter(timeSlot => timeSlot.course.toLowerCase() === courseName.toLowerCase())
        .map(timeSlot => ({
            room: timeSlot.room,
            day: timeSlot.day,
            startTime: timeSlot.startTime,
            endTime: timeSlot.endTime
        }));

    // Si aucune salle n'est trouvée, retourner un message d'erreur
    if (roomsForCourse.length === 0) {
        if (showResult) console.error(`❌ Erreur : Aucun cours nommé "${courseName}" n'a été trouvé dans le système. Vérifiez le nom du cours et réessayez.`);
        return {};
    }

    // Regrouper les créneaux par salle
    let roomsGrouped = groupBy(roomsForCourse, 'room');

    // Pour chaque salle, regrouper les créneaux par jour et trier les jours
    Object.keys(roomsGrouped).forEach(room => {
        roomsGrouped[room] = groupBy(roomsGrouped[room], 'day');
        const sortedDays = functions.sortDays(Object.keys(roomsGrouped[room]));
        roomsGrouped[room] = sortedDays.reduce((acc, day) => {
            acc[day] = roomsGrouped[room][day];
            return acc;
        }, {});
    });

    if (showResult) {
        // Afficher un message de confirmation et retourner les résultats
        console.log(`✅ Salles trouvées pour le cours "${courseName}":\n`);
        Object.entries(roomsGrouped).forEach(([room, days], index) => {
            console.log(`Salle #${index + 1}: ${room}`);
            Object.entries(days).forEach(([day, timeSlots]) => {
                console.log(`  - Jour : ${functions.transformDayName(day)}`);
                timeSlots.forEach(timeSlot => {
                    console.log(`    - Heures : ${timeSlot.startTime} - ${timeSlot.endTime}`);
                });
            });
            console.log('-----------------------------------');
        });
    }

    return roomsGrouped;
}

/**
 * Fonction pour regrouper des éléments d'un tableau par une clé spécifique
 * @param {Array} array Le tableau d'objets à regrouper
 * @param {string} key La clé sur laquelle regrouper les objets (ex: 'room' ou 'day')
 * @returns {Object} Objet regroupant les éléments par la clé spécifiée
 */
function groupBy(array, key) {
    return array.reduce((acc, item) => {
        const groupKey = item[key];
        if (!acc[groupKey]) {
            acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
    }, {});
}

// Exporter la fonction pour une utilisation externe
export { findRoomsForCourse };
