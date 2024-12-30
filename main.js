/**
 * @file main.js
 * @description Point d'entrée principal pour exécuter les différentes spécifications du projet.
 *              Ce fichier permet de sélectionner une fonctionnalité à exécuter parmi celles développées.
 *
 * @context Projet GL02 - Hackers
 *
 * @author Théo TORREILLES
 * @version 1.1
 * @date Décembre 2024
 * 
 * @functions
 * - displayMenu(): Affiche le menu principal avec les différentes fonctionnalités disponibles.
 * - handleUserChoice(choice): Gère le choix de l'utilisateur et appelle la fonction correspondante.
 * - executeSpec1(): Exécute la SPEC_01 : Recherche des salles pour un cours donné.
 * - executeSpec2(): Exécute la SPEC_02 : Consultation de la capacité d’une salle.
 * - executeSpec3(): Exécute la SPEC_03 : Vérification des disponibilités d’une salle.
 * - executeSpec4(): Exécute la SPEC_04 : Recherche de salle disponible pour un créneau donné.
 * - executeSpec5(): Exécute la SPEC_05 : Génération d’un fichier iCalendar.
 * - executeSpec6(): Exécute la SPEC_06 : Vérification de la conformité des données.
 * - executeSpec7(): Exécute la SPEC_07 : Visualisation du taux d’occupation des salles.
 * - executeSpec8(): Exécute la SPEC_08 : Classement des salles par capacité.
 * - executeSpec9(): Exécute la SPEC_09 : Consultation des salles sur ou sous-exploitées.
 * - promptUser(): Affiche le menu principal et attend la saisie de l'utilisateur.
 *
 * @dependencies
 * - Node.js `readline` module pour la gestion des entrées utilisateur.
 * - Modules personnalisés pour chaque spécification.
 *
 * @usage
 *   node main.js
 * 
 * @note
 * - Ce programme nécessite Node.js pour s'exécuter.
 * - L'utilisateur peut revenir au menu principal à tout moment en tapant "*".
 * - Le programme se termine lorsque l'utilisateur choisit de quitter.
 * 
 * @remarks
 * - Les spécifications sont implémentées dans des fichiers séparés pour faciliter la maintenance et la lisibilité du code.
 * - Chaque fonctionnalité est exécutée en appelant la fonction correspondante du fichier spécifique.
 * - Les résultats sont affichés dans la console pour chaque fonctionnalité, avec des messages d'erreur si nécessaire.
 */

import readline from 'readline';
import * as spec1 from './functions/spec1.js';
import * as spec2 from './functions/spec2.js';
import * as spec3 from './functions/spec3.js';
import * as spec4 from './functions/spec4.js';
import * as spec5 from './functions/spec5.js';
import * as spec6 from './functions/spec6.js';
import * as spec7 from './functions/spec7.js';
import * as spec8 from './functions/spec8.js';
import * as spec9 from './functions/spec9.js';
import * as functions from './utility/functions.js'; // Add this line to import the functions module

// Créer une interface pour lire les entrées utilisateur dans la console
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Rest of the code remains unchanged

/**
 * Fonction pour afficher le menu principal
 */
function displayMenu() {
    console.log('\n--- Projet GL02 - Hackers ---');
    console.log('Sélectionnez une fonctionnalité à exécuter :');
    console.log('1. SPEC_01 : Recherche des salles pour un cours donné');
    console.log('2. SPEC_02 : Consultation de la capacité d’une salle');
    console.log('3. SPEC_03 : Vérification des disponibilités d’une salle');
    console.log('4. SPEC_04 : Recherche de salle disponible pour un créneau donné');
    console.log('5. SPEC_05 : Génération d’un fichier iCalendar');
    console.log('6. SPEC_06 : Vérification de la conformité des données');
    console.log('7. SPEC_07 : Visualisation du taux d’occupation des salles');
    console.log('8. SPEC_08 : Classement des salles par capacité');
    console.log('9. SPEC_09 : Consultation des salles sur ou sous-exploitées');
    console.log('0. Quitter');
    console.log('------------------------------------------');
}

/**
 * Fonction pour gérer le choix de l'utilisateur
 * @param {*} choice Choix de l'utilisateur
 */
function handleUserChoice(choice) {
    switch (choice) {
        case '1':
            executeSpec1();
            break;
        case '2':
            executeSpec2();
            break;
        case '3':
            executeSpec3();
            break;
        case '4':
            executeSpec4();
            break;
        case '5':
            executeSpec5();
            break;
        case '6':
            executeSpec6();
            break;
        case '7':
            executeSpec7();
            break;
        case '8':
            executeSpec8();
            break;
        case '9':
            executeSpec9();
            break;
        case '0':
            rl.close();
            console.log('Bye !');
            process.exit(0);
            break;
        default:
            console.log('❌ Choix invalide, veuillez réessayer.');
            // Demander à l'utilisateur de taper "Entrée" pour continuer
            rl.question('\nAppuyez sur Entrée pour continuer...', () => {
                promptUser(); // Retourner au menu principal après l'exécution
            });
            break;
    }
}

/**
 * Fonction pour exécuter la SPEC_01 : Recherche des salles pour un cours donné
 */
// main.js
function executeSpec1() {
    console.log('\n--- SPEC_01 : Recherche des salles pour un cours donné ---');
    console.log('Tapez "*" pour revenir au menu principal.');

    const courseNameRegex = /^[A-Za-z]+[0-9]*$/;

    rl.question('Entrez le nom du cours (Ex. : MATH02) : ', (courseName) => {
        if (courseName.toLowerCase() === '*') {
            promptUser();
        } else if (!courseNameRegex.test(courseName)) {
            console.log('❌ Nom du cours invalide. Veuillez réessayer.');
            executeSpec1();
        } else {
            const directory = './data';
            const result = spec1.findRoomsForCourse(directory, courseName);

            if (Object.keys(result).length === 0) {
                console.log(`❌ Erreur : Aucun cours nommé "${courseName}" n'a été trouvé dans le système. Vérifiez le nom du cours et réessayez.`);
                executeSpec1();
            } else {
                console.log(`✅ Salles trouvées pour le cours "${courseName}":\n`);
                Object.entries(result).forEach(([room, days], index) => {
                    console.log(`Salle #${index + 1}: ${room}`);
                    Object.entries(days).forEach(([day, timeSlots]) => {
                        console.log(`  - Jour : ${functions.transformDayName(day)}`);
                        timeSlots.forEach(timeSlot => {
                            console.log(`    - Heures : ${timeSlot.startTime} - ${timeSlot.endTime}`);
                        });
                    });
                    console.log('-----------------------------------');
                });

                rl.question('\nAppuyez sur Entrée pour continuer...', () => {
                    promptUser();
                });
            }
        }
    });
}

/**
 * Fonction pour exécuter la SPEC_02 : Consultation de la capacité d’une salle
 */
function executeSpec2() {
    console.log('\n--- SPEC_02 : Consultation de la capacité d’une salle ---');
    console.log('Tapez "*" pour revenir au menu principal.');

    const roomNameRegex = /^[A-Za-z]+[0-9]*$/;

    rl.question('Entrez le nom de la salle (Ex. : B203) : ', (roomName) => {
        if (roomName.toLowerCase() === '*') {
            promptUser();
        } else if (!roomNameRegex.test(roomName)) {
            console.log('❌ Nom de la salle invalide. Veuillez réessayer.');
            executeSpec2();
        } else {
            const directory = './data';
            const result = spec2.findRoomCapacity(directory, roomName);

            if (!result) {
                console.log(`❌ Erreur : La salle nommée "${roomName}" n'a pas été trouvée dans le système. Vérifiez le nom de la salle et réessayez.`);
                executeSpec2();
            } else {


                rl.question('\nAppuyez sur Entrée pour continuer...', () => {
                    promptUser();
                });
            }
        }
    });
}

/**
 * Fonction pour exécuter la SPEC_03 : Vérification des disponibilités d’une salle
 */
function executeSpec3() {
    console.log('\n--- SPEC_03 : Vérification des disponibilités d’une salle ---');
    console.log('Tapez "*" pour revenir au menu principal.');

    const roomNameRegex = /^[A-Za-z]+[0-9]*$/;

    rl.question('Entrez le nom de la salle (Ex. : B203) : ', (roomName) => {
        if (roomName.toLowerCase() === '*') {
            promptUser();
        } else if (!roomNameRegex.test(roomName)) {
            console.log('❌ Nom de la salle invalide. Veuillez réessayer.');
            executeSpec3();
        } else {
            const directory = './data';
            const result = spec3.findRoomAvailability(directory, roomName);

            if (!result) {
                executeSpec3();
            } else {
                rl.question('\nAppuyez sur Entrée pour continuer...', () => {
                    promptUser();
                });
            }
        }
    });
}

/**
 * Fonction pour exécuter la SPEC_04 : Recherche de salle disponible
 */
function executeSpec4() {
    console.log('\n--- SPEC_04 : Recherche de salle disponible pour un créneau donné ---');
    console.log('Tapez "*" pour revenir au menu principal.');

    const dayCodeRegex = /^(L|MA|ME|J|V|S|D)$/;
    const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d$/;

    rl.question('Entrez le jour du créneau (L, MA, ME, J, V, S, D) (par défaut : L) : ', (dayCode) => {
        dayCode = dayCode.trim().toUpperCase() || 'L';

        if (dayCode === '*') {
            promptUser();
        } else if (!dayCodeRegex.test(dayCode)) {
            console.log('❌ Jour invalide. Veuillez réessayer.');
            executeSpec4();
        } else {
            rl.question('Entrez l\'heure de début (HH:MM) (par défaut : 08:00) : ', (startTime) => {
                startTime = startTime.trim() || '08:00';

                if (startTime.toLowerCase() === '*') {
                    promptUser();
                } else if (!timeRegex.test(startTime)) {
                    console.log('❌ Heure de début invalide. Veuillez réessayer.');
                    executeSpec4();
                } else {
                    rl.question('Entrez l\'heure de fin (HH:MM) (par défaut : 18:00) : ', (endTime) => {
                        endTime = endTime.trim() || '20:00';

                        if (endTime.toLowerCase() === '*') {
                            promptUser();
                        } else if (!timeRegex.test(endTime)) {
                            console.log('❌ Heure de fin invalide. Veuillez réessayer.');
                            executeSpec4();
                        } else {
                            const [startHour, startMinute] = startTime.split(':').map(Number);
                            const [endHour, endMinute] = endTime.split(':').map(Number);
                            const startInMinutes = startHour * 60 + startMinute;
                            const endInMinutes = endHour * 60 + endMinute;

                            if (startInMinutes >= endInMinutes) {
                                console.log('❌ L\'heure de début doit être inférieure à l\'heure de fin. Veuillez réessayer.');
                                executeSpec4();
                            } else {
                                const directory = './data';
                                spec4.findAvailableRoomsForTimeSlot(directory, dayCode, startTime, endTime);

                                rl.question('\nAppuyez sur Entrée pour continuer...', () => {
                                    promptUser();
                                });
                            }
                        }
                    });
                }
            });
        }
    });
}

/**
 * Fonction pour exécuter la SPEC_05 : Génération d’un fichier iCalendar
 */
function executeSpec5() {
    console.log('\n--- SPEC_05 : Génération d’un fichier iCalendar ---');
    console.log('Tapez "*" pour revenir au menu principal.');

    const dateRegex = /^\d{2}-\d{2}$/;
    const fileNameRegex = /^[a-zA-Z0-9_\-\.]+\.ics$/;
    const currentYear = new Date().getFullYear();

    rl.question('Entrez la date de début (Ex. : 12-02) (par défaut : 12-02) : ', (startDateInput) => {
        startDateInput = startDateInput.trim() || '12-02';

        if (startDateInput.toLowerCase() === '*') {
            promptUser();
            return;
        }

        if (!dateRegex.test(startDateInput)) {
            console.log('❌ Date de début invalide. Veuillez entrer une date au format "MM-DD".');
            executeSpec5();
            return;
        }

        const startDate = new Date(`${currentYear}-${startDateInput}`);
        if (isNaN(startDate)) {
            console.log('❌ Date de début invalide. Veuillez réessayer.');
            executeSpec5();
            return;
        }

        rl.question('Entrez la date de fin (Ex. : 12-08) (par défaut : 12-08) : ', (endDateInput) => {
            endDateInput = endDateInput.trim() || '12-08';

            if (endDateInput.toLowerCase() === '*') {
                promptUser();
                return;
            }

            if (!dateRegex.test(endDateInput)) {
                console.log('❌ Date de fin invalide. Veuillez entrer une date au format "MM-DD".');
                executeSpec5();
                return;
            }

            const endDate = new Date(`${currentYear}-${endDateInput}`);
            if (isNaN(endDate) || endDate < startDate) {
                console.log('❌ Date de fin invalide ou antérieure à la date de début. Veuillez réessayer.');
                executeSpec5();
                return;
            }

            rl.question('Entrez le nom du fichier iCalendar (laissez vide pour utiliser "calendrier.ics") : ', (calendarFileName) => {
                if (calendarFileName.toLowerCase() === '*') {
                    promptUser();
                    return;
                }

                let finalCalendarFileName = calendarFileName.trim() === '' ? 'calendrier.ics' : calendarFileName;
                if (!fileNameRegex.test(finalCalendarFileName)) {
                    console.log('❌ Nom de fichier invalide. Veuillez entrer un nom valide (ex.: calendrier.ics).');
                    executeSpec5();
                    return;
                }

                const directory = './data';
                spec5.generateICalendarForCourses(directory, startDate, endDate, finalCalendarFileName);

                rl.question('\nAppuyez sur Entrée pour continuer...', () => {
                    promptUser();
                });
            });
        });
    });
}


/**
 * Fonction pour exécuter la SPEC_06 : Vérification de la conformité des données
 */
function executeSpec6() {
    console.log('\n--- SPEC_06 : Vérification de la conformité des données ---');
    console.log('Tapez "*" pour revenir au menu principal.');

    // Demander le jour à vérifier (optionnel)
    rl.question('Entrez le jour à vérifier (L, MA, ME, J, V, S, D) ou laissez vide pour vérifier tous les jours : ', (dayCodeInput) => {
        if (dayCodeInput.toLowerCase() === '*') {
            promptUser(); // Retourner au menu principal
            return;
        }

        let dayCode = null;
        if (dayCodeInput.trim() !== '') {
            // Convertir le jour en majuscules pour la validation
            dayCodeInput = dayCodeInput.toUpperCase();
            const dayCodeRegex = /^(L|MA|ME|J|V|S|D)$/;
            if (!dayCodeRegex.test(dayCodeInput.trim())) {
                console.log('❌ Jour invalide. Veuillez entrer un jour valide (L, MA, ME, J, V, S, D).');
                executeSpec6();
                return;
            }
            dayCode = dayCodeInput.trim();
        }

        // Demander l'heure de début à vérifier (optionnel)
        rl.question('Entrez l\'heure de début (HH:MM) ou laissez vide pour vérifier tous les créneaux horaires (par défaut 8:00) : ', (startTimeInput) => {
            if (startTimeInput.toLowerCase() === '*') {
                promptUser(); // Retourner au menu principal
                return;
            }

            let startTime = '08:00'; // Valeur par défaut
            if (startTimeInput.trim() !== '') {
                const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d$/;
                if (!timeRegex.test(startTimeInput.trim())) {
                    console.log('❌ Heure de début invalide. Veuillez entrer une heure au format "HH:MM".');
                    executeSpec6();
                    return;
                }
                startTime = startTimeInput.trim();
            }

            // Demander l'heure de fin à vérifier (optionnel)
            rl.question('Entrez l\'heure de fin (HH:MM) ou laissez vide pour vérifier tous les créneaux horaires (par défaut 20:00) : ', (endTimeInput) => {
                if (endTimeInput.toLowerCase() === '*') {
                    promptUser(); // Retourner au menu principal
                    return;
                }

                let endTime = '20:00'; // Valeur par défaut
                if (endTimeInput.trim() !== '') {
                    const timeRegex = /^([01]?\d|2[0-3]):[0-5]\d$/;
                    if (!timeRegex.test(endTimeInput.trim())) {
                        console.log('❌ Heure de fin invalide. Veuillez entrer une heure au format "HH:MM".');
                        executeSpec6();
                        return;
                    }
                    endTime = endTimeInput.trim();
                }

                // Vérifier si l'heure de début est inférieure à l'heure de fin
                const [startHour, startMinute] = startTime.split(':').map(Number);
                const [endHour, endMinute] = endTime.split(':').map(Number);

                if (startHour > endHour || (startHour === endHour && startMinute >= endMinute)) {
                    console.log('❌ L\'heure de début doit être inférieure à l\'heure de fin. Veuillez réessayer.');
                    executeSpec6();
                    return;
                }

                // Appeler la fonction spécifique de spec6 pour vérifier les chevauchements
                try {
                    const directory = './data';
                    spec6.verifyRoomConflicts(directory, dayCode, startTime, endTime);
                } catch (error) {
                    console.error('❌ Erreur lors de la vérification de la conformité des données :', error);
                }

                // Inviter l'utilisateur à appuyer sur Entrée pour retourner au menu principal
                rl.question('\nAppuyez sur Entrée pour continuer...', () => {
                    promptUser();
                });
            });
        });
    });
}

/**
 * Fonction pour exécuter la SPEC_07 : Visualisation du taux d’occupation des salles
 */
function executeSpec7() {
    console.log('\n--- SPEC_07 : Visualisation du taux d’occupation des salles ---');
    console.log('Tapez "*" pour revenir au menu principal.');

    const dateRegex = /^\d{2}-\d{2}$/; // Regex pour vérifier le format de la date
    const currentYear = new Date().getFullYear();

    // Demander la date de début au format "MM-DD"
    rl.question('Entrez la date de début (Ex. : 12-02) (par défaut : 12-02) : ', (startDateInput) => {
        startDateInput = startDateInput.trim() || '12-02';

        if (startDateInput.toLowerCase() === '*') {
            promptUser();  // Retourner au menu principal
            return;
        }

        if (!dateRegex.test(startDateInput)) {
            console.log('❌ Date de début invalide. Veuillez entrer une date au format "MM-DD".');
            executeSpec7();
            return;
        }

        const startDate = new Date(`${currentYear}-${startDateInput}`);
        if (isNaN(startDate)) {
            console.log('❌ Date de début invalide. Veuillez réessayer.');
            executeSpec7();
            return;
        }

        // Demander la date de fin au format "MM-DD"
        rl.question('Entrez la date de fin (Ex. : 12-08) (par défaut : 12-08) : ', (endDateInput) => {
            endDateInput = endDateInput.trim() || '12-08';

            if (endDateInput.toLowerCase() === '*') {
                promptUser(); // Retourner au menu principal
                return;
            }

            if (!dateRegex.test(endDateInput)) {
                console.log('❌ Date de fin invalide. Veuillez entrer une date au format "MM-DD".');
                executeSpec7();
                return;
            }

            const endDate = new Date(`${currentYear}-${endDateInput}`);
            if (isNaN(endDate) || endDate < startDate) {
                console.log('❌ Date de fin invalide ou antérieure à la date de début. Veuillez réessayer.');
                executeSpec7();
                return;
            }

            // Appeler la fonction spécifique de spec7 pour visualiser le taux d'occupation des salles
            const directory = './data'; // Dossier contenant les fichiers edt.cru
            spec7.visualizeRoomOccupancy(directory, startDate, endDate);

            // Inviter l'utilisateur à appuyer sur Entrée pour retourner au menu principal
            rl.question('\nAppuyez sur Entrée pour continuer...', () => {
                promptUser();
            });
        });
    });
}

/**
 * Fonction pour exécuter la SPEC_08 : Classement des salles par capacité
 */
function executeSpec8() {
    console.log('\n--- SPEC_08 : Classement des salles par capacité ---');
    console.log('Tapez "*" pour revenir au menu principal.');

    // Regex pour valider la capacité minimale (doit être un nombre entier positif)
    const minCapacityRegex = /^\d*$/;

    // Demander la capacité minimale (optionnelle)
    rl.question('Entrez la capacité minimale des salles à lister (Ex. : 20) ou laissez vide pour afficher toutes les capacités : ', (minCapacityInput) => {
        if (minCapacityInput.trim() === '*') {
            promptUser(); // Retourner au menu principal
            return;
        }

        // Vérifier la capacité minimale avec le regex
        if (!minCapacityRegex.test(minCapacityInput)) {
            console.log('❌ Capacité minimale invalide. Veuillez entrer un nombre entier positif.');
            executeSpec8();
            return;
        }

        // Si la capacité minimale est vide, définir par défaut à 0, sinon convertir en nombre
        const minCapacity = minCapacityInput.trim() === '' ? 0 : parseInt(minCapacityInput, 10);

        // Demander si le classement doit être croissant ou décroissant
        rl.question('Voulez-vous trier les salles par capacité en ordre croissant ou décroissant (C/D) ? ', (orderInput) => {
            if (orderInput.trim() === '*') {
                promptUser(); // Retourner au menu principal
                return;
            }

            // Regex pour vérifier le choix de tri (C ou D)
            const orderRegex = /^[cCdD]$/;
            if (!orderRegex.test(orderInput)) {
                console.log('❌ Choix invalide. Entrez "C" pour croissant ou "D" pour décroissant.');
                executeSpec8();
                return;
            }

            // Déterminer si le tri est croissant ou décroissant
            const order = orderInput.toLowerCase();
            const ascending = order === 'c';

            // Appeler la fonction spécifique de spec8 pour classer les salles par capacité
            const directory = './data'; // Dossier contenant les fichiers edt.cru
            spec8.classifyRoomsByCapacity(directory, ascending, minCapacity);

            // Inviter l'utilisateur à appuyer sur Entrée pour retourner au menu principal
            rl.question('\nAppuyez sur Entrée pour continuer...', () => {
                promptUser();
            });
        });
    });
}

/**
 * Fonction pour exécuter la SPEC_09 : Consultation des salles sur ou sous-exploitées
 */
function executeSpec9() {
    console.log('\n--- SPEC_09 : Consultation des salles sur ou sous-exploitées ---');
    console.log('Tapez "*" pour revenir au menu principal.');

    const dateRegex = /^\d{2}-\d{2}$/; // Regex pour valider le format de la date
    const percentageRegex = /^(100|[1-9]?\d)$/; // Regex pour valider les seuils (doit être un nombre entier compris entre 0 et 100)
    const currentYear = new Date().getFullYear();

    // Demander la date de début au format "MM-DD"
    rl.question('Entrez la date de début (Ex. : 12-02) (par défaut : 12-02) : ', (startDateInput) => {
        startDateInput = startDateInput.trim() || '12-02';

        if (startDateInput.toLowerCase() === '*') {
            promptUser(); // Retourner au menu principal
            return;
        }

        if (!dateRegex.test(startDateInput)) {
            console.log('❌ Date de début invalide. Veuillez entrer une date au format "MM-DD".');
            executeSpec9();
            return;
        }

        const startDate = new Date(`${currentYear}-${startDateInput}`);
        if (isNaN(startDate)) {
            console.log('❌ Date de début invalide. Veuillez réessayer.');
            executeSpec9();
            return;
        }

        // Entrez la date de fin au format "MM-DD"
        rl.question('Entrez la date de fin (Ex. : 12-08) (par défaut : 12-08) : ', (endDateInput) => {
            endDateInput = endDateInput.trim() || '12-08';

            if (endDateInput.toLowerCase() === '*') {
                promptUser(); // Retourner au menu principal
                return;
            }

            if (!dateRegex.test(endDateInput)) {
                console.log('❌ Date de fin invalide. Veuillez entrer une date au format "MM-DD".');
                executeSpec9();
                return;
            }

            const endDate = new Date(`${currentYear}-${endDateInput}`);
            if (isNaN(endDate) || endDate < startDate) {
                console.log('❌ Date de fin invalide ou antérieure à la date de début. Veuillez réessayer.');
                executeSpec9();
                return;
            }

            // Demander le seuil de sous-utilisation
            rl.question('Entrez le seuil de sous-utilisation (0-100, par défaut 20%) : ', (underUtilizationInput) => {
                if (underUtilizationInput.trim() === '*') {
                    promptUser();
                    return;
                }

                // Vérifier la saisie du seuil de sous-utilisation
                if (underUtilizationInput.trim() !== '' && !percentageRegex.test(underUtilizationInput)) {
                    console.log('❌ Seuil de sous-utilisation invalide. Veuillez entrer un nombre entre 0 et 100.');
                    executeSpec9();
                    return;
                }

                // Si le seuil est vide, définir par défaut à 20, sinon convertir en nombre
                const underUtilizationThreshold = underUtilizationInput.trim() === '' ? 20 : parseInt(underUtilizationInput, 10);

                // Demander le seuil de sur-utilisation
                rl.question('Entrez le seuil de sur-utilisation (0-100, par défaut 80%) : ', (overUtilizationInput) => {
                    if (overUtilizationInput.trim() === '*') {
                        promptUser(); // Retourner au menu principal
                        return;
                    }

                    // Vérifier la saisie du seuil de sur-utilisation
                    if (overUtilizationInput.trim() !== '' && !percentageRegex.test(overUtilizationInput)) {
                        console.log('❌ Seuil de sur-utilisation invalide. Veuillez entrer un nombre entre 0 et 100.');
                        executeSpec9();
                        return;
                    }

                    // Si le seuil est vide, définir par défaut à 80, sinon convertir en nombre
                    const overUtilizationThreshold = overUtilizationInput.trim() === '' ? 80 : parseInt(overUtilizationInput, 10);

                    // Appeler la fonction spécifique de spec9 pour analyser les salles sur ou sous-exploitées
                    const directory = './data'; // Dossier contenant les fichiers edt.cru
                    spec9.analyzeOverUnderUtilizedRooms(directory, startDate, endDate, underUtilizationThreshold, overUtilizationThreshold);

                    // Inviter l'utilisateur à appuyer sur Entrée pour retourner au menu principal
                    rl.question('\nAppuyez sur Entrée pour continuer...', () => {
                        promptUser();
                    });
                });
            });
        });
    });
}

/**
 * Fonction pour demander à l'utilisateur de choisir une option
 */
function promptUser() {
    displayMenu();
    rl.question('Choisissez une option (0-9) : ', handleUserChoice);
}

// Lancer le programme en affichant le menu principal
promptUser();
export{
    executeSpec1,
    executeSpec2,
    executeSpec3,
}