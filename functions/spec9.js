/**
 * @file spec9.js
 * @description Ce fichier contient le code permettant de vérifier les salles sur-exploitées et sous-exploitées en fonction de leur taux d'occupation,
 *              sur une période spécifiée, afin d'aider le gestionnaire des locaux à planifier des ajustements futurs.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_09 - Consultation des salles sur ou sous-exploitées.
 *          Le gestionnaire des locaux doit pouvoir identifier quelles salles sont sous-exploitées ou surexploitées afin de planifier des ajustements futurs.
 *
 * @author Théo TORREILLES, Julie VAN HOUDENHOVE
 * @version 1.2
 * @date Décembre 2024
 *
 * @functions
 * - analyzeOverUnderUtilizedRooms(directory, startDate, endDate, underUtilizationThreshold, overUtilizationThreshold, showResult):
 *   Identifie les salles sous-exploitées et sur-exploitées pour une période donnée et les affiche triées par ordre croissant de taux d'occupation.
 *
 * @dependencies
 * - Module 'spec7.js' : Fournit la fonction visualizeRoomOccupancy pour obtenir des informations d'occupation des salles.
 *
 * @usage
 *   import { analyzeOverUnderUtilizedRooms } from './spec9.js';
 *   const directory = './data';
 *   const startDate = new Date('2024-12-02');
 *   const endDate = new Date('2024-12-08');
 *   const underUtilizationThreshold = 20;
 *   const overUtilizationThreshold = 80;
 *   analyzeOverUnderUtilizedRooms(directory, startDate, endDate, underUtilizationThreshold, overUtilizationThreshold);
 *
 * @note
 * - Les données sont extraites des fichiers edt.cru présents dans le répertoire spécifié.
 * - Les seuils de sous-utilisation et sur-utilisation peuvent être ajustés via les paramètres `underUtilizationThreshold` et `overUtilizationThreshold`.
 * - Par défaut, les seuils sont fixés à 20% (sous-utilisation) et 80% (sur-utilisation).
 * 
 * @remarks
 * - Assurez-vous que le répertoire contenant les fichiers edt.cru est correctement spécifié.
 * - Les dates de début et de fin doivent être spécifiées au format Date.
 * - Les résultats sont triés par ordre croissant du taux d'occupation des salles pour faciliter l'analyse.
 */

// Importer les modules nécessaires
import { visualizeRoomOccupancy } from './spec7.js';

/**
 * Fonction pour identifier les salles sur-exploitées et sous-exploitées
 * @param {string} directory Le répertoire contenant les fichiers edt.cru
 * @param {Date} startDate La date de début de la période d'analyse
 * @param {Date} endDate La date de fin de la période d'analyse
 * @param {number} underUtilizationThreshold Le seuil de sous-utilisation en pourcentage (par défaut 20%)
 * @param {number} overUtilizationThreshold Le seuil de sur-utilisation en pourcentage (par défaut 80%)
 * @param {boolean} [showResult] Indique si les résultats doivent être affichés dans la console (par défaut : true)
 * @returns {void} Affiche les salles sous-exploitées et sur-exploitées pour la période spécifiée
 */
function analyzeOverUnderUtilizedRooms(directory, startDate, endDate, underUtilizationThreshold = 20, overUtilizationThreshold = 80, showResult = true) {
    // Obtenir les données d'occupation des salles en appelant visualizeRoomOccupancy
    if (showResult) console.log('🔍 Analyse des taux d\'occupation des salles pour la période spécifiée...\n');
    
    // Utilisation de `visualizeRoomOccupancy` avec un flag pour obtenir les données sans les afficher.
    const roomOccupancy = visualizeRoomOccupancy(directory, startDate, endDate, false);

    if (!roomOccupancy || Object.keys(roomOccupancy).length === 0) {
        if (showResult) console.error('❌ Aucune donnée d\'occupation de salle n\'a été trouvée pour la période spécifiée.');
        return;
    }

    // Initialiser des tableaux pour les salles sur-exploitées et sous-exploitées
    const underUtilizedRooms = [];
    const overUtilizedRooms = [];

    // Analyser les taux d'occupation des salles
    Object.entries(roomOccupancy).forEach(([room, occupancy]) => {
        // Calculer le taux d'occupation
        const occupancyRate = ((occupancy.totalOccupiedSlots / (occupancy.totalOccupiedSlots + occupancy.totalSlots)) * 100);

        if (occupancyRate < underUtilizationThreshold) {
            underUtilizedRooms.push({ room, occupancyRate });
        } else if (occupancyRate > overUtilizationThreshold) {
            overUtilizedRooms.push({ room, occupancyRate });
        }
    });

    // Trier les salles par ordre croissant de taux d'occupation
    underUtilizedRooms.sort((a, b) => a.occupancyRate - b.occupancyRate);
    overUtilizedRooms.sort((a, b) => a.occupancyRate - b.occupancyRate);

    if (showResult) {
        // Afficher les résultats des salles sous-exploitées
        if (underUtilizedRooms.length > 0) {
            console.log(`📉 Salles sous-exploitées (moins de ${underUtilizationThreshold}% d'occupation) :\n`);
            underUtilizedRooms.forEach(({ room, occupancyRate }) => {
                console.log(`  - Salle : ${room}, Taux d'occupation : ${occupancyRate.toFixed(2)}%`);
            });
        } else {
            console.log(`✅ Aucune salle sous-exploitée détectée (en dessous de ${underUtilizationThreshold}% d'occupation).`);
        }

        console.log('-----------------------------------');

        // Afficher les résultats des salles sur-exploitées
        if (overUtilizedRooms.length > 0) {
            console.log(`📈 Salles sur-exploitées (plus de ${overUtilizationThreshold}% d'occupation) :\n`);
            overUtilizedRooms.forEach(({ room, occupancyRate }) => {
                console.log(`  - Salle : ${room}, Taux d'occupation : ${occupancyRate.toFixed(2)}%`);
            });
        } else {
            console.log(`✅ Aucune salle sur-exploitée détectée (au-dessus de ${overUtilizationThreshold}% d'occupation).`);
        }
    }
}

// Exporter la fonction pour une utilisation externe
export { analyzeOverUnderUtilizedRooms };
