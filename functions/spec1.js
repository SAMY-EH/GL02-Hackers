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
import * as functions from "../utility/functions.js";
import * as parser from "../utility/parser.js";
import { executeSpec1 } from "../main.js";

/**
 * Affiche une timeline visuelle pour un jour
 * @param {Array} timeSlots Les créneaux horaires du jour
 */
function displayTimelineForDay(timeSlots) {
  const hours = Array.from({ length: 11 }, (_, i) => i + 8); // 8h à 18h

  // Afficher l'échelle des heures
  console.log("    " + hours.map((h) => `${h}h`.padStart(3)).join(" "));

  // Créer la ligne de la timeline
  let timeline = "    ";
  for (let hour = 8; hour <= 18; hour++) {
    let hasClass = false;
    timeSlots.forEach((slot) => {
      const startHour = parseInt(slot.startTime.split(":")[0]);
      const endHour = parseInt(slot.endTime.split(":")[0]);
      if (hour >= startHour && hour < endHour) {
        hasClass = true;
      }
    });
    timeline += hasClass ? "[#] " : "[ ] ";
  }

  console.log(timeline);
}

/**
 * Crée une représentation visuelle de l'emploi du temps
 * @param {Object} roomsGrouped Les données groupées par salle et par jour
 * @param {string} courseName Le nom du cours
 */
function createVisualTimetable(roomsGrouped, courseName) {
  console.log(
    "\n📅 Représentation visuelle de l'emploi du temps pour " +
      courseName +
      "\n",
  );

  Object.entries(roomsGrouped).forEach(([room, days]) => {
    console.log(`\n🏫 Salle: ${room}`);
    Object.entries(days).forEach(([day, timeSlots]) => {
      console.log(`\n${functions.transformDayName(day)}`);
      displayTimelineForDay(timeSlots);
    });
    console.log("\n" + "=".repeat(60));
  });
}

/**
 * Convertit une heure en position dans la timeline
 * @param {string} time L'heure au format "HH:MM"
 * @returns {number} La position dans la timeline
 */
function getTimePosition(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return Math.floor((hours - 8) * 2 + minutes / 30);
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
 * Fonction pour rechercher les salles utilisées pour un cours donné
 * @param {string} directory Le répertoire contenant les fichiers edt.cru
 * @param {string} courseName Le nom du cours à rechercher
 * @param {boolean} [showResult] Indique si les résultats doivent être affichés dans la console (par défaut : true)
 * @returns {Object} Une liste des salles attribuées au cours, regroupées par salle et par jour
 */
// spec1.js
function findRoomsForCourse(directory, courseName, showResult = true) {
  const allTimeSlots = parser.parseAllEdtFiles(directory);
  const roomsForCourse = allTimeSlots
    .filter(
      (timeSlot) => timeSlot.course.toLowerCase() === courseName.toLowerCase(),
    )
    .map((timeSlot) => ({
      room: timeSlot.room,
      day: timeSlot.day,
      startTime: timeSlot.startTime,
      endTime: timeSlot.endTime,
    }));

  if (roomsForCourse.length === 0) {
    if (showResult)
      console.error(
        `❌ Erreur : Aucun cours nommé "${courseName}" n'a été trouvé dans le système. Vérifiez le nom du cours et réessayez.`,
      );
    executeSpec1();
    return {};
  }

  let roomsGrouped = groupBy(roomsForCourse, "room");
  Object.keys(roomsGrouped).forEach((room) => {
    roomsGrouped[room] = groupBy(roomsGrouped[room], "day");
    const sortedDays = functions.sortDays(Object.keys(roomsGrouped[room]));
    roomsGrouped[room] = sortedDays.reduce((acc, day) => {
      acc[day] = roomsGrouped[room][day];
      return acc;
    }, {});
  });

  if (showResult) {
    console.log(`✅ Salles trouvées pour le cours "${courseName}":\n`);
    Object.entries(roomsGrouped).forEach(([room, days], index) => {
      console.log(`Salle #${index + 1}: ${room}`);
      Object.entries(days).forEach(([day, timeSlots]) => {
        console.log(`  - Jour : ${functions.transformDayName(day)}`);
        timeSlots.forEach((timeSlot) => {
          console.log(
            `    - Heures : ${timeSlot.startTime} - ${timeSlot.endTime}`,
          );
        });
      });
      console.log("-----------------------------------");
    });

    // affichage visuel des emplois du temps
    createVisualTimetable(roomsGrouped, courseName);
  }

  return roomsGrouped;
}

// Exporter la fonction pour une utilisation externe
export { findRoomsForCourse };
