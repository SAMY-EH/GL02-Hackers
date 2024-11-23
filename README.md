# GL02-Hackers

# Gestion des Salles de l'Université de Sealand (SRU)

Ce projet permet de vérifier la disponibilité des salles à l'Université de la République de Sealand (SRU) pour une utilisation optimale des espaces. L'application permet aux étudiants et aux enseignants de consulter la disponibilité des salles de cours pour travailler en groupe ou organiser des séances de cours.

## Table des matières

- [Contexte](#contexte)
- [Fonctionnalités](#fonctionnalités)
- [Prérequis](#prérequis)
- [Structure des fichiers](#structure-des-fichiers)

---

## Contexte

L'Université Centrale de la République de Sealand (SRU) souhaite améliorer la gestion de l'occupation de ses salles de cours. Le système permet aux utilisateurs (étudiants et enseignants) de :

1. Vérifier la disponibilité des salles en fonction des horaires et des jours de la semaine.
2. Afficher les créneaux horaires libres pour des sessions de travail collaboratif.
3. Consulter la capacité maximale des salles et planifier l'usage des espaces.

---

## Fonctionnalités

### **SPEC_01** : Recherche des salles pour un cours donné
- L'utilisateur peut rechercher un cours et afficher les informations concernant les salles et les horraires de ce cours.

### **SPEC_02** : Consultation de la capacité d’une salle
- L'utilisateur peut consulter la capcité maximale d'une salle, en terme de nombre de place assise. 

### **SPEC_03** : Vérification des disponibilités d'une salle
- Afin de voir si une salle est libre pour des sessions de travail collaboratif, l'utilisateur peu entrer le nom d'une salle pour afficher les horraires où la salle est disponible (du Lundi au samedi )

---

## Prérequis

Avant d'utiliser ce projet, vous devez vous assurer d'avoir les outils suivants installés sur votre machine :

- **Node.js** : [Télécharger Node.js](https://nodejs.org/)
- **npm** : Le gestionnaire de paquets de Node.js .

---

## Exemple de fonctionnement

### **Vérification des créneaux libres d'une salle** :

L'utilisateur peut saisir le nom d'une salle pour afficher ses créneaux horaires libres, par exemple :

```bash
Veuillez saisir le nom de la salle pour vérifier ses disponibilités : A108


Recherche des disponibilités pour la salle : A108

┌───────────────┬────────────────────────────────────────────────────┐
│ Jour          │ Créneaux disponibles                               │
├───────────────┼────────────────────────────────────────────────────┤
│ Lundi         │ 8h - 10h, 12h - 14h, 16h - 22h                     │
│ Mardi         │ Aucun créneau libre                                │
│ Mercredi      │ 8h - 12h, 14h - 22h                                │
│ Jeudi         │ 8h - 22h                                           │
│ Vendredi      │ 8h - 10h, 14h - 22h                                │
│ Samedi        │ 8h - 12h                                           │
└───────────────┴────────────────────────────────────────────────────┘
```

Salle non trouvée : Si l'utilisateur entre une salle qui n'existe pas, un message d'erreur s'affiche 
``Erreur : La salle "XYZ" n'existe pas dans les données.``

## Structure des fichiers
```bash

/SujetA_data    # Répertoire contenant les données des cours triés par ordre alphabétique
  /AB
    edt.cru
  /CD
    edt.cru
  ...
  /ST
    edt.cru
spec1.js        # Fichier pour la recherche des salles pour un cours donné
spec2.js        # Fichier pour la consultation de la capacité maximale d’une salle
spec3.js        # Fichier pour la vérification des disponibilités

```
### Remarque 
Le projet est en développement, des ajouts de fonctionnalités et des corrections de bugs peuvent être attendus dans les versions futures.
