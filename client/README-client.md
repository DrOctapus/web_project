# Book & Byte - Client Application

Αυτό είναι το client-side μέρος της εφαρμογής "Book & Byte", υλοποιημένο με **Angular** και **Vite**. Η εφαρμογή επικοινωνεί με ένα REST API backend για την ανάκτηση μαθημάτων, βιβλίων και τη διαχείριση χρηστών.

## Εγκατάσταση

Μεταβείτε στον φάκελο του client και εγκαταστήστε τα dependencies:

```bash
cd client
npm install
```
Ρύθμιση Σύνδεσης (API)
Η εφαρμογή είναι ρυθμισμένη να επικοινωνεί με τον server στη διεύθυνση http://localhost:5000. Αν ο server τρέχει σε διαφορετική θύρα, τροποποιήστε το αρχείο: src/app/services/api.service.ts

## Εκτέλεση

```bash
npm start
```

Η εφαρμογή θα είναι διαθέσιμη στο http://localhost:4200

## Δομή Φακέλων Client
* **src/app/pages/:** Περιέχει τις κύριες σελίδες (Home, Courses, Books, Register, About, Course Details).

* **src/app/services/:** Περιέχει τα services για την επικοινωνία με το API (api.service.ts) και το Authentication (auth.service.ts).

* **src/assets/:** Στατικά αρχεία (εικόνες, CSS styles).

* **src/main.ts:** Το σημείο εισόδου της Angular εφαρμογής.

## Λειτουργικότητα
Ο client υποστηρίζει τις εξής λειτουργίες:

* Εγγραφή/Σύνδεση Χρήστη: Φόρμα register και login.

* Προβολή Μαθημάτων: Λίστα με φίλτρα (Κατηγορία, Διάρκεια, Δυσκολία) και αναζήτηση.

* Λεπτομέρειες Μαθήματος: Προβολή πληροφοριών και σχετικών συγγραμμάτων.

* Προβολή Βιβλίων: Λίστα βιβλίων με φίλτρα διαθεσιμότητας και εκδοτών.