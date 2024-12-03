/**
 * @file spec4.spec.js
 * @description Tests unitaires pour la spécification SPEC_04 - Recherche de salle disponible pour un créneau donné.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_04 - Recherche de salle disponible pour un créneau donné.
 *          Les utilisateurs doivent pouvoir connaître les salles disponibles pour un créneau horaire donné.
 *
 * @author Théo TORREILLES
 * @version 1.0
 * @date Décembre 2024
 *
 * @tests
 * - Vérifie la recherche des salles disponibles
 * - Vérifie la réponse en cas d'absence de salle disponible
 *
 * @dependencies
 * - Module personnalisé 'spec4.js' : Contient la fonctionnalité à tester.
 * - Node.js 'url' et 'path' modules : Utilisés pour définir le répertoire de travail en environnement ES6.
 *
 * @usage
 *   npx jasmine spec/spec4.spec.js
 */

// Importation des modules nécessaires pour les tests
import { findAvailableRoomsForTimeSlot } from '../functions/spec4.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Pour définir le répertoire du fichier courant en environnement ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tests unitaires pour la spécification SPEC_04
describe('SPEC_04 - Recherche de salle disponible pour un créneau donné -', () => {
    const directory = path.resolve(__dirname, '../data');

    it('Devrait retourner des salles disponibles pour un créneau donné', () => {
        const dayCode = 'MA'; // Mardi
        const startTime = '10:00';
        const endTime = '12:00';
        const result = findAvailableRoomsForTimeSlot(directory, dayCode, startTime, endTime, false);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBeTrue(); // Vérifie que le résultat est un tableau
        expect(result.length).toBeGreaterThan(0); // Vérifie qu'il y a des salles disponibles
    });

    // Ce test échoue mais c'est normal car il n'existe aucun créneau horaire où aucune salle n'est disponible
    it('Devrait retourner un tableau vide si aucune salle n\'est disponible pour le créneau donné', () => {
        const dayCode = 'ME'; // Mercredi
        const startTime = '08:00';
        const endTime = '20:00';
        const result = findAvailableRoomsForTimeSlot(directory, dayCode, startTime, endTime, false);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBeTrue(); // Vérifie que le résultat est un tableau
        expect(result.length).toBe(0); // Vérifie qu'aucune salle n'est disponible
    });
});
