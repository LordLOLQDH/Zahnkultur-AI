# Zahnkultur AI

Die **Zahnkultur AI** ist ein digitaler Informationsassistent für **Zahnkultur by Dr. Joachim Kraus** in Korntal-Münchingen.

**Aktuelle Version: 2.2**

## Live

- Website: https://lordlolqdh.github.io/Zahnkultur-AI/
- Repository: https://github.com/LordLOLQDH/Zahnkultur-AI
- Offizielle Praxis-Website: https://www.zahnkultur-kraus.de/

## Was die Zahnkultur AI kann

### AI-Chat
- Beantwortet Fragen zur Praxis, zum Team, zu Leistungen, Technik und Sprechzeiten.
- Gibt allgemeine Informationen zu zahnmedizinischen Themen.
- Arbeitet aus Sicht der Praxis mit **Wir-Formulierungen**.
- Verwendet eine serverseitige KI-Anbindung.
- Entfernt störende Markdown-Formatierung aus sichtbaren Antworten.
- Behandelt medizinische Themen als allgemeine Information und ersetzt keine Untersuchung oder individuelle Diagnose.

### Schnellfragen
Direkt im Chat stehen Schnellfragen für:
- Leistungen
- Technologie
- Sprechzeiten
- Terminvereinbarung

### Wissensbasis
Die AI nutzt eine serverseitige Wissensbasis mit Informationen unter anderem zu:
- Praxis
- Team
- Leistungen
- Technologien
- Kontakt
- Öffnungszeiten
- Praxisgeschichte
- Philosophie
- Engagement

Die dynamische Wissensbasis liegt in Supabase und ist nicht öffentlich beschreibbar.

### Admin-Bereich
Der interne Bereich ist über `admin.html` erreichbar.

Funktionen:
- serverseitige Admin-Anmeldung
- zeitlich begrenztes signiertes Admin-Token
- Wissensbasis speichern
- Wissensbasis durchsuchen
- alle gespeicherten Informationen anzeigen
- Informationen löschen
- Admin-Modus beenden
- keine Admin-Geheimnisse im öffentlichen Frontend

Der Admin-Code wird nicht in HTML, CSS oder JavaScript gespeichert.

### Chat-Admin-Modus
Zusätzlich unterstützt der AI-Backend-Endpunkt den internen Admin-Modus. Die Befehle umfassen:
- `Speichern: ...`
- `Suchen: ...`
- `Alle anzeigen`
- `Löschen: ...`
- `/exit`

### PING und AI-TEST
- **PING** prüft die Erreichbarkeit und Konfiguration des Backends, ohne einen normalen KI-Aufruf auszuführen.
- **AI-TEST** führt einen echten Testaufruf an die KI aus.

### Ideenbox
Auf der Features-/Credits-Seite gibt es ein verpflichtendes Formular für:
- Name
- E-Mail-Adresse
- Nachricht / Idee

Der Browser sendet die Daten an die eigene Supabase Edge Function. Diese leitet die Nachricht serverseitig über Web3Forms an den konfigurierten Empfänger weiter.

Der Web3Forms-Schlüssel befindet sich ausschließlich als serverseitiges Secret und nicht im Repository.

### Bestätigungsseiten
Nach erfolgreicher Ideenübermittlung gibt es:
- `danke.html` als Bestätigungsseite
- `email-bestaetigung.html` als Darstellung der vorgesehenen Bestätigungs-E-Mail
- `404.html` als eigene Fehlerseite

Die `email-bestaetigung.html` ist eine Informations-/Darstellungsseite und verschickt selbst keine E-Mail.

## Design und Bedienung

- Mobile-first
- optimiert für Smartphone, Tablet und Desktop
- Zahnkultur-inspiriertes, ruhiges Design
- responsive Layouts
- reduzierte Oberfläche
- schnelle Navigation zwischen Chat, Features, Rechtlichem und Admin
- iPhone-Safari-Eingabe ohne unerwünschten automatischen Zoom
- Unterstützung für reduzierte Animationen
- Cache-Busting für neue Frontend-Versionen
- lokale Speicherung nur für technisch notwendige Sitzungs- und Anzeigezustände

## Logo und Icons

Die Website verwendet:
- `IMG_3609.png` als Hauptlogo
- `favicon.ico`
- `favicon-16x16.png`
- `favicon-32x32.png`
- `apple-touch-icon.png`
- `android-chrome-192x192.png`
- `android-chrome-512x512.png`
- `site.webmanifest`

Die Favicon-Dateien werden auf den HTML-Seiten eingebunden und das Manifest unterstützt die installierbare Darstellung.

**Hinweis:** Damit das neue Hauptlogo live geladen werden kann, muss `IMG_3609.png` im Repository vorhanden sein.

## Seiten

| Datei | Zweck |
|---|---|
| `index.html` | AI-Chat |
| `features.html` | Features, Credits und Ideenbox |
| `impressum.html` | rechtliche Anbieterinformationen |
| `datenschutz.html` | Datenschutzinformationen |
| `danke.html` | Bestätigung nach Ideenübermittlung |
| `email-bestaetigung.html` | Darstellung der vorgesehenen Bestätigungs-E-Mail |
| `404.html` | eigene Fehlerseite |
| `admin.html` | interner Admin-Bereich |
| `style.css` | gesamtes Frontend-Design |
| `app.js` | Chat- und Frontend-Logik |
| `cookie.js` | lokaler Hinweis zur Speicherung |
| `site.webmanifest` | PWA-/Installationsmetadaten |

## Backend

Technischer Aufbau:

```
GitHub Pages
    ↓
Zahnkultur AI Frontend
    ↓
Supabase Edge Function
    ├── KI-Dienst
    ├── Supabase-Wissensbasis
    └── Web3Forms für Ideenbox
```

Supabase-Projekt:
`eopvkwhcgznvubesaszv`

Edge Functions:
- `zahnkultur-ai`
- `zahnkultur-contact`

Secrets bleiben serverseitig.

## Sicherheit

- Keine KI-API-Schlüssel im öffentlichen Frontend.
- Keine Web3Forms-Access-Keys im öffentlichen Frontend.
- Keine Supabase-Service-Role-Keys im Repository.
- Admin-Code wird serverseitig geprüft.
- Admin-Sitzungen verwenden ein zeitlich begrenztes Token.
- Admin-Seite ist mit `noindex,nofollow` versehen.
- CORS für die relevanten Edge-Function-Aufrufe ist auf die GitHub-Pages-Origin beschränkt.

## Datenschutz

Die AI verwendet keine optionalen Analytics- oder Werbe-Cookies.

Technisch notwendige Daten können unter anderem durch Hosting, Backend und KI-Anbindung verarbeitet werden. Chatnachrichten werden an die serverseitige Supabase-Funktion übertragen und können dort an den konfigurierten KI-Dienst weitergegeben werden.

Das Ideenformular verwendet Web3Forms als serverseitigen Übermittlungsdienst.

Die verbindlichen rechtlichen Angaben der Praxis sind auf der offiziellen Zahnkultur-Website maßgeblich.

## Medizinischer Hinweis

Die Zahnkultur AI ist ein Informationsassistent. Sie ersetzt keine persönliche zahnärztliche Untersuchung, Diagnose oder Therapieentscheidung.

Bei akuten Beschwerden soll die Praxis kontaktiert werden. In medizinischen Notfällen gilt die zuständige Notfallversorgung bzw. 112.

## Entwicklung

Die Anwendung wurde für Zahnkultur by Dr. Joachim Kraus konzipiert und technisch weiterentwickelt.

Technische KI-Unterstützung wurde unter anderem für Konzeption, Programmierung, Fehleranalyse und Weiterentwicklung eingesetzt.

## Backups

Vor größeren Änderungen werden stabile Backup-Branches angelegt.

Aktueller Backup-Stand vor der Logo-/Asset-Überarbeitung:
`backup/v2.1-before-logo-assets`

## Versionsgeschichte

### 2.2
- Hauptlogo `IMG_3609.png` in das Frontend eingebunden
- Favicons und Apple-Touch-Icon auf allen Seiten eingebunden
- Web-App-Manifest aktualisiert
- doppelte Header-Logo-Struktur auf Impressum und Datenschutz entfernt
- Überschrift der Datenschutzseite kompakter gestaltet
- Header-Struktur auf allen Seiten statisch geprüft
- Asset- und Version-Referenzen geprüft

### 2.1
- Impressum und Datenschutz als eigene Seiten
- Cookie-/Speicherhinweise
- Features- und Credits-Seite
- Ideenbox mit serverseitiger Web3Forms-Anbindung
- Danke-Seite
- Bestätigungsseite
- eigene 404-Seite
- Admin-Bereich
- dynamische Wissensbasis
- PING und AI-TEST
- verbesserte mobile Darstellung
- Sicherheitsverbesserungen

## Lizenz / Nutzung

Dieses Repository enthält eine individuell für Zahnkultur entwickelte Anwendung. Die Verwendung, Veröffentlichung oder Weitergabe der Inhalte und des Quellcodes sollte mit dem Betreiber der Anwendung abgestimmt werden.
