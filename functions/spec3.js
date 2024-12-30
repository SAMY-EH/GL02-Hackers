/**
 * @file spec3.js
 * @description Ce fichier contient le code permettant de vérifier les disponibilités d'une salle donnée.
 *              Il identifie les créneaux horaires où une salle est libre afin de permettre la planification
 *              de sessions de travail collaboratif ou d'autres activités.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_03 - Vérification des disponibilités d'une salle.
 *          Le logiciel doit permettre de vérifier les moments où une salle spécifique est libre durant la semaine
 *          pour permettre du travail collaboratif.
 *
 * @author Théo TORREILLES, Lucie GUÉRIN
 * @version 1.2
 * @date Décembre 2024
 *
 * @functions
 * - findRoomAvailability(directory, roomName, showResult): Recherche et affiche les créneaux horaires disponibles pour une salle donnée.
 *
 * @dependencies
 * - Module personnalisé 'functions.js' : Fournit des fonctions utilitaires.
 * - Module personnalisé 'parser.js' : Utilisé pour analyser les fichiers edt.cru et extraire les créneaux d'enseignement.
 *
 * @usage
 *   import { findRoomAvailability } from './spec3.js';
 *   const availability = findRoomAvailability('./data', 'B210');
 *
 * @note
 * - Les données sont extraites des fichiers edt.cru présents dans le répertoire spécifié.
 * - Les créneaux horaires par défaut vont de 08:00 à 20:00 pour chaque jour.
 * - Si la salle n'existe pas ou si aucun créneau n'est disponible, des messages d'erreur appropriés sont affichés.
 * 
 * @remarks
 * - Assurez-vous que le répertoire contenant les fichiers edt.cru est correctement spécifié.
 * - Les noms de salles doivent correspondre exactement, sans tenir compte de la casse.
 */

// Importer les modules nécessaires
import * as functions from '../utility/functions.js';
import * as parser from '../utility/parser.js';

/**
 * Fonction pour vérifier les disponibilités d'une salle donnée
 * @param {string} directory Le répertoire contenant les fichiers edt.cru
 * @param {string} roomName Le nom de la salle à vérifier
 * @param {boolean} [showResult] Indique si les résultats doivent être affichés dans la console (par défaut : true)
 * @returns {Object} Une liste des créneaux libres disponibles pour la salle
 */
function findRoomAvailability(directory, roomName, showResult = true) {
    const allTimeSlots = parser.parseAllEdtFiles(directory);
    const bookedSlots = allTimeSlots.filter(timeSlot => timeSlot.room.toLowerCase() === roomName.toLowerCase());

    if (bookedSlots.length === 0) {
        if (showResult) console.error(`❌ Erreur : La salle nommée "${roomName}" n'a pas été trouvée dans le système. Vérifiez le nom de la salle et réessayez.`);
        return null;
    }

    const availableSlots = {};
    functions.dayOrder.forEach(day => {
        availableSlots[day] = [
            { start: '08:00', end: '20:00' }
        ];
    });

    bookedSlots.forEach(slot => {
        const day = slot.day;
        const startTime = functions.normalizeTime(slot.startTime);
        const endTime = functions.normalizeTime(slot.endTime);

        if (availableSlots[day]) {
            const updatedSlots = [];

            availableSlots[day].forEach(availableSlot => {
                const availableStart = functions.normalizeTime(availableSlot.start);
                const availableEnd = functions.normalizeTime(availableSlot.end);

                if (startTime >= availableEnd || endTime <= availableStart) {
                    updatedSlots.push(availableSlot);
                } else {
                    if (availableStart < startTime) {
                        updatedSlots.push({ start: availableStart, end: startTime });
                    }
                    if (availableEnd > endTime) {
                        updatedSlots.push({ start: endTime, end: availableEnd });
                    }
                }
            });

            availableSlots[day] = updatedSlots;
        }
    });

    if (showResult) {
        let isRoomAvailable = false;
        console.log(`✅ Créneaux libres pour la salle "${roomName}" :\n`);
        Object.entries(availableSlots).forEach(([day, slots]) => {
            if (slots.length > 0) {
                isRoomAvailable = true;
                console.log(`${functions.transformDayName(day)}`);
                slots.forEach(slot => {
                    console.log(`  - ${slot.start} - ${slot.end}`);
                });
                console.log('-----------------------------------');
            } else {
                console.log(`${functions.transformDayName(day)} - Aucun créneau libre`);
                console.log('-----------------------------------');
            }
        });

        if (!isRoomAvailable) {
            console.error(`❌ La salle "${roomName}" est entièrement occupée et ne possède aucun créneau libre cette semaine.`);
        }
    }

    return availableSlots;
}

// Exporter la fonction pour une utilisation externe
export { findRoomAvailability };
