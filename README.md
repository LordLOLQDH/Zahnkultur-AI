# Zahnkultur AI

Digitaler KI-Assistent für Zahnkultur by Dr. Joachim Kraus in Korntal-Münchingen.

## Version
**1.9**

## Notfall-Backups
- Aktueller Stand vor dem 1.9-Umbau: `backup/v1.4-stable-before-legal-cookie-contact`
- Frühere stabile Version: `backup/v1.3-stable-emergency`

## Neu in 1.9
- Impressum und Datenschutzerklärung als eigene erreichbare Seiten
- Cookie-Banner auf AI, Features und Rechtsseiten
- Direkter Link zur normalen Zahnkultur-Website
- Übersichtlichere Features- und Credits-Seite
- Eigener Abschnitt für Adam Gabriel Kraus mit Kontaktdaten
- Praxis-Kontakt separat von den persönlichen Entwickler-Credits
- Ideenbox auf der Features-Seite
- Ideen werden über die vorhandene Supabase-Mailfunktion an `adam_kraus@icloud.com` weitergeleitet
- Praxiswissen in Supabase erweitert
- Mobile Eingabe gegen unerwarteten iOS-Zoom abgesichert
- Timeout und robustere Fehlerbehandlung für Chat-Anfragen
- Version auf 1.9 aktualisiert

## Funktionen
- Chat-Assistent für Praxisinformationen
- Wissensbasis zu Praxis, Team, Leistungen, Technik, Kontakt, Sprechzeiten, Philosophie, Geschichte und Engagement
- Allgemeine Orientierung zu zahnmedizinischen Themen
- Keine Ferndiagnosen und keine individuellen Therapieanweisungen
- Quick-Buttons für häufige Fragen
- Responsive Oberfläche für Smartphone, Tablet und PC
- Manuelles Aktualisieren mit Cache-Busting
- Geschützter Admin-Modus
- Admin-Befehle: Speichern, Suchen, Alle anzeigen, Löschen, /exit
- Dynamische Wissensbasis in Supabase
- Markdown-Bereinigung für sichtbare AI-Antworten
- Keine API-Schlüssel im öffentlichen Frontend

## Rechtliches
Die AI enthält eigene erreichbare Seiten für Impressum und Datenschutz. Die vollständigen offiziellen Rechtstexte der Praxis bleiben auf der offiziellen Website maßgeblich.

## Cookie-Banner
Die AI verwendet nur technisch notwendige lokale Speicherung für Einstellungen und Sitzungszustände. Es wird auf der AI-Seite kein Analytics-Dienst eingebunden.

## PING und AI-TEST
**PING** prüft den Supabase-Backend-Endpunkt und die KI-Konfiguration ohne KI-Aufruf.

**AI-TEST** führt einen kleinen echten KI-Funktionstest mit einer festen Testfrage aus.

## Ideenbox
Auf der Features-/Credits-Seite können Verbesserungsideen eingegeben werden. Die Nachricht wird über die vorhandene serverseitige Mailfunktion an Adam Gabriel Kraus weitergeleitet.

## Praxiswissen
Die festen Informationen wurden aus der öffentlich zugänglichen Website von Zahnkultur by Dr. Joachim Kraus aufgebaut.

## Technik
GitHub Pages → Zahnkultur AI Frontend → Supabase Edge Function → KI-Anbieter + Supabase-Wissensbasis.

Supabase-Projekt: `eopvkwhcgznvubesaszv`
Edge Function: `zahnkultur-ai`
E-Mail-Funktion: `kds-contact-email`

Secrets bleiben serverseitig.

## Medizinischer Hinweis
Der Assistent ist ein Informationssystem und ersetzt keine zahnärztliche Untersuchung. Bei akuten Beschwerden soll die Praxis kontaktiert werden. Bei medizinischen Notfällen gilt 112 bzw. die zuständige Notfallversorgung.

## Links
Offizielle Praxis-Website: https://www.zahnkultur-kraus.de/
Repository: https://github.com/LordLOLQDH/Zahnkultur-AI
GitHub Pages: https://lordlolqdh.github.io/Zahnkultur-AI/
