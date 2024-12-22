/**
 * @file spec7.js
 * @description Ce fichier contient le code permettant de visualiser le taux d'occupation des salles d'un emploi du temps,
 *              sur une période spécifiée, en fonction des créneaux horaires disponibles et occupés.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_07 - Visualisation du taux d'occupation des salles.
 *          Le système doit pouvoir générer une visualisation synthétique du taux d’occupation des salles sur une période donnée.
 *
 * @author Théo TORREILLES, Julie VAN HOUDENHOVE
 * @version 1.3
 * @date Décembre 2024
 *
 * @functions
 * - visualizeRoomOccupancy(directory, startDate, endDate, showResult): Génère une visualisation textuelle du taux d'occupation des salles
 *   sur une période spécifiée. Affiche également le nombre de créneaux occupés et disponibles pour chaque salle.
 *
 * @dependencies
 * - Module personnalisé 'functions.js' : Fournit des fonctions utilitaires.
 * - Module personnalisé 'parser.js' : Utilisé pour analyser les fichiers edt.cru et extraire les créneaux d'enseignement.
 *
 * @usage
 *   import { visualizeRoomOccupancy } from './spec7.js';
 *   const directory = './data';
 *   const startDate = new Date('2024-12-02');
 *   const endDate = new Date('2024-12-08');
 *   visualizeRoomOccupancy(directory, startDate, endDate);
 *
 * @note
 * - Les données sont extraites des fichiers edt.cru présents dans le répertoire spécifié.
 * - Les créneaux horaires par défaut vont de 08:00 à 20:00 pour chaque jour.
 * - Les salles sont triées par bâtiment et par ordre alphabétique.
 * - Si aucune salle n'est disponible dans la période spécifiée, un message d'erreur est affiché.
 * 
 * @remarks
 * - Assurez-vous que le répertoire contenant les fichiers edt.cru est correctement spécifié.
 * - Les dates de début et de fin doivent être spécifiées au format Date.
 * - Les créneaux horaires sont exprimés en tranches de 30 minutes.
 */

// Importer les modules nécessaires
import * as parser from '../utility/parser.js';
import * as functions from '../utility/functions.js';

/**
 * Fonction pour visualiser le taux d'occupation des salles sur une période spécifiée
 * @param {string} directory Le répertoire contenant les fichiers edt.cru
 * @param {Date} startDate La date de début de la période
 * @param {Date} endDate La date de fin de la période
 * @param {boolean} [showResult] Indique si les résultats doivent être affichés dans la console (par défaut : true)
 * @returns {Object} Un objet contenant les données d'occupation des salles
 */
function visualizeRoomOccupancy(directory, startDate, endDate, showResult = true) {
    const openingHour = 8; // 8h00
    const closingHour = 20; // 20h00
    const totalSlotsPerDay = (closingHour - openingHour) * 2; // Créneaux de 30 minutes par jour

    const allTimeSlots = parser.parseAllEdtFiles(directory);

    if (allTimeSlots.length === 0) {
        if (showResult) console.error('❌ Erreur : Aucune donnée d\'occupation de salle n\'est disponible dans le répertoire spécifié.');
        return;
    }

    const roomOccupancy = {};
    const allRooms = [...new Set(allTimeSlots.map(timeSlot => timeSlot.room))];
    allRooms.forEach(room => {
        roomOccupancy[room] = {
            totalOccupiedSlots: 0,
            totalSlots: 0
        };
    });
// Parcourir chaque jour de la période spécifiée
    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        const dayOfWeek = currentDate.getDay();
        const dayCode = functions.getDayCode(dayOfWeek);
// Ajouter les créneaux disponibles pour chaque salle
        allRooms.forEach(room => {
            roomOccupancy[room].totalSlots += totalSlotsPerDay;
        });
// Filtrer les créneaux horaires pour le jour actuel
        const filteredTimeSlots = allTimeSlots.filter(timeSlot => timeSlot.day === dayCode);

        // Calculer les créneaux occupés pour chaque salle
        filteredTimeSlots.forEach(timeSlot => {
            const [startHour, startMinute] = timeSlot.startTime.split(':').map(Number);
            const [endHour, endMinute] = timeSlot.endTime.split(':').map(Number);

            const startInMinutes = startHour * 60 + startMinute;
            const endInMinutes = endHour * 60 + endMinute;

            const slotsOccupied = Math.ceil((endInMinutes - startInMinutes) / 30);
            roomOccupancy[timeSlot.room].totalOccupiedSlots += slotsOccupied;
        });
    }


    for (const room in roomOccupancy) {
        // Correction taux d'occupation supérieurs à 100%
        if (roomOccupancy[room].totalSlots < roomOccupancy[room].totalOccupiedSlots) {
            roomOccupancy[room].totalOccupiedSlots = roomOccupancy[room].totalSlots;
        }
        // Correction des valeurs négatives pour les créneaux disponibles
        const occupancyRate = ((roomOccupancy[room].totalOccupiedSlots / roomOccupancy[room].totalSlots) * 100).toFixed(2);
        roomOccupancy[room].occupancyRate = occupancyRate;
    }

    // Afficher les résultats si nécessaire
    if (showResult) {
        const roomsByBuilding = Object.entries(roomOccupancy).reduce((acc, [room, occupancy]) => {
            if (room.startsWith('EXT') || room.startsWith('IUT') || room.startsWith('SPOR')) {
                if (!acc['EXCEPTIONS']) {
                    acc['EXCEPTIONS'] = [];
                }
                acc['EXCEPTIONS'].push({ room, occupancy });
            } else {
                const building = room[0];
                if (!acc[building]) {
                    acc[building] = [];
                }
                acc[building].push({ room, occupancy });
            }
            return acc;
        }, {});

        const sortedBuildings = Object.keys(roomsByBuilding)
            .filter(building => building !== 'EXCEPTIONS')
            .sort((a, b) => a.localeCompare(b));

        if (roomsByBuilding['EXCEPTIONS']) {
            sortedBuildings.push('EXCEPTIONS');
        }

        sortedBuildings.forEach(building => {
            roomsByBuilding[building].sort((a, b) => a.room.localeCompare(b.room));
        });

        console.log('✅ Taux d\'occupation des salles (triées par bâtiment et par ordre croissant) :\n');

        sortedBuildings.forEach(building => {
            if (building === 'EXCEPTIONS') {
                console.log('Salles exceptionnelles :');
            } else {
                console.log(`Bâtiment ${building} :`);
            }
            roomsByBuilding[building].forEach(({ room, occupancy }) => {
                console.log(`  - Salle : ${room}`);
                console.log(`    - Taux d'occupation            : ${occupancy.occupancyRate}%`);
                console.log(`    - Créneaux occupés (30mn)      : ${occupancy.totalOccupiedSlots}`);
                console.log(`    - Créneaux disponibles (30mn)  : ${occupancy.totalSlots - occupancy.totalOccupiedSlots}`);
                console.log('---------------------------------------------');
            });
        });
    }

    return roomOccupancy;
}

// Exporter la fonction pour une utilisation externe
export { visualizeRoomOccupancy };
