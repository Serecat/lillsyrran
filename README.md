# Lillsyrran

Statisk hemsida för Lillsyrran med redigering via Decap CMS.

## Redigera innehåll utan kod

Webbplatsen är förberedd för **Decap Turbo** så att restaurangägaren kan logga in i CMS med **e-post och lösenord** i stället för GitHub-konto. Innehållet sparas fortfarande i samma JSON-filer i repot:

- **Kontakt & öppettider** → `data/site-settings.json`
- **Meny** → `data/menu.json`
- **Aktuellt** → `data/events.json`

### 1) Logga in i CMS
1. Gå till `/admin/` på hemsidan (exempel: `https://<din-domän>/admin/`).
2. Klicka på **Login with Turbo**.
3. Logga in med den e-postadress och det lösenord som har bjudits in i Decap Turbo.
4. Ingen editor behöver GitHub-konto eller skrivbehörighet till repot för att publicera ändringar.

### 2) Vad som går att ändra
I CMS finns tre sektioner:
- **Kontakt & öppettider** (`data/site-settings.json`)
- **Meny** (`data/menu.json`)
- **Aktuellt** (`data/events.json`)

### 3) Publicera
- Tryck **Publish** i CMS.
- Ändringen commitas tillbaka till GitHub via Decap Turbo och visas på webbplatsen så snart Vercel har byggt om sajten.

## Publicera på Vercel med Decap Turbo

### 1) Deploya sajten på Vercel
1. Importera repot `Serecat/lillsyrran` i Vercel.
2. Deploya projektet som en vanlig statisk sajt.
3. När deployen är klar finns CMS på `https://<din-domän>/admin/`.

### 2) Koppla Decap Turbo
1. Skapa en organisation på Decap Turbo och koppla GitHub-kontot eller organisationen som äger repot.
2. Skapa en site i Turbo för `Serecat/lillsyrran`.
3. Ange:
   - **Branch:** `main`
   - **Config path:** `admin/config.yml`
   - **Admin interface URL:** `https://<din-domän>/admin/`
4. Kopiera **Site ID** från Turbos site-sida.
5. Lägg in Site ID:t som Vercel-miljövariabeln `DECAP_TURBO_SITE_ID`.
6. Deploya om sajten så att `/api/decap-config` kan lämna rätt `turbo_site_id` till `/admin/` vid inloggning.

### 3) Bjud in restaurangägaren
1. Bjud in ägaren som editor i Decap Turbo.
2. Ägaren går sedan till `https://<din-domän>/admin/`.
3. Ägaren loggar in med e-post/lösenord via Turbo och kan därefter redigera meny, evenemang och kontaktuppgifter utan GitHub.

### 4) Hur uppdateringar går live
- CMS ändrar fortfarande `data/menu.json`, `data/events.json` och `data/site-settings.json`.
- `/admin/` läser den vanliga samlingskonfigurationen från `admin/config.yml` och hämtar det deploy-specifika `turbo_site_id` från Vercel-funktionen `api/decap-config.js`.
- När en editor klickar **Publish** skapar Turbo en commit i GitHub-repot.
- Eftersom Vercel är kopplat till repot triggar committen automatiskt en ny deploy.
- De statiska sidorna fortsätter läsa innehållet via `js/cms-content.js` utan att HTML-sidorna behöver ändras.

## Teknisk översikt

- `admin/index.html` och `admin/config.yml`: CMS-admin och fältkonfiguration.
- `data/*.json`: innehållsfiler som CMS redigerar.
- `js/cms-content.js`: laddar innehåll från JSON och renderar meny/aktuellt/kontakt/öppettider.
