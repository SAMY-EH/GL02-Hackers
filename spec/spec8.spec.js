/**
 * @file spec8.spec.js
 * @description Tests unitaires pour la spécification SPEC_08 - Classement des salles par capacité.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_08 - Classement des salles par capacité.
 *          Le logiciel doit permettre le classement des salles par leur capacité d’accueil (par exemple, combien de salles de 24 places sont disponibles).
 *
 * @author Théo TORREILLES
 * @version 1.0
 * @date Décembre 2024
 *
 * @tests
 * - Vérifie le classement croissant des salles par capacité.
 * - Vérifie le classement décroissant des salles par capacité.
 * - Vérifie l'application du filtre de capacité minimale.
 * - Vérifie la gestion du cas où aucune salle ne correspond aux critères.
 *
 * @dependencies
 * - Module personnalisé 'spec8.js' : Contient la fonctionnalité à tester.
 * - Node.js 'url' et 'path' modules : Utilisés pour définir le répertoire de travail en environnement ES6.
 *
 * @usage
 *   npx jasmine spec/spec8.spec.js
 */

// Importation des modules nécessaires pour les tests
import { classifyRoomsByCapacity } from '../functions/spec8.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Pour définir le répertoire du fichier courant en environnement ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tests unitaires pour la spécification SPEC_08
describe('SPEC_08 - Classement des salles par capacité -', () => {
    const directory = path.resolve(__dirname, '../data');

    it('Devrait classer les salles par capacité de manière croissante', () => {
        const result = classifyRoomsByCapacity(directory, true, 0, false);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBeTrue();
        expect(result.length).toBeGreaterThan(0);

        // Vérifier que le classement est bien croissant
        for (let i = 1; i < result.length; i++) {
            expect(result[i][1]).toBeGreaterThanOrEqual(result[i - 1][1]);
        }
    });

    it('Devrait classer les salles par capacité de manière décroissante', () => {
        const result = classifyRoomsByCapacity(directory, false, 0, false);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBeTrue();
        expect(result.length).toBeGreaterThan(0);

        // Vérifier que le classement est bien décroissant
        for (let i = 1; i < result.length; i++) {
            expect(result[i][1]).toBeLessThanOrEqual(result[i - 1][1]);
        }
    });

    it('Devrait filtrer les salles selon une capacité minimale', () => {
        const minCapacity = 50;
        const result = classifyRoomsByCapacity(directory, true, minCapacity, false);
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBeTrue();
        expect(result.length).toBeGreaterThanOrEqual(0);

        // Vérifier que toutes les salles ont une capacité supérieure ou égale à la capacité minimale
        result.forEach(([room, capacity]) => {
            expect(capacity).toBeGreaterThanOrEqual(minCapacity);
        });
    });

    it('Devrait retourner un message d\'erreur lorsqu\'aucune salle ne correspond aux critères', () => {
        const minCapacity = 10000; // Capacité très élevée pour forcer un cas sans résultat
        const result = classifyRoomsByCapacity(directory, true, minCapacity, false);
        expect(result).toBeUndefined(); // Vérifie qu'aucun résultat n'est retourné car aucune salle ne correspond
    });
});
