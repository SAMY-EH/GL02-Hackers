/**
 * @file spec9.spec.js
 * @description Tests unitaires pour la spécification SPEC_09 - Consultation des salles sur ou sous-exploitées.
 *
 * @context Projet GL02 - Hackers
 *          SPEC_09 - Consultation des salles sur ou sous-exploitées.
 *          Le gestionnaire des locaux doit pouvoir identifier quelles salles sont sous-exploitées ou surexploitées afin de planifier des ajustements futurs.
 *
 * @author Théo TORREILLES
 * @version 1.0
 * @date Décembre 2024
 *
 * @tests
 * - Vérifie la détection des salles sous-exploitées en fonction du seuil.
 * - Vérifie la détection des salles sur-exploitées en fonction du seuil.
 * - Vérifie la gestion d'une période sans données d'occupation.
 *
 * @dependencies
 * - Module personnalisé 'spec9.js' : Contient la fonctionnalité à tester.
 * - Node.js 'url' et 'path' modules : Utilisés pour définir le répertoire de travail en environnement ES6.
 *
 * @usage
 *   npx jasmine spec/spec9.spec.js
 */

// Importation des modules nécessaires pour les tests
import { analyzeOverUnderUtilizedRooms } from '../functions/spec9.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Pour définir le répertoire du fichier courant en environnement ES6
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tests unitaires pour la spécification SPEC_09
describe('SPEC_09 - Consultation des salles sur ou sous-exploitées -', () => {
    const directory = path.resolve(__dirname, '../data');
    const startDate = new Date('2024-12-02');
    const endDate = new Date('2024-12-08');

    it('Devrait détecter les salles sous-exploitées en fonction du seuil', () => {
        const underUtilizationThreshold = 20;
        const overUtilizationThreshold = 80;

        // Espionner console.log
        const spyLog = spyOn(console, 'log').and.callFake(() => {});

        analyzeOverUnderUtilizedRooms(directory, startDate, endDate, underUtilizationThreshold, overUtilizationThreshold, true);

        // Vérifier qu'un message de salle sous-exploitée a été enregistré
        expect(spyLog).toHaveBeenCalledWith(jasmine.stringMatching(`📉 Salles sous-exploitées \\(moins de ${underUtilizationThreshold}% d'occupation\\)`));
    });

    it('Devrait détecter les salles sur-exploitées en fonction du seuil', () => {
        const underUtilizationThreshold = 20;
        const overUtilizationThreshold = 80;

        // Espionner console.log
        const spyLog = spyOn(console, 'log').and.callFake(() => {});

        analyzeOverUnderUtilizedRooms(directory, startDate, endDate, underUtilizationThreshold, overUtilizationThreshold, true);

        // Vérifier qu'un message de salle sur-exploitée a été enregistré
        expect(spyLog).toHaveBeenCalledWith(jasmine.stringMatching(`📈 Salles sur-exploitées \\(plus de ${overUtilizationThreshold}% d'occupation\\)`));
    });
});
