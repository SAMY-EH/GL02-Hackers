import { findRoomsForCourse } from '../../functions/spec1.js';
import * as parser from '../../utility/parser.js';

// Simuler une version très simplifiée de la fonction parseAllEdtFiles pour retourner des données statiques
describe('Tests pour la fonction findRoomsForCourse', () => {
    beforeAll(() => {
        // Mocking the parseAllEdtFiles function to return fixed data
        spyOn(parser, 'parseAllEdtFiles').and.returnValue([
            { course: 'GL02', room: 'C002', day: 'L', startTime: '10:00', endTime: '12:00' },
            { course: 'GL02', room: 'M102', day: 'J', startTime: '14:00', endTime: '16:00' },
            { course: 'GL02', room: 'M102', day: 'ME', startTime: '8:00', endTime: '10:00' },
            { course: 'GL02', room: 'M102', day: 'L', startTime: '16:00', endTime: '18:00' },
            { course: 'GL02', room: 'M102', day: 'ME', startTime: '14:00', endTime: '16:00' }
        ]);
    });

    it('devrait retourner les salles pour le cours GL02, peu importe la casse', () => {
        // Tester avec "GL02"
        const resultGL02 = findRoomsForCourse('./data', 'GL02');

        // Tester avec "gl02" (casse différente)
        const resultGl02 = findRoomsForCourse('./data', 'gl02');

        // Vérifier que les résultats sont identiques pour les deux cas (GL02 et gl02)
        expect(resultGL02).toEqual(resultGl02);
    });
});
