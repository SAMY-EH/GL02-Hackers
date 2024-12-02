/**
 * @file parser.js
 * @description Ce fichier contient le code permettant d'analyser les fichiers d'emploi du temps (edt.cru).
 *              Il extrait les créneaux d'enseignement, les salles, les horaires, et autres informations
 *              nécessaires pour répondre aux spécifications du projet.
 *
 * @context Projet GL02 - Hackers
 *
 * @author Théo TORREILLES
 * @version 1.1
 * @date Décembre 2024
 *
 * @functions
 * - validateDay(day): Valide un jour de la semaine (L, MA, ME, J, V, S, D).
 * - validateTime(time): Valide un horaire au format HH:MM-HH:MM.
 * - parseAllEdtFiles(directory, debug): Lit tous les fichiers edt.cru dans un répertoire et retourne les créneaux.
 * - parseEdtFile(filepath, debug): Lit un fichier edt.cru et retourne les créneaux.
 * - parseEdtData(data, debug): Analyse le contenu d'un fichier edt.cru en lignes de créneaux.
 * - parseTimeSlot(line, course, debug): Analyse une ligne de créneau et retourne un ou plusieurs objets représentant des créneaux.
 * - parseSingleTimeSlot(timeSlotString, course, debug): Analyse un créneau de base.
 * - parseAdditionalTimeSlot(part, baseTimeSlot, debug): Analyse un créneau additionnel en héritant les informations du créneau de base.
 *
 * @dependencies
 * - Node.js 'fs' module pour la lecture des fichiers locaux.
 * - Node.js 'path' module pour la gestion des chemins de fichiers.
 *
 * @usage
 *   import { parseEdtFile } from './parser.js';
 *   const timeSlots = parseEdtFile('./data/AB/edt.cru');
 *   console.log(timeSlots);
 *
 * @note Ce code est conçu pour gérer les fichiers edt.cru conformément aux spécifications du projet.
 *       Les formats attendus doivent être respectés afin de garantir le bon fonctionnement du parser.
 */

// Importer les modules nécessaires
import fs from 'fs';
import path from 'path';

// Regexs pour validations
const regexID = /^\d+$/; // Doit être un nombre
const regexType = /^[A-Z]\d+$/; // Type (Ex.: "C1", "D2")
const regexDay = /^(L|MA|ME|J|V|S|D)$/; // Jours valides : L, MA, ME, J, V, S, D
const regexTime = /^([01]?\d|2[0-3]):[0-5]\d-([01]?\d|2[0-3]):[0-5]\d$/; // Plage horaire (Ex.: 14:00-16:00)
const regexIndex = /^F\d+$/; // Index comme F1, F2, etc...
const regexRoom = /^S=\w+$/; // Salle (Ex.: S=B210)

/**
 * Valide un jour de la semaine (L, MA, ME, J, V, S, D)
 * @param {*} day Le jour à valider
 * @returns true si le jour est valide, false sinon
 */
function validateDay(day) {
    return regexDay.test(day);
}

/**
 * Valide un horaire au format HH:MM-HH:MM
 * @param {*} time L'horaire à valider
 * @returns true si l'horaire est valide, false sinon
 */
function validateTime(time) {
    return regexTime.test(time);
}

/**
 * Lit tous les fichiers edt.cru dans un répertoire et retourne les créneaux d'enseignement.
 * @param {*} directory Le répertoire contenant les fichiers edt.cru
 * @param {*} [debug] Afficher les messages de débogage (par défaut : false)
 * @returns Les créneaux
 */
function parseAllEdtFiles(directory, debug = false) {
    let allTimeSlots = [];

    // Lire le répertoire principal
    const subDirs = fs.readdirSync(directory);
    subDirs.forEach(subDir => {
        const subDirPath = path.join(directory, subDir);
        try {
            if (fs.statSync(subDirPath).isDirectory()) {
                const edtFilePath = path.join(subDirPath, 'edt.cru');
                if (fs.existsSync(edtFilePath)) {
                    if (debug) console.log(`Analyse du fichier : ${edtFilePath}`);
                    const timeSlots = parseEdtFile(edtFilePath);
                    allTimeSlots = allTimeSlots.concat(timeSlots);
                }
            }
        } catch (error) {
            if (debug) console.error(`Erreur lors de l'analyse du sous-répertoire ${subDir}:`, error);
        }
    });

    return allTimeSlots;
}

/**
 * Lit un fichier edt.cru et retourne les créneaux
 * @param {*} filepath Le chemin du fichier edt.cru
 * @param {*} [debug] Afficher les messages de débogage (par défaut : false)
 * @returns Les créneaux
 */
function parseEdtFile(filepath, debug = false) {
    try {
        const data = fs.readFileSync(filepath, 'utf-8');
        return parseEdtData(data);
    } catch (error) {
        if (debug) console.error(`Erreur lors de la lecture du fichier ${filepath}:`, error);
        return [];
    }
}

/**
 * Analyse le contenu d'un fichier edt.cru en lignes de créneaux.
 * @param {*} data Le contenu du fichier edt.cru
 * @param {*} [debug] Afficher les messages de débogage (par défaut : false)
 * @returns Les créneaux
 */
function parseEdtData(data, debug = false) {
    const lines = data.split('\n');
    let course = null;
    let timeSlots = [];

    lines.forEach(line => {
        line = line.trim();

        if (line === '' || line.startsWith('Page générée en')) {
            // Ignorer les lignes vides et les lignes générées
            return;
        }

        if (line.startsWith('+')) {
            // Si la ligne commence par '+', c'est le début d'un nouveau cours
            course = line.substring(1).trim();
        } else if (course && line.includes('S=')) {
            // Ligne contenant les informations du créneau, doit contenir 'S=' pour être valide
            const newTimeSlots = parseTimeSlot(line, course);
            if (newTimeSlots && newTimeSlots.length > 0) {
                timeSlots = timeSlots.concat(newTimeSlots);
            }
        } else {
            if (debug) console.warn('Ligne ignorée :', line);
        }
    });

    return timeSlots;
}

/**
 * Analyse une ligne de créneau et retourne un ou plusieurs objets représentant des créneaux.
 * @param {*} line La ligne de créneau
 * @param {*} course Le cours associé
 * @param {*} [debug] Afficher les messages de débogage (par défaut : false)
 * @returns Les créneaux
 */
function parseTimeSlot(line, course, debug = false) {
    try {
        // Supprimer les caractères superflus et séparer les créneaux possibles par '/'
        const parts = line.trim().split('/');
        const mainPart = parts[0];
        const additionalParts = parts.slice(1);

        // Analyser le créneau principal
        const baseTimeSlot = parseSingleTimeSlot(mainPart, course);
        if (!baseTimeSlot) {
            throw new Error("Le créneau de base est invalide : " + mainPart);
        }

        let timeSlots = [baseTimeSlot];

        // Analyser les autres créneaux s'il y en a, en héritant des informations du créneau de base
        additionalParts.forEach(part => {
            if (part.trim() === '') {
                return; // Ignorer les créneaux vides
            }

            const extraTimeSlot = parseAdditionalTimeSlot(part, baseTimeSlot);
            if (extraTimeSlot) {
                timeSlots.push(extraTimeSlot);
            }
        });

        return timeSlots;
    } catch (error) {
        if (debug) console.error('Erreur lors de l\'analyse du créneau :', error.message);
        return [];
    }
}

/**
 * Analyse un créneau de base.
 * @param {*} timeSlotString La chaîne de caractères représentant le créneau
 * @param {*} course Le cours associé
 * @param {*} [debug] Afficher les messages de débogage (par défaut : false)
 * @returns L'objet créneau
 */
function parseSingleTimeSlot(timeSlotString, course, debug = false) {
    try {
        const parts = timeSlotString.trim().split(',');
        if (parts.length < 6) {
            throw new Error("Format de ligne invalide : " + timeSlotString);
        }

        const [id, type, capacityStr, timeStr, index, roomStr] = parts;

        // Vérification de l'ID
        if (!regexID.test(id)) {
            throw new Error("ID invalide : " + id);
        }

        // Vérification du type
        if (!regexType.test(type)) {
            throw new Error("Type invalide : " + type);
        }

        // Vérification de la capacité
        if (!capacityStr.includes('P=')) {
            throw new Error("Capacité manquante : " + timeSlotString);
        }
        const capacity = parseInt(capacityStr.split('=')[1], 10);
        if (isNaN(capacity)) {
            throw new Error("Capacité invalide : " + capacityStr);
        }

        // Vérification des informations d'horaire
        if (!timeStr.includes('H=')) {
            throw new Error("Horaire manquant : " + timeSlotString);
        }

        const timeParts = timeStr.split('H=')[1].split(' ');
        if (timeParts.length < 2) {
            throw new Error("Format de l'horaire invalide : " + timeStr);
        }

        const [day, timeRange] = timeParts;
        if (!validateDay(day)) {
            throw new Error("Jour invalide : " + day);
        }

        if (!validateTime(timeRange)) {
            throw new Error("Format des heures invalide : " + timeRange);
        }

        const [startTime, endTime] = timeRange.split('-');

        // Vérification de la salle
        if (!regexRoom.test(roomStr)) {
            throw new Error("Salle invalide : " + roomStr);
        }
        const room = roomStr.split('=')[1].replace('//', '').trim();

        // Construire et retourner l'objet créneau
        return {
            course,
            id: id.trim(),
            type: type.trim(),
            capacity,
            day: day.trim(),
            startTime: startTime.trim(),
            endTime: endTime.trim(),
            index: index.trim(),
            room: room.trim()
        };
    } catch (error) {
        if (debug) console.error('Erreur lors de l\'analyse du créneau de base :', error.message);
        return null;
    }
}

/**
 * Analyse un créneau additionnel en héritant les informations du créneau de base.
 * @param {*} part La partie de créneau additionnelle
 * @param {*} baseTimeSlot Le créneau de base
 * @param {*} [debug] Afficher les messages de débogage (par défaut : false)
 * @returns L'objet créneau
 */
function parseAdditionalTimeSlot(part, baseTimeSlot, debug = false) {
    try {
        // On commence par cloner le créneau de base
        let timeSlot = { ...baseTimeSlot };

        // Diviser d'abord par ',' puis analyser chaque partie avec plus de détails
        const parts = part.trim().split(',');

        let newDay = null, newStartTime = null, newEndTime = null, newIndex = null, newRoom = null;

        parts.forEach((element) => {
            const subElements = element.trim().split(' ');

            subElements.forEach(subElement => {
                if (regexTime.test(subElement)) {
                    // Plage horaire
                    const [start, end] = subElement.split('-');
                    if (start && end) {
                        newStartTime = start.trim();
                        newEndTime = end.trim();
                    }
                } else if (validateDay(subElement)) {
                    // Jour (ex. : "L" ou "MA")
                    newDay = subElement.trim();
                } else if (regexIndex.test(subElement)) {
                    // L'élément est un index (comme F1)
                    newIndex = subElement.trim();
                } else if (regexRoom.test(subElement)) {
                    // Salle spécifiée
                    newRoom = subElement.split('=')[1].trim();
                }
            });
        });

        // Vérification stricte : il faut avoir de nouveaux horaires valides
        if (newStartTime && newEndTime) {
            // Appliquer les nouvelles informations si elles sont valides
            if (newDay) {
                timeSlot.day = newDay;
            }
            timeSlot.startTime = newStartTime;
            timeSlot.endTime = newEndTime;
            if (newIndex) {
                timeSlot.index = newIndex;
            }
            if (newRoom) {
                timeSlot.room = newRoom;
            }

            return timeSlot;
        } else {
            // Si le créneau additionnel n'est pas valide, ignorer
            if (debug) console.warn('Créneau additionnel ignoré car il est incomplet ou invalide :', part);
            return null;
        }
    } catch (error) {
        if (debug) console.error('Erreur lors de l\'analyse du créneau additionnel :', error.message);
        return null;
    }
}

// Export des fonctions
export {
    parseAllEdtFiles,
    parseEdtFile
}
