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
 * @version 1.1
 * @date Décembre 2024
 *
 * @functions
 * - verifyRoomConflicts(directory, dayCode, startTime, endTime): Vérifie les chevauchements de salles pour un jour et une plage horaire spécifiés, 
 *   ou pour tous les jours et créneaux si seuls `directory` est fourni.
 * - findConflictsInTimeSlots(timeSlots): Vérifie les chevauchements parmi un ensemble de créneaux horaires.
 * - isOverlapping(timeSlot1, timeSlot2): Vérifie si deux créneaux se chevauchent.
 * - isWithinTimeRange(timeSlot, inputStart, inputEnd): Vérifie si un créneau est dans la plage horaire spécifiée.
 * - displayConflicts(overlappingTimeSlots): Affiche les conflits détectés.
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
 * - Les noms de salles doivent correspondre exactement, sans tenir compte de la casse.
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
 * @returns {Array} Liste des créneaux qui se chevauchent
 */
function verifyRoomConflicts(directory, dayCode = null, startTime = "8:00", endTime = "20:00") {
    // Parser tous les fichiers edt.cru dans le répertoire donné
    const allTimeSlots = parser.parseAllEdtFiles(directory);

    // Si dayCode, startTime ou endTime ne sont pas spécifiés, vérifier tous les jours et tous les créneaux
    if (!dayCode && !startTime && !endTime) {
        const allDayCodes = ['L', 'MA', 'ME', 'J', 'V', 'S', 'D'];
        let allConflicts = [];

        // Vérifier chaque jour de la semaine pour tous les créneaux horaires possibles
        allDayCodes.forEach(day => {
            const filteredTimeSlotsByDay = allTimeSlots.filter(timeSlot => timeSlot.day === day);
            const conflicts = findConflictsInTimeSlots(filteredTimeSlotsByDay);
            allConflicts = allConflicts.concat(conflicts);
        });

        // Afficher les résultats globaux
        displayConflicts(allConflicts);
        return allConflicts;
    } else {
        // Vérifier pour un jour et une plage horaire spécifiques
        const filteredTimeSlotsByDay = allTimeSlots.filter(timeSlot => timeSlot.day === dayCode);

        // Liste pour stocker les conflits détectés
        let overlappingTimeSlots = [];

        // Convertir les heures de début et de fin spécifiées en minutes depuis minuit
        const [inputStartHour, inputStartMinute] = startTime.split(':').map(Number);
        const [inputEndHour, inputEndMinute] = endTime.split(':').map(Number);
        const inputStart = inputStartHour * 60 + inputStartMinute;
        const inputEnd = inputEndHour * 60 + inputEndMinute;

        // Parcourir les créneaux pour vérifier les chevauchements dans la même salle
        for (let i = 0; i < filteredTimeSlotsByDay.length; i++) {
            for (let j = i + 1; j < filteredTimeSlotsByDay.length; j++) {
                const timeSlot1 = filteredTimeSlotsByDay[i];
                const timeSlot2 = filteredTimeSlotsByDay[j];

                // Vérifier si les créneaux sont dans la même salle et sont différents
                if (timeSlot1.room === timeSlot2.room && timeSlot1.course !== timeSlot2.course) {
                    // Vérifier si les créneaux se chevauchent dans la tranche horaire spécifiée
                    if (isWithinTimeRange(timeSlot1, inputStart, inputEnd) && isWithinTimeRange(timeSlot2, inputStart, inputEnd)) {
                        if (isOverlapping(timeSlot1, timeSlot2)) {
                            overlappingTimeSlots.push({
                                timeSlot1,
                                timeSlot2
                            });
                        }
                    }
                }
            }
        }

        // Afficher les résultats
        displayConflicts(overlappingTimeSlots);
        return overlappingTimeSlots;
    }
}

/**
 * Fonction pour vérifier les chevauchements parmi un ensemble de créneaux
 * @param {Array} timeSlots Les créneaux à vérifier
 * @returns {Array} Liste des conflits détectés
 */
function findConflictsInTimeSlots(timeSlots) {
    let overlappingTimeSlots = [];

    for (let i = 0; i < timeSlots.length; i++) {
        for (let j = i + 1; j < timeSlots.length; j++) {
            const timeSlot1 = timeSlots[i];
            const timeSlot2 = timeSlots[j];

            // Vérifier si les créneaux sont dans la même salle et sont différents
            if (timeSlot1.room === timeSlot2.room && timeSlot1.course !== timeSlot2.course) {
                if (isOverlapping(timeSlot1, timeSlot2)) {
                    overlappingTimeSlots.push({
                        timeSlot1,
                        timeSlot2
                    });
                }
            }
        }
    }
    return overlappingTimeSlots;
}

/**
 * Fonction pour vérifier si deux créneaux se chevauchent
 * @param {Object} timeSlot1 Premier créneau
 * @param {Object} timeSlot2 Deuxième créneau
 * @returns {boolean} true si les créneaux se chevauchent, false sinon
 */
function isOverlapping(timeSlot1, timeSlot2) {
    // Extraire les heures de début et de fin
    const [startHour1, startMinute1] = timeSlot1.startTime.split(':').map(Number);
    const [endHour1, endMinute1] = timeSlot1.endTime.split(':').map(Number);
    const [startHour2, startMinute2] = timeSlot2.startTime.split(':').map(Number);
    const [endHour2, endMinute2] = timeSlot2.endTime.split(':').map(Number);

    // Convertir les heures en minutes depuis minuit pour faciliter la comparaison
    const start1 = startHour1 * 60 + startMinute1;
    const end1 = endHour1 * 60 + endMinute1;
    const start2 = startHour2 * 60 + startMinute2;
    const end2 = endHour2 * 60 + endMinute2;

    // Les créneaux se chevauchent si le début d'un est avant la fin de l'autre et inversement
    return (start1 < end2 && start2 < end1);
}

/**
 * Fonction pour vérifier si un créneau est dans la plage horaire spécifiée
 * @param {Object} timeSlot Créneau à vérifier
 * @param {number} inputStart Heure de début spécifiée (en minutes depuis minuit)
 * @param {number} inputEnd Heure de fin spécifiée (en minutes depuis minuit)
 * @returns {boolean} true si le créneau est dans la plage horaire, false sinon
 */
function isWithinTimeRange(timeSlot, inputStart, inputEnd) {
    const [startHour, startMinute] = timeSlot.startTime.split(':').map(Number);
    const [endHour, endMinute] = timeSlot.endTime.split(':').map(Number);

    // Convertir les heures en minutes depuis minuit
    const start = startHour * 60 + startMinute;
    const end = endHour * 60 + endMinute;

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
            functions.displayTimeSlot(conflict.timeSlot1);
            console.log(`Créneau #2 :`);
            functions.displayTimeSlot(conflict.timeSlot2);
            console.log('-----------------------------------');
        });
    } else {
        console.log("✅ Aucun conflit détecté. Les créneaux sont conformes.");
    }
}

// Exporter la fonction pour une utilisation externe
export { verifyRoomConflicts };
