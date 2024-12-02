# GL02-Hackers

# Gestion des Salles de l'Université de Sealand (SRU)

Ce projet vise à optimiser l'utilisation des salles de l'Université de la République de Sealand (SRU) en permettant aux étudiants, enseignants et gestionnaires de vérifier la disponibilité, la capacité, et l'utilisation des espaces. Le logiciel permet également la planification des cours et des sessions de travail collaboratif.

---

## Table des matières

- [Contexte](#contexte)
- [Fonctionnalités fonctionnelles](#fonctionnalités-fonctionnelles)
- [Fonctionnalités non fonctionnelles](#fonctionnalités-non-fonctionnelles)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure des fichiers](#structure-des-fichiers)
- [Remarque](#remarque)

---

## Contexte

L'Université Centrale de la République de Sealand (SRU) cherche à améliorer la gestion de l'occupation de ses salles de cours. Le système est conçu pour permettre :

1. Aux étudiants et enseignants de vérifier la disponibilité des salles et d'organiser des sessions de travail.
2. Aux gestionnaires de locaux d'identifier les salles sous-exploitées et sur-exploitées afin de planifier des ajustements futurs.

---

## Fonctionnalités fonctionnelles

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

## Fonctionnalités non fonctionnelles

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
- Consultation de la capacité d’une salle
- Vérification des disponibilités d'une salle
- Recherche de salle disponible pour un créneau donné
- Génération d’un fichier iCalendar
- Vérification de la conformité des données
- Visualisation du taux d’occupation des salles
- Classement des salles par capacité
- Consultation des salles sur ou sous-exploitées

Tapez le numéro correspondant à la fonctionnalité souhaitée et suivez les instructions.

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

/utility                     # Répertoire contenant des modules utilitaires
  functions.js               # Fonctions utilitaires (tri, transformation de jours, regroupement de données, etc...)
  parser.js                  # Analyse des fichiers edt.cru et extraction des créneaux

main.js                      # Point d'entrée du programme, avec menu principal pour sélectionner les fonctionnalités
README.md                    # Documentation du projet
```

---

## Remarque 

Le projet est en cours de développement et peut être sujet à des ajouts de fonctionnalités ainsi qu'à des corrections de bugs dans les versions futures. Pour toute contribution ou rapport de problème, n'hésitez pas à ouvrir une issue ou une pull request sur le dépôt.
