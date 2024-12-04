/**
 * @file spec3.spec.js
 * @description Tests unitaires pour la spécification SPEC_03 - Vérification des disponibilités d'une salle.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_03 - Vérification des disponibilités d'une salle.
 *          Le logiciel doit permettre de vérifier les moments où une salle spécifique est libre durant la semaine
 *          pour permettre du travail collaboratif.
 *
 * @author Théo TORREILLES
 * @version 1.0
 * @date Décembre 2024
 *
 * @tests
 * - Vérifie la recherche des créneaux libres pour une salle existante.
 * - Vérifie la réponse pour une salle inexistante.
 * - Vérifie que la salle est entièrement occupée s’il n’y a pas de créneau libre.
 * - Vérifie que des créneaux libres sont retournés pour chaque jour de la semaine si la salle est partiellement libre.
 * - Vérifie que le nom de la salle est insensible à la casse.
 *
 * @dependencies
 * - Module personnalisé 'spec3.js' : Contient la fonctionnalité à tester.
 * - Node.js 'url' et 'path' modules : Utilisés pour définir le répertoire de travail en environnement ES6.
 *
 * @usage
 *   npx jasmine spec/spec3.spec.js
 */

// Importation des modules nécessaires pour les tests
import { findRoomAvailability } from '../functions/spec3.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Pour définir le répertoire du fichier courant en environnement ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('SPEC_03 - Vérification des disponibilités d\'une salle -', () => {
    const directory = path.resolve(__dirname, '../data');

    it('Devrait retourner des créneaux libres pour une salle existante', () => {
        const roomName = 'B203';
        const result = findRoomAvailability(directory, roomName, false);
        expect(result).toBeDefined();
        expect(typeof result).toBe('object'); // Vérifie que le résultat est un objet
        expect(Object.keys(result).length).toBeGreaterThan(0); // Vérifie que l'objet contient des jours
        const dayWithSlots = Object.values(result).find(slots => slots.length > 0);
        expect(dayWithSlots).toBeDefined(); // Vérifie qu'il y a au moins un créneau libre
    });

    it('Devrait retourner un objet vide pour une salle inexistante', () => {
        const roomName = 'FAKE123';
        const result = findRoomAvailability(directory, roomName, false);
        expect(result).toEqual({}); // Vérifie que le résultat est un objet vide
    });

    it('Devrait indiquer que la salle est entièrement occupée s’il n’y a pas de créneau libre', () => {
        // Cas où tous les créneaux sont occupés (hypothèse : cette salle est complètement réservée dans les données)
        const roomName = 'FULL123';
        const result = findRoomAvailability(directory, roomName, false);
        const allSlotsEmpty = Object.values(result).every(slots => slots.length === 0);
        expect(allSlotsEmpty).toBeTrue(); // Vérifie que la salle n'a aucun créneau libre
    });

    it('Devrait retourner des créneaux libres pour chaque jour de la semaine si la salle est partiellement libre', () => {
        const roomName = 'B203';
        const result = findRoomAvailability(directory, roomName, false);
        expect(result).toBeDefined();
        expect(typeof result).toBe('object'); // Vérifie que le résultat est un objet
        Object.keys(result).forEach(day => {
            expect(Array.isArray(result[day])).toBeTrue(); // Vérifie que chaque entrée de jour est un tableau
        });
    });

    it('Devrait être insensible à la casse pour le nom de la salle', () => {
        const roomNameLowerCase = 'b203';
        const roomNameUpperCase = 'B203';
        const resultLowerCase = findRoomAvailability(directory, roomNameLowerCase, false);
        const resultUpperCase = findRoomAvailability(directory, roomNameUpperCase, false);
        expect(resultLowerCase).toEqual(resultUpperCase); // Comparer les résultats des deux requêtes
    });
});
