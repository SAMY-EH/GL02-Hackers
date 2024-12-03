/**
 * @file spec2.spec.js
 * @description Tests unitaires pour la spécification SPEC_02 - Consultation de la capacité d’une salle.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_02 - Consultation de la capacité d'une salle.
 *          Les utilisateurs doivent pouvoir consulter la capacité maximale d’une salle en termes de nombre de places.
 *
 * @author Théo TORREILLES
 * @version 1.0
 * @date Décembre 2024
 *
 * @tests
 * - Vérifie la recherche de la capacité pour une salle existante.
 * - Vérifie la réponse pour une salle inexistante.
 * - Vérifie que la capacité maximale ne change pas.
 * - Vérifie que le nom de la salle est insensible à la casse.
 *
 * @dependencies
 * - Module personnalisé 'spec2.js' : Contient la fonctionnalité à tester.
 * - Node.js 'url' et 'path' modules : Utilisés pour définir le répertoire de travail en environnement ES6.
 *
 * @usage
 *   npx jasmine spec/spec2.spec.js
 */

// Importation des modules nécessaires pour les tests
import { findRoomCapacity } from '../functions/spec2.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Pour définir le répertoire du fichier courant en environnement ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tests unitaires pour la spécification SPEC_02
describe('SPEC_02 - Consultation de la capacité d’une salle -', () => {
    const directory = path.resolve(__dirname, '../data');

    it('Devrait retourner la capacité pour une salle existante', () => {
        const roomName = 'B203';
        const result = findRoomCapacity(directory, roomName, false);
        expect(result).toBeDefined();
        expect(typeof result).toBe('object'); // Vérifie que le résultat est un objet
        expect(result.roomName).toBe(roomName); // Vérifie que l'objet contient la salle recherchée
        expect(typeof result.capacity).toBe('number'); // Vérifie que la capacité est bien un nombre
        expect(result.capacity).toBeGreaterThan(0); // Vérifie que la capacité est positive
    });

    it('Devrait retourner un objet vide pour une salle inexistante', () => {
        const roomName = 'FAKE123';
        const result = findRoomCapacity(directory, roomName, false);
        expect(result).toEqual({}); // Vérifie que le résultat est un objet vide
    });

    it('Devrait retourner la capacité maximale pour une salle existante', () => {
        const roomName = 'B203';
        const result1 = findRoomCapacity(directory, roomName, false);
        const result2 = findRoomCapacity(directory, roomName, false);
        expect(result1.capacity).toBe(result2.capacity); // Vérifie que la capacité maximale ne change pas
    });

    it('Devrait être insensible à la casse pour le nom de la salle', () => {
        const roomNameLowerCase = 'b203';
        const roomNameUpperCase = 'B203';
        const resultLowerCase = findRoomCapacity(directory, roomNameLowerCase, false);
        const resultUpperCase = findRoomCapacity(directory, roomNameUpperCase, false);
        
        // Comparer les résultats en insensibilité de casse pour le nom de la salle
        expect(resultLowerCase.capacity).toBe(resultUpperCase.capacity);
        expect(resultLowerCase.roomName.toLowerCase()).toBe(resultUpperCase.roomName.toLowerCase());
    });
});
