# GL02-Hackers

# Gestion des Salles de l'Université de Sealand (SRU)

Ce projet vise à optimiser l'utilisation des salles de l'Université de la République de Sealand (SRU) en permettant aux étudiants, enseignants et gestionnaires de vérifier la disponibilité, la capacité, et l'utilisation des espaces. Le logiciel permet également la planification des cours et des sessions de travail collaboratif.

---

## Table des matières

- [Contexte](#contexte)
- [Exigences fonctionnelles](#Exigences-fonctionnelles)
  - [SPEC_01 : Recherche des salles pour un cours donné](#SPEC_01--Recherche-des-salles-pour-un-cours-donné)
  - [SPEC_02 : Consultation de la capacité d’une salle](#SPEC_02--Consultation-de-la-capacité-dune-salle)
  - [SPEC_03 : Vérification des disponibilités d'une salle](#SPEC_03--Vérification-des-disponibilités-dune-salle)
  - [SPEC_04 : Recherche de salle disponible pour un créneau donné](#SPEC_04--Recherche-de-salle-disponible-pour-un-créneau-donné)
  - [SPEC_05 : Génération d’un fichier iCalendar](#SPEC_05--Génération-dun-fichier-iCalendar)
  - [SPEC_06 : Vérification de la conformité des données](#SPEC_06--Vérification-de-la-conformité-des-données)
  - [SPEC_07 : Visualisation du taux d’occupation des salles](#SPEC_07--Visualisation-du-taux-doccupation-des-salles)
  - [SPEC_08 : Classement des salles par capacité](#SPEC_08--Classement-des-salles-par-capacité)
  - [SPEC_09 : Consultation des salles sur ou sous-exploitées](#SPEC_09--Consultation-des-salles-sur-ou-sous-exploitées)
- [Exigences non fonctionnelles](#Exigences-non-fonctionnelles)
  - [SPEC_NF_01 : Simplicité d’utilisation](#SPEC_NF_01--Simplicité-dutilisation)
  - [SPEC_NF_02 : Performance](#SPEC_NF_02--Performance)
  - [SPEC_NF_03 : Compatibilité](#SPEC_NF_03--Compatibilité)
- [Prérequis](#prérequis)
- [Dépendances](#dépendances)
  - [Dépendances du projet](#dépendances-du-projet)
  - [Liste des dépendances clés](#liste-des-dépendances-clés)
- [Installation](#installation)
- [Utilisation](#utilisation)
  - [Exécution des fonctionnalités](#exécution-des-fonctionnalités)
- [Tests Unitaires](#tests-unitaires)
  - [Couverture des tests unitaires](#couverture-des-tests-unitaires)
  - [Exécution des tests](#exécution-des-tests)
  - [Exemple d'exécution d'un test spécifique](#exemple-dexécution-dun-test-spécifique)
- [Structure des fichiers](#structure-des-fichiers)
- [Remarque](#remarque)

---

## Contexte

L'Université Centrale de la République de Sealand (SRU) cherche à améliorer la gestion de l'occupation de ses salles de cours. Le système est conçu pour permettre :

1. Aux étudiants et enseignants de vérifier la disponibilité des salles et d'organiser des sessions de travail.
2. Aux gestionnaires de locaux d'identifier les salles sous-exploitées et sur-exploitées afin de planifier des ajustements futurs.

---

## Exigences fonctionnelles

### **SPEC_01** : Recherche des salles pour un cours donné
- Le logiciel doit permettre aux utilisateurs de rechercher les salles attribuées à un cours spécifique.

### **SPEC_02** : Consultation de la capacité d’une salle
- Les utilisateurs doivent pouvoir consulter la capacité maximale d’une salle en termes de nombre de places.

### **SPEC_03** : Vérification des disponibilités d'une salle
- Le logiciel doit permettre de vérifier les moments où une salle spécifique est libre durant la semaine pour permettre du travail collaboratif.

### **SPEC_04** : Recherche de salle disponible pour un créneau donné
- Les utilisateurs doivent pouvoir connaître les salles disponibles pour un créneau horaire donné.

### **SPEC_05** : Génération d’un fichier iCalendar
- Le logiciel doit permettre aux utilisateurs de générer un fichier iCalendar (conforme à la norme RFC 5545) pour les cours auxquels ils participent, entre deux dates spécifiées, et ainsi l’intégrer à son propre calendrier.

### **SPEC_06** : Vérification de la conformité des données
- Le logiciel doit vérifier qu'aucune salle ne soit utilisée par deux cours différents au même créneau horaire.

### **SPEC_07** : Visualisation du taux d’occupation des salles
- Le système doit pouvoir générer une visualisation synthétique du taux d’occupation des salles sur une période donnée.

### **SPEC_08** : Classement des salles par capacité
- Le logiciel doit permettre le classement des salles par leur capacité d’accueil (par exemple, combien de salles de 24 places sont disponibles).

### **SPEC_09** : Consultation des salles sur ou sous-exploitées
- Le gestionnaire des locaux doit pouvoir identifier quelles salles sont sous-exploitées ou surexploitées afin de planifier des ajustements futurs.

---

## Exigences non fonctionnelles

### **SPEC_NF_01** : Simplicité d’utilisation
- Le logiciel doit être facile à utiliser, même pour des utilisateurs non techniques. Il doit fournir des messages d'erreurs clairs en cas d’entrées incorrectes.

### **SPEC_NF_02** : Performance
- Le système doit fournir des réponses aux requêtes en temps réel, avec un délai maximal de 2 secondes pour les opérations de recherche et de génération de fichiers.

### **SPEC_NF_03** : Compatibilité
- Le fichier iCalendar généré doit être compatible avec les principaux logiciels de gestion d’agendas (Google Calendar, Outlook, etc.).

---

## Prérequis

Avant d'utiliser ce projet, assurez-vous d'avoir installé les outils suivants :

- **Node.js** : [Télécharger Node.js](https://nodejs.org/)
- **npm** : Le gestionnaire de paquets de Node.js

---

## Dépendances

Ce projet utilise plusieurs bibliothèques et modules pour assurer son bon fonctionnement. Les dépendances sont gérées via npm, ce qui facilite leur installation et leur mise à jour. Voici une liste des principales dépendances utilisées dans le projet :

### Dépendances du projet

- **Node.js :** Le runtime JavaScript qui permet d'exécuter du code JavaScript côté serveur. 
- **ical-generator :** Utilisé pour générer des fichiers iCalendar conformes à la norme RFC 5545. Cela permet de créer des calendriers facilement intégrables dans des outils comme Google Calendar, Outlook, etc. 
- **fs (file system) :** Utilisé pour la lecture et l'écriture de fichiers, notamment pour traiter les données des emplois du temps et sauvegarder les fichiers générés.
- **Jasmine :** Un framework de test pour JavaScript, utilisé pour écrire et exécuter des tests unitaires, garantissant la qualité des différentes fonctionnalités du projet.

### Liste des dépendances clés
```
{
    "dependencies": {
      "ical-generator": "^8.0.1"  // Génération de fichiers iCalendar
    },
    "devDependencies": {
      "jasmine": "^5.5.0"         // Framework de test pour les tests unitaires
    }
}
```

Vous pouvez consulter le fichier `package.json` pour voir la liste complète des dépendances utilisées, ainsi que leurs versions exactes.

---

## Installation

Clonez le dépôt, puis installez les dépendances nécessaires :

```bash
git clone <url_du_dépôt>
cd GL02-Hackers
npm install
```

---

## Utilisation

Pour lancer l'application, utilisez la commande suivante :

```bash
node main.js
```

### Exécution des fonctionnalités

Lors du démarrage de l'application, un menu principal s'affiche, vous permettant de choisir l'une des fonctionnalités :

- Recherche des salles pour un cours donné
- Consultation de la capacité maximale d’une salle
- Vérification des disponibilités d'une salle
- Recherche de salle disponible pour un créneau donné
- Génération d’un fichier iCalendar
- Vérification de la conformité des données
- Visualisation du taux d’occupation des salles
- Classement des salles par capacité
- Consultation des salles sur ou sous-exploitées

Tapez le numéro correspondant à la fonctionnalité souhaitée et suivez les instructions.

---

## Tests Unitaires

Les tests permettent de s'assurer que toutes les fonctionnalités fonctionnent comme prévu et sont conformes aux exigences définies. Les tests sont écrits en utilisant **Jasmine** pour fournir un cadre simple et efficace pour les tests.

### Couverture des tests unitaires

Chaque spécification principale du projet a des tests unitaires associés, qui vérifient les aspects critiques des fonctionnalités :

- **SPEC_01 :** Vérifie si les salles sont correctement identifiées pour un cours spécifique.

- **SPEC_02 :** Vérifie la capacité maximale d'une salle.

- **SPEC_03 :** Vérifie les créneaux disponibles pour une salle spécifique.

- **SPEC_04 :** Vérifie la recherche de salles disponibles pour un créneau donné.

- **SPEC_05 :** Vérifie la génération correcte d'un fichier iCalendar conforme à la norme RFC 5545.

- **SPEC_06 :** Vérifie l'absence de chevauchement entre les cours dans la même salle.

- **SPEC_07 :** Vérifie le calcul du taux d'occupation des salles sur une période donnée.

- **SPEC_08 :** Vérifie le classement des salles en fonction de leur capacité.

- **SPEC_09 :** Vérifie la détection des salles sur ou sous-exploitées pour permettre une planification adéquate.

### Exécution des tests

Les tests unitaires sont situés dans le répertoire `spec` et peuvent être exécutés en utilisant **Jasmine**. Assurez-vous d'avoir installé les dépendances nécessaires à l'aide de `npm install`.

Pour exécuter tous les tests unitaires, utilisez la commande suivante :

```bash
npx jasmine
```

Chaque fichier de test contient plusieurs cas de test visant à vérifier le comportement attendu de la spécification concernée.

### Exemple d'exécution d'un test spécifique

Pour exécuter un test spécifique, par exemple le test de **SPEC_04** (Recherche de salle disponible pour un créneau donné), utilisez la commande :

```bash
npx jasmine spec/spec1.spec.js
```

---

## Structure des fichiers

```bash
/data                        # Répertoire contenant les données des cours triés par ordre alphabétique
  /AB
    edt.cru
  /CD
    edt.cru
  ...
  /ST
    edt.cru

/functions                   # Répertoire contenant les fichiers des spécifications
  spec1.js                   # Recherche des salles pour un cours donné
  spec2.js                   # Consultation de la capacité maximale d’une salle
  spec3.js                   # Vérification des disponibilités
  spec4.js                   # Recherche de salle disponible pour un créneau donné
  spec5.js                   # Génération d’un fichier iCalendar
  spec6.js                   # Vérification de la conformité des données
  spec7.js                   # Visualisation du taux d’occupation des salles
  spec8.js                   # Classement des salles par capacité
  spec9.js                   # Consultation des salles sur ou sous-exploitées

/spec                        # Répertoire contenant les tests unitaires
  /support                   # Répertoire contenant Jasmine
    jasmine.mjs              # Fichier de configuration et de support pour l'exécution des tests Jasmine
  spec1.spec.js              # Tests pour SPEC_01 : Recherche des salles pour un cours donné
  spec2.spec.js              # Tests pour SPEC_02 : Consultation de la capacité d'une salle
  spec3.spec.js              # Tests pour SPEC_03 : Vérification des disponibilités d'une salle
  spec4.spec.js              # Tests pour SPEC_04 : Recherche de salle disponible pour un créneau donné
  spec5.spec.js              # Tests pour SPEC_05 : Génération d'un fichier iCalendar
  spec6.spec.js              # Tests pour SPEC_06 : Vérification de la conformité des données
  spec7.spec.js              # Tests pour SPEC_07 : Visualisation du taux d'occupation des salles
  spec8.spec.js              # Tests pour SPEC_08 : Classement des salles par capacité
  spec9.spec.js              # Tests pour SPEC_09 : Consultation des salles sur ou sous-exploitées

/utility                     # Répertoire contenant des modules utilitaires
  functions.js               # Fonctions utilitaires (tri, transformation de jours, regroupement de données, etc...)
  parser.js                  # Analyse des fichiers edt.cru et extraction des créneaux

.gitignore                   # Fichier listant les fichiers et dossiers à ignorer par Git lors des commits (par exemple, node_modules)
main.js                      # Point d'entrée du programme, avec menu principal pour sélectionner les fonctionnalités
package-lock.json            # Fichier de gestion des versions exactes des dépendances pour npm
package.json                 # Fichier de configuration contenant les informations sur le projet et ses dépendances
README.md                    # Documentation du projet
```

---

## Remarque 

Le projet est en cours de développement et peut être sujet à des ajouts de fonctionnalités ainsi qu'à des corrections de bugs dans les versions futures. Pour toute contribution ou rapport de problème, n'hésitez pas à ouvrir une issue ou une pull request sur le dépôt.
