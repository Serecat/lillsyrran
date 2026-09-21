# Lillsyrran

Statisk hemsida för Lillsyrran med redigering via Decap CMS.

## Redigera innehåll utan kod

### 1) Logga in i CMS
1. Gå till `/admin/` på hemsidan (exempel: `https://<din-domän>/admin/`).
2. Logga in med GitHub-konto.
3. Endast användare med skrivbehörighet i repot kan publicera ändringar.

> Tips: Ge bara familjemedlemmar/collaborators access i GitHub för att skydda admin-delen.

### 2) Vad som går att ändra
I CMS finns tre sektioner:
- **Kontakt & öppettider** (`data/site-settings.json`)
- **Meny** (`data/menu.json`)
- **Aktuellt** (`data/events.json`)

### 3) Publicera
- Tryck **Publish** i CMS.
- Ändringen sparas i GitHub och visas på webbplatsen efter deploy.

## Teknisk översikt

- `admin/index.html` och `admin/config.yml`: CMS-admin och fältkonfiguration.
- `data/*.json`: innehållsfiler som CMS redigerar.
- `js/cms-content.js`: laddar innehåll från JSON och renderar meny/aktuellt/kontakt/öppettider.
