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
 * @version 1.1
 * @date Décembre 2024
 *
 * @functions
 * - findRoomAvailability(directory, roomName): Recherche et affiche les créneaux horaires disponibles pour une salle donnée.
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
 * @returns {Object} Une liste des créneaux libres disponibles pour la salle
 */
function findRoomAvailability(directory, roomName) {
    // Parser tous les fichiers edt.cru dans le répertoire donné
    const allTimeSlots = parser.parseAllEdtFiles(directory);

    // Récupérer les créneaux de la salle demandée
    const bookedSlots = allTimeSlots.filter(timeSlot => timeSlot.room.toLowerCase() === roomName.toLowerCase());

    // Si aucun créneau réservé n'est trouvé, afficher un message indiquant que la salle est introuvable
    if (bookedSlots.length === 0) {
        console.error(`❌ Erreur : La salle nommée "${roomName}" n'a pas été trouvée dans le système. Vérifiez le nom de la salle et réessayez.`);
        return {};
    }

    // Définir les créneaux horaires disponibles par jour (de 8h à 20h)
    const availableSlots = {};
    functions.dayOrder.forEach(day => {
        availableSlots[day] = [
            { start: '08:00', end: '20:00' }
        ];
    });

    // Supprimer les créneaux réservés pour chaque jour
    bookedSlots.forEach(slot => {
        const day = slot.day;
        const startTime = slot.startTime;
        const endTime = slot.endTime;

        if (availableSlots[day]) {
            const updatedSlots = [];

            availableSlots[day].forEach(availableSlot => {
                if (startTime >= availableSlot.end || endTime <= availableSlot.start) {
                    // Pas de chevauchement, le créneau reste tel quel
                    updatedSlots.push(availableSlot);
                } else {
                    // Il y a chevauchement, on crée de nouveaux créneaux si nécessaire
                    if (availableSlot.start < startTime) {
                        updatedSlots.push({ start: availableSlot.start, end: startTime });
                    }
                    if (availableSlot.end > endTime) {
                        updatedSlots.push({ start: endTime, end: availableSlot.end });
                    }
                }
            });

            availableSlots[day] = updatedSlots;
        }
    });

    // Affichage des créneaux disponibles
    let isRoomAvailable = false; // Indicateur pour vérifier si la salle est libre à un moment quelconque
    console.log(`✅ Créneaux libres pour la salle "${roomName}":\n`);
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

    // Si aucun créneau n'est disponible durant la semaine
    if (!isRoomAvailable) {
        console.error(`❌ La salle "${roomName}" est entièrement occupée et ne possède aucun créneau libre cette semaine.`);
    }

    return availableSlots;
}

// Exporter la fonction pour une utilisation externe
export { findRoomAvailability };
