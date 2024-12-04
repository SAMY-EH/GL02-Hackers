/**
 * @file spec6.spec.js
 * @description Tests unitaires pour la spécification SPEC_06 - Vérification de la conformité des données.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_06 - Vérification de la conformité des données.
 *          Le logiciel doit vérifier qu'aucune salle ne soit utilisée par deux cours différents au même créneau horaire.
 *
 * @author Théo TORREILLES
 * @version 1.0
 * @date Décembre 2024
 *
 * @tests
 * - Vérifie la détection de conflits lorsqu'il y a des chevauchements de créneaux.
 * - Vérifie l'absence de conflits lorsque les créneaux ne se chevauchent pas.
 * - Vérifie la détection de tous les conflits lors de la vérification de tous les jours et de tous les créneaux horaires.
 *
 * @dependencies
 * - Module personnalisé 'spec6.js' : Contient la fonctionnalité à tester.
 * - Node.js 'url' et 'path' modules : Utilisés pour définir le répertoire de travail en environnement ES6.
 *
 * @usage
 *   npx jasmine spec/spec6.spec.js
 */

// Importation des modules nécessaires pour les tests
import { verifyRoomConflicts } from '../functions/spec6.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Pour définir le répertoire du fichier courant en environnement ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tests unitaires pour la spécification SPEC_06
describe('SPEC_06 - Vérification de la conformité des données -', () => {
    const directory = path.resolve(__dirname, '../data');

    it('Devrait retourner des conflits lorsqu\'il y a des chevauchements de créneaux', () => {
        const dayCode = 'L'; // Mardi
        const startTime = '10:00';
        const endTime = '12:00';
        const result = verifyRoomConflicts(directory, dayCode, startTime, endTime, false);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBeTrue();
        expect(result.length).toBeGreaterThan(0); // Vérifie qu'il y a des conflits
    });

    it('Devrait ne détecter aucun conflit lorsque les créneaux ne se chevauchent pas', () => {
        const dayCode = 'D'; // Mercredi
        const startTime = '10:00';
        const endTime = '12:00';
        const result = verifyRoomConflicts(directory, dayCode, startTime, endTime, false);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBeTrue();
        expect(result.length).toBe(0); // Vérifie qu'il n'y a pas de conflits
    });

    it('Devrait détecter tous les conflits lors de la vérification de tous les jours et de tous les créneaux horaires', () => {
        const result = verifyRoomConflicts(directory, '', '', '', false);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBeTrue();
        expect(result.length).toBeGreaterThan(0); // Vérifie qu'il y a des conflits lorsqu'on vérifie tout
    });
});
