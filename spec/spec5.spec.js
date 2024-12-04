/**
 * @file spec5.spec.js
 * @description Tests unitaires pour la spécification SPEC_05 - Génération d’un fichier iCalendar.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_05 - Génération d’un fichier iCalendar.
 *          Le logiciel doit permettre aux utilisateurs de générer un fichier iCalendar (conforme la norme RFC 5545) pour les cours auxquels ils participent,
 *          entre deux dates spécifiées, et ainsi l’intégrer à son propre calendrier.
 *
 * @author Théo TORREILLES
 * @version 1.0
 * @date Décembre 2024
 *
 * @tests
 * - Vérifie la génération d'un fichier iCalendar pour une plage de dates spécifique.
 * - Vérifie que le fichier iCalendar contient des événements.
 * - Vérifie que le fichier iCalendar contient uniquement les cours correspondant à la plage de dates spécifiée.
 * - Vérifie la génération d'un fichier vide si aucun cours n'est présent pour la plage de dates.
 *
 * @dependencies
 * - Module personnalisé 'spec5.js' : Contient la fonctionnalité à tester.
 * - Node.js 'url', 'path', et 'fs' modules : Utilisés pour définir le répertoire de travail en environnement ES6 et gérer les fichiers locaux.
 *
 * @usage
 *   npx jasmine spec/spec5.spec.js
 */

// Importation des modules nécessaires pour les tests
import { generateICalendarForCourses } from '../functions/spec5.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Pour définir le répertoire du fichier courant en environnement ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tests unitaires pour la spécification SPEC_05
describe('SPEC_05 - Génération d’un fichier iCalendar -', () => {
    const directory = path.resolve(__dirname, '../data');
    const calendarFileName = 'test.ics';

    afterAll(() => {
        // Supprimer le fichier iCalendar généré après les tests
        if (fs.existsSync(calendarFileName)) {
            fs.unlinkSync(calendarFileName);
        }
    });

    it('Devrait générer un fichier iCalendar pour une plage de dates spécifique', () => {
        const startDate = new Date('2024-12-02');
        const endDate = new Date('2024-12-02');

        generateICalendarForCourses(directory, startDate, endDate, calendarFileName, false);
        
        // Vérifier que le fichier a bien été créé
        const fileExists = fs.existsSync(calendarFileName);
        expect(fileExists).toBeTrue();
    });

    it('Devrait contenir des événements dans le fichier iCalendar', () => {
        const startDate = new Date('2024-12-02');
        const endDate = new Date('2024-12-02');

        generateICalendarForCourses(directory, startDate, endDate, calendarFileName, false);

        // Lire le fichier iCalendar généré
        const calendarContent = fs.readFileSync(calendarFileName, 'utf-8');
        
        // Vérifier que le fichier contient au moins un événement
        expect(calendarContent.includes('BEGIN:VEVENT')).toBeTrue();
    });

    it('Ne devrait contenir que les cours correspondant à la plage de dates spécifiée', () => {
        const startDate = new Date('2024-12-02');
        const endDate = new Date('2024-12-02');

        generateICalendarForCourses(directory, startDate, endDate, calendarFileName, false);

        // Lire le fichier iCalendar généré
        const calendarContent = fs.readFileSync(calendarFileName, 'utf-8');
        
        // Vérifier que toutes les dates des événements sont dans la plage spécifiée
        const eventDates = calendarContent.match(/DTSTART:(\d{8})T(\d{6})/g);
        if (eventDates) {
            eventDates.forEach(dateString => {
                const year = parseInt(dateString.substring(8, 12));
                const month = parseInt(dateString.substring(12, 14)) - 1; // Les mois commencent à 0 en JavaScript
                const day = parseInt(dateString.substring(14, 16));
                
                const eventDate = new Date(year, month, day);

                // Ajuster les heures des dates spécifiées pour comparer uniquement les dates
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);

                expect(eventDate >= startDate && eventDate <= endDate).toBeTrue();
            });
        }
    });

    it('Devrait générer un fichier vide si aucun cours n’est présent pour la plage de dates', () => {
        const startDate = new Date('2024-12-01');
        const endDate = new Date('2024-12-01'); // Hypothèse : Pas de cours ce jour-là

        generateICalendarForCourses(directory, startDate, endDate, calendarFileName, false);

        // Lire le fichier iCalendar généré
        const calendarContent = fs.readFileSync(calendarFileName, 'utf-8');
        
        // Vérifier qu'il n'y a aucun événement
        expect(calendarContent.includes('BEGIN:VEVENT')).toBeFalse();
    });
});
