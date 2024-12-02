/**
 * @file functions.js
 * @description Ce fichier contient des fonctions utilitaires qui sont utilisées tout au long du projet.
 *              Ces fonctions incluent des opérations de tri, de transformation de jours, de regroupement de données,
 *              ainsi que l'affichage formaté des résultats. Ces utilitaires sont utilisés dans les différentes spécifications
 *              pour la gestion des créneaux horaires, des salles, et des cours.
 *
 * @context Projet GL02 - Hackers
 *
 * @author Théo TORREILLES
 * @version 1.0
 * @date Décembre 2024
 *
 * @functions
 * - sortDays(daysArray): Trie un tableau de jours selon un ordre prédéfini.
 * - transformDayName(dayCode): Transforme une abréviation de jour en nom complet.
 * - transformDaysArray(daysArray): Transforme un tableau d'abréviations de jours en noms complets.
 * - groupBy(array, key): Regroupe les éléments d'un tableau par une clé spécifique.
 * - displayTimeSlots(timeSlotsArray): Affiche des créneaux horaires dans un format lisible.
 * - displayParsedResults(parsedResults): Affiche les résultats analysés par le parser, incluant les créneaux d'enseignement.
 *
 * @dependencies
 * - Aucune dépendance externe. Ce fichier fonctionne avec des modules JavaScript natifs et est destiné à être utilisé avec d'autres modules du projet.
 *
 * @usage
 *   import * as functions from './functions.js';
 *
 * @note
 * - Ce fichier ne contient que des fonctions utilitaires génériques. Chaque fonction peut être importée individuellement ou toutes ensemble.
 * - Les transformations de jours, tels que `L` en `Lundi`, facilitent la lisibilité des créneaux affichés pour les utilisateurs.
 *
 * @remarks
 * - Toutes les fonctions sont exportées pour être accessibles depuis d'autres fichiers JavaScript du projet.
 * - Les méthodes de tri et de regroupement ont été optimisées pour faciliter les différentes fonctionnalités des spécifications.
 */

// Tableau de référence pour l'ordre des jours et leur nom complet
const dayOrder = ['L', 'MA', 'ME', 'J', 'V', 'S', 'D'];
const dayNames = {
    'L': 'Lundi',
    'MA': 'Mardi',
    'ME': 'Mercredi',
    'J': 'Jeudi',
    'V': 'Vendredi',
    'S': 'Samedi',
    'D': 'Dimanche'
};

/**
 * Fonction pour obtenir le code de jour correspondant à un indice de jour de la semaine
 * @param {number} dayOfWeek Indice du jour de la semaine (0 pour dimanche, 1 pour lundi, etc.)
 * @returns {string} Le code du jour (ex: 'L' pour lundi, 'MA' pour mardi, etc.)
 */
function getDayCode(dayOfWeek) {
    switch (dayOfWeek) {
        case 1: return 'L';   // Lundi
        case 2: return 'MA';  // Mardi
        case 3: return 'ME';  // Mercredi
        case 4: return 'J';   // Jeudi
        case 5: return 'V';   // Vendredi
        case 6: return 'S';   // Samedi
        case 0: return 'D';   // Dimanche
        default: return '';   // Valeur par défaut si l'indice est invalide
    }
}

/**
 * Fonction pour trier un tableau de jours selon l'ordre prédéfini
 * @param {Array} daysArray Tableau contenant des abréviations de jours (ex: ['MA', 'L', 'V'])
 * @returns {Array} Tableau trié des jours selon l'ordre chronologique
 */
function sortDays(daysArray) {
    return daysArray.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));
}

/**
 * Fonction pour transformer une abréviation de jour en nom complet
 * @param {string} dayCode Abréviation du jour (ex: 'L', 'MA', 'ME')
 * @returns {string} Nom complet du jour (ex: 'Lundi', 'Mardi')
 */
function transformDayName(dayCode) {
    return dayNames[dayCode] || dayCode;
}

/**
 * Fonction pour transformer un tableau de jours abrégés en un tableau de noms complets
 * @param {Array} daysArray Tableau contenant des abréviations de jours
 * @returns {Array} Tableau contenant les noms complets des jours
 */
function transformDaysArray(daysArray) {
    return daysArray.map(dayCode => transformDayName(dayCode));
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

/**
 * Fonction utilitaire pour afficher les détails d'un créneau
 * @param {Object} timeSlot Le créneau à afficher
 */
function displayTimeSlot(timeSlot) {
    console.log(`Cours : ${timeSlot.course}`);
    console.log(`  - ID          : ${timeSlot.id}`);
    console.log(`  - Type        : ${timeSlot.type}`);
    console.log(`  - Capacité    : ${timeSlot.capacity}`);
    console.log(`  - Jour        : ${transformDayName(timeSlot.day)}`);
    console.log(`  - Heures      : ${timeSlot.startTime} - ${timeSlot.endTime}`);
    console.log(`  - Salle       : ${timeSlot.room}`);
    console.log(`  - Index       : ${timeSlot.index}`);
}

/**
 * Fonction utilitaire pour afficher des créneaux horaires dans un format lisible
 * @param {Array} timeSlotsArray Tableau contenant les créneaux horaires
 */
function displayTimeSlots(timeSlotsArray) {
    timeSlotsArray.forEach((timeSlot, index) => {
        console.log(`Créneau #${index + 1}:`);
        console.log(`  - Jour     : ${transformDayName(timeSlot.day)}`);
        console.log(`  - Heures   : ${timeSlot.startTime} - ${timeSlot.endTime}`);
        console.log('-----------------------------------');
    });
}

/**
 * Fonction pour afficher les résultats provenant du parser
 * @param {Array} parsedResults Tableau contenant les créneaux analysés du parser
 */
function displayParsedResults(parsedResults) {
    if (parsedResults.length === 0) {
        console.log("❌ Aucun créneau trouvé à afficher.");
        return;
    }

    console.log("✅ Résultats de l'analyse des créneaux :\n");

    // Grouper les créneaux par cours
    const coursesGrouped = groupBy(parsedResults, 'course');

    // Afficher chaque cours et ses créneaux
    Object.entries(coursesGrouped).forEach(([courseName, timeSlots]) => {
        console.log(`Cours : ${courseName}`);
        timeSlots.forEach((timeSlot, index) => {
            console.log(`  Créneau #${index + 1}:`);
            console.log(`    - ID          : ${timeSlot.id}`);
            console.log(`    - Type        : ${timeSlot.type}`);
            console.log(`    - Capacité    : ${timeSlot.capacity}`);
            console.log(`    - Jour        : ${transformDayName(timeSlot.day)}`);
            console.log(`    - Heures      : ${timeSlot.startTime} - ${timeSlot.endTime}`);
            console.log(`    - Salle       : ${timeSlot.room}`);
            console.log(`    - Index       : ${timeSlot.index}`);
            console.log('-----------------------------------');
        });
    });
}

// Export des fonctions
export {
    dayOrder,
    dayNames,
    getDayCode,
    sortDays,
    transformDayName,
    transformDaysArray,
    groupBy,
    displayTimeSlot,
    displayTimeSlots,
    displayParsedResults
};
