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
 * @version 1.1
 * @date Décembre 2024
 *
 * @functions
 * - getDayCode(dayOfWeek): Obtient le code de jour correspondant à un indice de jour de la semaine.
 * - sortDays(daysArray): Trie un tableau de jours selon un ordre prédéfini.
 * - transformDayName(dayCode): Transforme une abréviation de jour en nom complet.
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

// Export des fonctions
export {
    dayOrder,
    dayNames,
    getDayCode,
    sortDays,
    transformDayName
};
