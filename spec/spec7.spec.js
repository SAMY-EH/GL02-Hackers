/**
 * @file spec7.spec.js
 * @description Tests unitaires pour la spécification SPEC_07 - Visualisation du taux d'occupation des salles.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_07 - Visualisation du taux d'occupation des salles.
 *          Le système doit pouvoir générer une visualisation synthétique du taux d’occupation des salles sur une période donnée.
 *
 * @author Théo TORREILLES
 * @version 1.0
 * @date Décembre 2024
 *
 * @tests
 * - Vérifie le calcul du taux d'occupation des salles.
 * - Vérifie la gestion d'une période sans occupation.
 *
 * @dependencies
 * - Module personnalisé 'spec7.js' : Contient la fonctionnalité à tester.
 * - Node.js 'url' et 'path' modules : Utilisés pour définir le répertoire de travail en environnement ES6.
 *
 * @usage
 *   npx jasmine spec/spec7.spec.js
 */

// Importation des modules nécessaires pour les tests
import { visualizeRoomOccupancy } from '../functions/spec7.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Pour définir le répertoire du fichier courant en environnement ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tests unitaires pour la spécification SPEC_07
describe('SPEC_07 - Visualisation du taux d\'occupation des salles -', () => {
    const directory = path.resolve(__dirname, '../data');
    const startDate = new Date('2024-12-02');
    const endDate = new Date('2024-12-08');

    it('Devrait calculer correctement le taux d\'occupation des salles', () => {
        const result = visualizeRoomOccupancy(directory, startDate, endDate, false);
        expect(result).toBeDefined();
        expect(typeof result).toBe('object'); // Vérifie que le résultat est un objet

        // Vérifier que chaque salle a bien des créneaux occupés et des créneaux disponibles
        Object.entries(result).forEach(([room, occupancy]) => {
            expect(occupancy.totalOccupiedSlots).toBeDefined();
            expect(occupancy.totalSlots).toBeDefined();
        });
    });

    it('Devrait gérer une période sans occupation', () => {
        const noOccupationStartDate = new Date('2024-12-01');
        const noOccupationEndDate = new Date('2024-12-01');
        const result = visualizeRoomOccupancy(directory, noOccupationStartDate, noOccupationEndDate, false);
        expect(result).toBeDefined();
        expect(typeof result).toBe('object');
        expect(Object.keys(result).length).toBeGreaterThan(0);
        Object.entries(result).forEach(([room, occupancy]) => {
            expect(occupancy.totalOccupiedSlots).toBe(0); // Vérifie que toutes les salles n'ont aucun créneau occupé
        });
    });
});
