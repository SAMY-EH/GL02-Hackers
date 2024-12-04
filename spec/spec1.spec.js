/**
 * @file spec1.spec.js
 * @description Tests unitaires pour la spécification SPEC_01 - Recherche des salles pour un cours donné.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_01 - Recherche des salles pour un cours donné.
 *          Le logiciel doit permettre aux utilisateurs de rechercher les salles attribuées à un cours spécifique.
 *
 * @author Théo TORREILLES, Lucie GUÉRIN
 * @version 1.1
 * @date Décembre 2024
 *
 * @tests
 * - Vérifie la recherche des salles pour un cours existant.
 * - Vérifie la réponse pour un cours inexistant.
 * - Vérifie que le nom du cours est insensible à la casse.
 *
 * @dependencies
 * - Module personnalisé 'spec1.js' : Contient la fonctionnalité à tester.
 * - Node.js 'url' et 'path' modules : Utilisés pour définir le répertoire de travail en environnement ES6.
 *
 * @usage
 *   npx jasmine spec/spec1.spec.js
 */

// Importation des modules nécessaires pour les tests
import { findRoomsForCourse } from '../functions/spec1.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Pour définir le répertoire du fichier courant en environnement ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tests unitaires pour la spécification SPEC_01
describe('SPEC_01 - Recherche des salles pour un cours donné -', () => {
    const directory = path.resolve(__dirname, '../data');

    it('Devrait trouver les salles pour un cours existant', () => {
        const courseName = 'MATH02';
        const result = findRoomsForCourse(directory, courseName, false);
        expect(result).toBeDefined();
        expect(typeof result).toBe('object'); // Vérifie que le résultat est un objet
        expect(Object.keys(result).length).toBeGreaterThan(0); // Vérifie qu'il y a des salles attribuées au cours
    });

    it('Devrait retourner un objet vide pour un cours inexistant', () => {
        const courseName = 'FAKE123';
        const result = findRoomsForCourse(directory, courseName, false);
        expect(result).toBeDefined();
        expect(typeof result).toBe('object'); // Vérifie que le résultat est un objet
        expect(Object.keys(result).length).toBe(0); // Vérifie que l'objet est vide pour un cours inexistant
    });

    it('Devrait être insensible à la casse pour le nom du cours', () => {
        const courseNameLowerCase = 'math02';
        const courseNameUpperCase = 'MATH02';
        const resultLowerCase = findRoomsForCourse(directory, courseNameLowerCase, false);
        const resultUpperCase = findRoomsForCourse(directory, courseNameUpperCase, false);
        expect(resultLowerCase).toEqual(resultUpperCase); // Comparer les résultats des deux requêtes
    });
});
