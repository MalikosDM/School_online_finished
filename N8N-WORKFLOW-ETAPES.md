# Configuration du workflow N8N — Email vers Google Sheets

Ce workflow reçoit les emails envoyés par le site (via Vercel) et ajoute chaque email dans une ligne de Google Sheets.

**URL du webhook (production)** : `https://n8n.srv1271485.hstgr.cloud/webhook/get-email`

---

## Étape 1 — Importer le workflow dans N8N

1. Ouvre ton instance N8N (ex. https://n8n.srv1271485.hstgr.cloud).
2. Dans le menu (icône **⋮** en haut à droite), clique sur **Import from File** (ou **Importer depuis un fichier**).
3. Choisis le fichier **`n8n-workflow-email-to-sheets.json`** (à la racine du projet).
4. Le workflow apparaît sur le canvas avec 3 nœuds : **Webhook POST** → **Google Sheets** → **Respond to Webhook**.

---

## Étape 2 — Configurer le nœud « Webhook POST »

1. Clique sur le nœud **Webhook POST**.
2. Vérifie que :
   - **HTTP Method** = `POST`
   - **Path** = `get-email`
   - **Respond** = `Using 'Respond to Webhook' Node` (ou équivalent).
3. Tu n’as pas besoin de modifier l’URL du webhook : elle est fixée par N8N (ta base + path).  
   Exemple d’URL affichée : `https://n8n.srv1271485.hstgr.cloud/webhook/get-email` (en production) ou `.../webhook-test/get-email` (en test).
4. Ferme le nœud (sauvegarde automatique).

---

## Étape 3 — Configurer le nœud « Google Sheets »

1. Clique sur le nœud **Google Sheets**.
2. **Credential (Compte Google)**  
   - Clique sur **Create New Credential** (ou **Select Credential** si tu en as déjà un).  
   - Connecte ton compte Google (OAuth2).  
   - Autorise l’accès à Google Sheets.
3. **Document**  
   - **Document** : choisis ton Google Sheet dans la liste (ou colle l’ID du document).  
   - Si tu n’as pas encore de fichier : crée un Google Sheet, mets en première ligne par exemple **Email** et **Date**, puis reviens dans N8N et rafraîchis la liste.
4. **Sheet (Feuille)**  
   - Choisis la feuille à utiliser (ex. **Feuille 1**).
5. **Columns (Colonnes)**  
   - Le mapping est déjà défini :
     - **Email** → valeur reçue du formulaire
     - **Date** → date/heure d’enregistrement
   - Si les noms de colonnes dans ta feuille sont différents (ex. « E-mail », « Date d’inscription »), adapte les noms dans le mapping pour qu’ils correspondent exactement à la première ligne de ta feuille.
6. Ferme le nœud.

---

## Étape 4 — Vérifier le nœud « Respond to Webhook »

1. Clique sur le nœud **Respond to Webhook**.
2. Vérifie que :
   - **Respond With** = `JSON`
   - **Response Code** = `200`
   - Le **Response Body** contient bien `{ "ok": true }` (ou l’expression qui le génère).
3. Aucune autre configuration n’est obligatoire (le site passe par Vercel, donc pas besoin de CORS ici).
4. Ferme le nœud.

---

## Étape 5 — Sauvegarder et activer le workflow

1. Clique sur **Save** (ou **Sauvegarder**) en haut à droite.
2. Donne un nom au workflow si tu veux (ex. « Email vers Google Sheets »).
3. **Active le workflow** avec le switch **Active** (en haut).  
   Tant que le workflow n’est pas actif, l’URL du webhook ne répond pas.
4. Une fois actif, l’URL de production est du type :  
   `https://n8n.srv1271485.hstgr.cloud/webhook/get-email`

---

## Étape 6 — Tester

1. Sur ton site (en prod ou en local avec le proxy), entre une adresse email dans le formulaire et envoie.
2. Vérifie dans N8N :
   - **Executions** : une nouvelle exécution doit apparaître avec statut vert (succès).
   - En ouvrant l’exécution, tu vois les données reçues (body avec `email`) et la ligne envoyée à Google Sheets.
3. Ouvre ton Google Sheet : une nouvelle ligne doit apparaître avec l’email et la date.

---

## Dépannage rapide

- **Aucune exécution** : vérifie que le workflow est bien **Active** et que le site envoie vers la bonne URL (le site passe par `/api/send-email`, qui est relayé par Vercel vers ton webhook N8N).
- **Erreur dans Google Sheets** : revérifie le compte Google, le document, le nom de la feuille et les noms des colonnes (identiques à la première ligne).
- **Email vide dans la feuille** : le body envoyé est `{ "email": "..." }`. Dans N8N il est souvent dans `$json.body.email`. Si ta version met l’email ailleurs, adapte l’expression dans la colonne **Email** du nœud Google Sheets (ex. `$json.email` ou `$json.body.data.email` selon ce que tu vois dans les données du Webhook).

Une fois ces étapes faites, le workflow est aligné avec le repo et le site déployé sur Vercel.
