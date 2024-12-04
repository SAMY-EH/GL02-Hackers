/**
 * @file spec6.js
 * @description Ce fichier contient le code permettant de vérifier les chevauchements dans les créneaux des salles d'un emploi du temps,
 *              soit pour un jour et un créneau horaire spécifiques, soit pour tous les jours de la semaine et tous les créneaux horaires possibles.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_06 - Vérification de la conformité des données.
 *          Le logiciel doit vérifier qu'aucune salle ne soit utilisée par deux cours différents au même créneau horaire.
 *
 * @author Théo TORREILLES, Julie VAN HOUDENHOVE
 * @version 1.3
 * @date Décembre 2024
 *
 * @functions
 * - verifyRoomConflicts(directory, dayCode, startTime, endTime, showResult): Vérifie les chevauchements de salles pour un jour et une plage horaire spécifiés, 
 *   ou pour tous les jours et créneaux si seuls `directory` est fourni.
 * - generateConflictKey(timeSlot1, timeSlot2): Génère une clé unique pour un conflit entre deux créneaux.
 * - isOverlapping(timeSlot1, timeSlot2): Vérifie si deux créneaux se chevauchent.
 * - isWithinTimeRange(timeSlot, inputStart, inputEnd): Vérifie si un créneau est dans la plage horaire spécifiée.
 * - displayConflicts(overlappingTimeSlots): Affiche les conflits détectés.
 * - displayTimeSlot(timeSlot): Affiche les détails d'un crénau.
 *
 * @dependencies
 * - Module personnalisé 'functions.js' : Fournit des fonctions utilitaires.
 * - Module personnalisé 'parser.js' : Utilisé pour analyser les fichiers edt.cru et extraire les créneaux d'enseignement.
 *
 * @usage
 *   import { verifyRoomConflicts } from './spec6.js';
 *   // Pour vérifier un jour et une plage horaire spécifiques
 *   const directory = './data';
 *   const dayCode = 'L'; // Exemple : vérifier pour lundi
 *   const startTime = '8:00';
 *   const endTime = '12:00';
 *   verifyRoomConflicts(directory, dayCode, startTime, endTime);
 *   // Pour vérifier tous les jours et créneaux horaires si seul `directory` est spécifié
 *   verifyRoomConflicts(directory);
 *
 * @note
 * - Les données sont extraites des fichiers edt.cru présents dans le répertoire spécifié.
 * - Les créneaux horaires sont considérés comme se chevauchant s'ils ont au moins une minute en commun.
 * - Si aucun chevauchement n'est détecté, un message indiquant que les créneaux sont conformes est affiché.
 * - Si des chevauchements sont détectés, un message d'erreur est affiché avec les détails des conflits.
 * 
 * @remarks
 * - Assurez-vous que le répertoire contenant les fichiers edt.cru est correctement spécifié.
 * - Les jours de la semaine doivent être spécifiés en utilisant les codes suivants : 'L', 'MA', 'ME', 'J', 'V', 'S', 'D'.
 * - Les créneaux horaires sont spécifiés au format 'HH:MM' (24h).
 */

// Importer les modules nécessaires
import * as functions from '../utility/functions.js';
import * as parser from '../utility/parser.js';

/**
 * Fonction pour vérifier les chevauchements dans les créneaux des salles
 * - Si seuls `directory` est spécifié, vérifie tous les jours et créneaux horaires.
 * @param {string} directory Le répertoire contenant les fichiers edt.cru
 * @param {string} [dayCode] (Optionnel) Le code du jour à vérifier (Ex.: 'L', 'MA', 'ME')
 * @param {string} [startTime] (Optionnel) Heure de début à vérifier (Ex.: '10:00')
 * @param {string} [endTime] (Optionnel) Heure de fin à vérifier (Ex.: '12:00')
 * @param {boolean} [showResult] Indique si les résultats doivent être affichés dans la console (par défaut : true)
 * @returns {Array} Liste des créneaux qui se chevauchent
 */
function verifyRoomConflicts(directory, dayCode = null, startTime = null, endTime = null, showResult = true) {
    // Parser tous les fichiers edt.cru dans le répertoire donné
    const allTimeSlots = parser.parseAllEdtFiles(directory);

    let allConflicts = [];
    let uniqueConflicts = new Set();

    // Si dayCode, startTime ou endTime ne sont pas spécifiés, vérifier tous les jours et tous les créneaux
    const daysToCheck = dayCode ? [dayCode] : ['L', 'MA', 'ME', 'J', 'V', 'S', 'D'];
    const inputStart = functions.normalizeTime(startTime || "08:00");
    const inputEnd = functions.normalizeTime(endTime || "20:00");

    // Vérifier chaque jour de la semaine pour tous les créneaux horaires possibles
    daysToCheck.forEach(day => {
        const filteredTimeSlotsByDay = allTimeSlots.filter(timeSlot => timeSlot.day === day);

        // Vérifier pour les créneaux du jour spécifié
        for (let i = 0; i < filteredTimeSlotsByDay.length; i++) {
            for (let j = i + 1; j < filteredTimeSlotsByDay.length; j++) {
                const timeSlot1 = filteredTimeSlotsByDay[i];
                const timeSlot2 = filteredTimeSlotsByDay[j];

                // Vérifier si les créneaux sont dans la même salle et sont différents
                if (timeSlot1.room === timeSlot2.room && timeSlot1.course !== timeSlot2.course) {
                    // Vérifier si les créneaux se chevauchent dans la tranche horaire spécifiée
                    if (isWithinTimeRange(timeSlot1, inputStart, inputEnd) && isWithinTimeRange(timeSlot2, inputStart, inputEnd)) {
                        if (isOverlapping(timeSlot1, timeSlot2)) {
                            // Générer une clé unique pour le conflit en utilisant des propriétés distinctes
                            const conflictKey = generateConflictKey(timeSlot1, timeSlot2);
                            if (!uniqueConflicts.has(conflictKey)) {
                                uniqueConflicts.add(conflictKey);
                                allConflicts.push({
                                    timeSlot1,
                                    timeSlot2
                                });
                            }
                        }
                    }
                }
            }
        }
    });

    // Afficher les résultats globaux
    if (showResult) displayConflicts(allConflicts);
    
    return allConflicts;
}

/**
 * Génère une clé unique pour un conflit entre deux créneaux
 * @param {Object} timeSlot1 Premier créneau
 * @param {Object} timeSlot2 Deuxième créneau
 * @returns {string} Clé unique représentant le conflit
 */
function generateConflictKey(timeSlot1, timeSlot2) {
    // Utiliser un ensemble de propriétés pour générer une clé unique qui garantit l'unicité des conflits
    const keyComponents = [
        timeSlot1.room,
        timeSlot1.day,
        timeSlot1.startTime,
        timeSlot1.endTime,
        timeSlot2.course,
        timeSlot2.startTime,
        timeSlot2.endTime
    ];
    return keyComponents.sort().join("-");
}

/**
 * Fonction pour vérifier si deux créneaux se chevauchent
 * @param {Object} timeSlot1 Premier créneau
 * @param {Object} timeSlot2 Deuxième créneau
 * @returns {boolean} true si les créneaux se chevauchent, false sinon
 */
function isOverlapping(timeSlot1, timeSlot2) {
    // Extraire les heures de début et de fin
    const start1 = functions.normalizeTime(timeSlot1.startTime);
    const end1 = functions.normalizeTime(timeSlot1.endTime);
    const start2 = functions.normalizeTime(timeSlot2.startTime);
    const end2 = functions.normalizeTime(timeSlot2.endTime);

    // Les créneaux se chevauchent s'il y a une intersection entre les créneaux
    return (start1 < end2 && start2 < end1);
}

/**
 * Fonction pour vérifier si un créneau est dans la plage horaire spécifiée
 * @param {Object} timeSlot Créneau à vérifier
 * @param {string} inputStart Heure de début spécifiée (format 'HH:mm')
 * @param {string} inputEnd Heure de fin spécifiée (format 'HH:mm')
 * @returns {boolean} true si le créneau est dans la plage horaire, false sinon
 */
function isWithinTimeRange(timeSlot, inputStart, inputEnd) {
    const start = functions.normalizeTime(timeSlot.startTime);
    const end = functions.normalizeTime(timeSlot.endTime);

    // Vérifier si le créneau est dans la plage horaire spécifiée
    return (start < inputEnd && end > inputStart);
}

/**
 * Fonction pour afficher les conflits détectés
 * @param {Array} overlappingTimeSlots Liste des conflits à afficher
 */
function displayConflicts(overlappingTimeSlots) {
    if (overlappingTimeSlots.length > 0) {
        console.error(`❌ Des conflits ont été détectés :\n`);
        overlappingTimeSlots.forEach((conflict, index) => {
            console.log(`Conflit #${index + 1} :`);
            console.log(`Créneau #1 :`);
            displayTimeSlot(conflict.timeSlot1);
            console.log(`Créneau #2 :`);
            displayTimeSlot(conflict.timeSlot2);
            console.log('-----------------------------------');
        });
    } else {
        console.log("✅ Aucun conflit détecté. Les créneaux sont conformes.");
    }
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
    console.log(`  - Jour        : ${functions.transformDayName(timeSlot.day)}`);
    console.log(`  - Heures      : ${timeSlot.startTime} - ${timeSlot.endTime}`);
    console.log(`  - Salle       : ${timeSlot.room}`);
    console.log(`  - Index       : ${timeSlot.index}`);
}

// Exporter la fonction pour une utilisation externe
export { verifyRoomConflicts };
