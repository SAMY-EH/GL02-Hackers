/**
 * @file spec4.js
 * @description Ce fichier contient le code permettant de rechercher les salles disponibles pour un créneau horaire donné.
 *              Il identifie les salles libres pour une plage horaire spécifique afin de permettre la planification
 *              de sessions de travail collaboratif ou d'autres activités nécessitant des espaces disponibles.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_04 - Recherche de salle disponible pour un créneau donné.
 *          Les utilisateurs doivent pouvoir connaître les salles disponibles pour un créneau horaire donné.
 *
 * @author Théo TORREILLES, Julie VAN HOUDENHOVE, Lucie GUÉRIN
 * @version 1.2
 * @date Décembre 2024
 *
 * @functions
 * - findAvailableRoomsForTimeSlot(directory, dayCode, startTime, endTime): Recherche les salles disponibles pour un créneau donné.
 *
 * @dependencies
 * - Module personnalisé 'functions.js' : Fournit des fonctions utilitaires.
 * - Module personnalisé 'parser.js' : Utilisé pour analyser les fichiers edt.cru et extraire les créneaux d'enseignement.
 *
 * @usage
 *   import { findAvailableRoomsForTimeSlot } from './spec4.js';
 *   const availableRooms = findAvailableRoomsForTimeSlot('./data', 'MA', '14:00', '16:00');
 *
 * @note
 * - Les données sont extraites des fichiers edt.cru présents dans le répertoire spécifié.
 * - La fonction prend en compte le chevauchement des créneaux pour déterminer les salles libres.
 * - Si aucune salle n'est disponible, des messages d'erreur appropriés sont affichés.
 * - Les salles sont triées par bâtiment et par ordre alphabétique.
 * - Les salles exceptionnelles (EXT, IUT, SPOR) sont regroupées à la fin de la liste.
 *
 * @remarks
 * - Assurez-vous que le répertoire des fichiers edt.cru est correctement défini.
 * - Les jours de la semaine doivent être spécifiés en utilisant les codes suivants : 'L', 'MA', 'ME', 'J', 'V', 'S', 'D'.
 * - Les créneaux horaires doivent être spécifiés au format 'HH:MM' (24h).
 */

// Importer les modules nécessaires
import * as functions from '../utility/functions.js';
import * as parser from '../utility/parser.js';

/**
 * Fonction pour rechercher les salles disponibles pour un créneau donné
 * @param {string} directory Le répertoire contenant les fichiers edt.cru
 * @param {string} dayCode Le jour du créneau à vérifier ('L', 'MA', 'ME', 'J', 'V', 'S', 'D')
 * @param {string} startTime L'heure de début du créneau à vérifier (Ex. : '14:00')
 * @param {string} endTime L'heure de fin du créneau à vérifier (Ex. : '16:00')
 * @returns {Array} Une liste des salles disponibles pour le créneau donné
 */
function findAvailableRoomsForTimeSlot(directory, dayCode, startTime, endTime) {
    // Parser tous les fichiers edt.cru dans le répertoire donné
    const allTimeSlots = parser.parseAllEdtFiles(directory);

    // Convertir les heures de début et de fin du créneau à vérifier en minutes depuis minuit
    const [inputStartHour, inputStartMinute] = startTime.split(':').map(Number);
    const [inputEndHour, inputEndMinute] = endTime.split(':').map(Number);
    const inputStart = inputStartHour * 60 + inputStartMinute;
    const inputEnd = inputEndHour * 60 + inputEndMinute;

    // Collecter les salles qui ne sont pas disponibles pour le créneau donné
    const unavailableRooms = allTimeSlots
        .filter(slot => slot.day === dayCode)
        .filter(slot => {
            // Convertir les heures de début et de fin du créneau existant en minutes depuis minuit
            const [slotStartHour, slotStartMinute] = slot.startTime.split(':').map(Number);
            const [slotEndHour, slotEndMinute] = slot.endTime.split(':').map(Number);
            const slotStart = slotStartHour * 60 + slotStartMinute;
            const slotEnd = slotEndHour * 60 + slotEndMinute;

            // Vérifier si le créneau existant chevauche le créneau donné
            return (inputStart < slotEnd && inputEnd > slotStart);
        })
        .map(slot => slot.room);

    // Collecter toutes les salles possibles
    const allRooms = [...new Set(allTimeSlots.map(slot => slot.room))];

    // Calculer les salles disponibles en excluant les salles non disponibles
    const availableRooms = allRooms.filter(room => !unavailableRooms.includes(room));

    // Si aucune salle n'est disponible, retourner un message d'erreur
    if (availableRooms.length === 0) {
        console.error(`❌ Aucun créneau libre n'a été trouvé pour le jour "${functions.transformDayName(dayCode)}" entre ${startTime} et ${endTime}.`);
        return [];
    }

    // Regrouper les salles par bâtiment
    const roomsByBuilding = availableRooms.reduce((acc, room) => {
        // Vérifier les exceptions "EXT", "IUT" et "SPOR"
        if (room.startsWith('EXT') || room.startsWith('IUT') || room.startsWith('SPOR')) {
            if (!acc['EXCEPTIONS']) {
                acc['EXCEPTIONS'] = [];
            }
            acc['EXCEPTIONS'].push(room);
        } else {
            const building = room[0]; // Le premier caractère représente le bâtiment (par ex. 'B' pour B203)
            if (!acc[building]) {
                acc[building] = [];
            }
            acc[building].push(room);
        }
        return acc;
    }, {});

    // Trier les bâtiments par ordre alphabétique
    const sortedBuildings = Object.keys(roomsByBuilding)
        .filter(building => building !== 'EXCEPTIONS')
        .sort((a, b) => a.localeCompare(b));

    // Ajouter les exceptions à la fin
    if (roomsByBuilding['EXCEPTIONS']) {
        sortedBuildings.push('EXCEPTIONS');
    }

    // Trier les salles au sein de chaque bâtiment par ordre croissant
    sortedBuildings.forEach(building => {
        roomsByBuilding[building].sort();
    });

    // Afficher un message de confirmation et retourner les résultats regroupés et triés
    console.log(`✅ Salles disponibles pour le créneau "${functions.transformDayName(dayCode)} de ${startTime} à ${endTime}" (triées par bâtiment et par ordre croissant) :\n`);

    sortedBuildings.forEach(building => {
        if (building === 'EXCEPTIONS') {
            console.log(`Salles exceptionnelles :`);
        } else {
            console.log(`Bâtiment ${building} :`);
        }
        roomsByBuilding[building].forEach((room, index) => {
            console.log(`  - Salle #${index + 1}: ${room}`);
        });
        console.log('-----------------------------------');
    });

    return availableRooms;
}

// Exporter la fonction pour une utilisation externe
export { findAvailableRoomsForTimeSlot };
