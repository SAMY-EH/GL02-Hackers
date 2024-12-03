/**
 * @file spec5.js
 * @description Ce fichier contient la fonction permettant de générer un fichier iCalendar (.ics) pour les cours entre deux dates spécifiées.
 *              Il extrait les informations sur les cours à partir des fichiers edt.cru, puis les organise dans un calendrier compatible iCalendar.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_05 - Génération d’un fichier iCalendar.
 *          Le logiciel doit permettre aux utilisateurs de générer un fichier iCalendar (conforme la norme RFC 5545) pour les cours auxquels ils participent,
 *          entre deux dates spécifiées, et ainsi l’intégrer à son propre calendrier.
 *
 * @author Théo TORREILLES, Julie VAN HOUDENHOVE
 * @version 1.2
 * @date Décembre 2024
 *
 * @functions
 * - generateICalendarForCourses(directory, startDate, endDate, calendarFileName, showResult): Génère un fichier iCalendar avec les cours présents dans le répertoire spécifié.
 *
 * @dependencies
 * - Bibliothèque 'ical-generator' pour générer le fichier iCalendar.
 * - Node.js 'fs' module pour la lecture et l'écriture des fichiers locaux.
 * - Module personnalisé 'functions.js' : Fournit des fonctions utilitaires.
 * - Module personnalisé 'parser.js' : Utilisé pour analyser les fichiers edt.cru et extraire les créneaux d'enseignement.
 *
 * @usage
 *   import { generateICalendarForCourses } from './spec5.js';
 *   generateICalendarForCourses('./data', new Date('2024-12-02'), new Date('2024-12-02'));
 *
 * @note
 * - Les données sont extraites des fichiers edt.cru présents dans le répertoire spécifié.
 * - Assurez-vous que les dates de début et de fin sont correctement définies.
 * - Le fichier iCalendar généré est conforme à la norme RFC 5545.
 * - Le nom du fichier iCalendar généré par défaut est 'calendrier.ics'.
 * 
 * @remarks
 * - Assurez-vous que le répertoire contenant les fichiers edt.cru est correctement spécifié.   
 * - Les dates de début et de fin doivent être spécifiées au format Date.
 * - Le nom du fichier iCalendar généré peut être personnalisé en spécifiant le paramètre 'calendarFileName'.
 * - Le fichier iCalendar généré peut être importé dans des applications de calendrier telles que Google Agenda, Outlook, etc.
 */

// Importer les modules nécessaires
import ical from 'ical-generator';
import fs from 'fs';
import * as functions from '../utility/functions.js';
import * as parser from '../utility/parser.js';

/**
 * Fonction pour générer un fichier iCalendar (.ics) pour les cours entre deux dates spécifiées
 * @param {string} directory Le répertoire contenant les fichiers edt.cru
 * @param {Date} startDate La date de début de la période (au format Date)
 * @param {Date} endDate La date de fin de la période (au format Date)
 * @param {string} calendarFileName Nom du fichier iCalendar à générer (ex. 'monCalendrier.ics')
 * @param {boolean} showResult Indique si les résultats doivent être affichés dans la console (par défaut : true)
 * @returns {void} Le fichier iCalendar généré
 */
function generateICalendarForCourses(directory, startDate, endDate, calendarFileName = 'calendrier.ics', showResult = true) {
    // Parser tous les fichiers edt.cru dans le répertoire donné
    const allTimeSlots = parser.parseAllEdtFiles(directory);

    // Créer un nouvel objet calendrier
    const calendar = ical({ name: 'Emploi du Temps' });

    // Parcourir les jours entre startDate et endDate
    for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
        const dayOfWeek = currentDate.getDay(); // Obtenir le jour de la semaine (0 pour dimanche, 1 pour lundi, etc...)
        const dayCode = functions.getDayCode(dayOfWeek); // Obtenir le code jour correspondant ('L', 'MA', 'ME', etc...)

        // Filtrer les créneaux qui correspondent au jour de la semaine courant
        const filteredTimeSlots = allTimeSlots.filter(timeSlot => timeSlot.day === dayCode);

        // Ajouter les créneaux au calendrier pour la date actuelle
        filteredTimeSlots.forEach(timeSlot => {
            const startTimeParts = timeSlot.startTime.split(':');
            const endTimeParts = timeSlot.endTime.split(':');

            // Créer des objets Date pour le début et la fin du cours le jour actuel
            const eventStart = new Date(currentDate);
            eventStart.setHours(parseInt(startTimeParts[0]), parseInt(startTimeParts[1]));

            const eventEnd = new Date(currentDate);
            eventEnd.setHours(parseInt(endTimeParts[0]), parseInt(endTimeParts[1]));

            // Ajouter l'événement au calendrier
            calendar.createEvent({
                start: eventStart,
                end: eventEnd,
                summary: `${timeSlot.course} (${timeSlot.type})`,
                description: `ID : ${timeSlot.id}\nCours : ${timeSlot.course} (${timeSlot.type})\nCréneau : ${functions.transformDayName(timeSlot.day)} ${timeSlot.startTime}-${timeSlot.endTime}\nSalle : ${timeSlot.room}\nCapacité : ${timeSlot.capacity}\nIndex : ${timeSlot.index}`,
                location: timeSlot.room
            });
        });
    }

    // Générer la chaîne iCalendar et sauvegarder dans un fichier .ics
    const calendarString = calendar.toString();
    try {
        fs.writeFileSync(calendarFileName, calendarString);
        if (showResult) console.log(`✅ Fichier iCalendar généré avec succès : ${calendarFileName}`);
    } catch (error) {
        if (showResult) console.error(`❌ Erreur lors de la sauvegarde du fichier iCalendar : ${error.message}`);
    }
}

// Exporter la fonction pour une utilisation externe
export { generateICalendarForCourses };
