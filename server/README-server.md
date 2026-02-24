
# Book & Byte - Server Application

Το backend API της εφαρμογής, υλοποιημένο με **Node.js**, **Express** και **MongoDB**.

## Εγκατάσταση

```bash
cd server
npm install
```

## Ρύθμιση Περιβάλλοντος (.env)

Το δωσμένο `server/.env` αρχείο περιέχει το port που τρέχει ο server by default (5000). Αν αλλάξει αυτό, πρέπει να αλλάξει και σε αντίστοιχα σημεία στον client.
Επίσης έχει το uri επικοινωνίας με την dummy database του mongodb που έχουμε σετάρει.

# Εκτέλεση
Για να ξεκινήσετε τον server:

```bash
npm start
```
Ο server θα τρέχει στο http://localhost:5000.

## API Endpoints
* **GET /api/courses:** Λήψη όλων των μαθημάτων (υποστηρίζει φιλτράρισμα).
* **GET /api/courses/:id:** Λήψη λεπτομερειών ενός μαθήματος.
* **GET /api/books:** Λήψη λίστας βιβλίων (υποστηρίζει φιλτράρισμα).
* **GET /api/categories:** Λήψη κατηγοριών.
* **POST /api/auth/register:** Εγγραφή νέου χρήστη.
* **POST /api/auth/login:** Σύνδεση χρήστη.
* **POST /api/auth/check-email:** Ελέγχει για την ύπαρξη ή μη χρήστη με δοσμένο e-mail.