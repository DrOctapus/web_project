# Ανάπτυξη Full Stack Εφαρμογής (MEAN Architecture)

Δυναμική client-server εφαρμογή για το μάθημα Τεχνολογίες και Προγραμματισμός στον Ιστό, AUEB 2026.

## Περιγραφή Αρχιτεκτονικής
* **Client:** Angular (Φάκελος `/client`)
* **Server:** Node.js + Express (Φάκελος `/server`)
* **Database:** MongoDB

## Στοιχεία Φοιτητών
* Θοδωρής Μαλέας p3220113
* Ανδρέας Χαράλαμπος Παναγόπουλος p3220145


## Προαπαιτούμενα
* Node.js (v18+)
* npm

## Οδηγίες Γρήγορης Εκκίνησης

Για να τρέξει η εφαρμογή, πρέπει να εκτελεστούν πρώτα ο Server και ύστερα ο Client.

Για περισσότερες λεπτομέρειες, δείτε τα README-client.md και README-server.md στους αντίστοιχους φακέλους.


## Ροή Δεδομένων

Στο `/client/src/app/services/api.service.ts` υπάρχουν τα functions που χρισημοποιεί ο client για να επικοινωνήσει με τον server. Κάθε συνάρτηση χρισημοποιεί το REST API σε συγκεκριμένο endpoint (λεπτομέρειες των endpoint στο README-server.md), και επιστρέφει την απάντηση.

Στο `/server/src/app.js` συνδέονται τα URLs με routes. Κάθε request γίνεται redirected στον αντίστοιχο κώιδκα. Αν δημιουργηθεί error σε κάποιο route, αυτό το σφάλμα στέλνεται μέσω της Next στο `errorHandler.ts` middleware που είναι μαζεμένα ολα τα πιθανά error responses. To κάθε route αρχικά καλεί το αντίστοιχο validate function απο το `validateRequest.ts` middleware που κάνει εκαθάριση του input απο τον client. Στην συνέχεια, η πληροφορία στέλνεται στον αντίστοιχο controller. O κάθε controller έχει  άμμεση επικοινωνία με την βάση και χειρείζεται τα queries και τις απαντήσεις απο και προς την βάση. Ύστερα επιστρέφει τα responses στον client.
