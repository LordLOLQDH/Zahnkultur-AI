# Zahnkultur AI

Digitaler KI-Assistent für Zahnkultur by Dr. Joachim Kraus in Korntal-Münchingen.

## Version
**1.4**

## Notfall-Backup
Die stabile Version 1.3 ist im Branch `backup/v1.3-stable-emergency` gesichert.

## Neue Funktionen in 1.4
- Konsequente Wir-Form
- Smoother Animationen und Ladezustände
- Schutz vor Markdown-Ausgabe
- Antwort kopieren
- Online-/Offline-Status
- Neuigkeiten-Popup und separate Feature-/Credits-Seite
- Tastenkürzel Ctrl/Cmd+K für das Eingabefeld und Escape zum Schließen des Menüs
- Schutz vor doppeltem Absenden während einer laufenden Anfrage

## Design
Die Oberfläche ist jetzt an das von Zahnkultur vorgegebene Erscheinungsbild angepasst:
- blau-grauer Header
- MENU-Navigation
- große Hero-Bühne mit „HEUTE SCHON ZUKUNFT!“
- rote CTA-Fläche
- schwarzer Kontaktbereich
- helle Zahnkultur-Farbwelt
- mobile-first Darstellung
- AI als schwebender Chat statt als fremde separate App-Oberfläche

## Funktionen
- Chat-Assistent für Praxisinformationen
- Wissensbasis zu Praxis, Team, Leistungen, Technik, Kontakt und Sprechzeiten
- Allgemeine Orientierung zu zahnmedizinischen Themen
- Keine Ferndiagnosen und keine individuellen Therapieanweisungen
- Quick-Buttons für häufige Fragen
- Responsive Oberfläche für Smartphone, Tablet und PC
- Manuelles Aktualisieren mit Cache-Busting
- Admin-Modus nach dem gleichen Grundprinzip wie KDS AI
- Admin-Befehle: Speichern, Suchen, Alle anzeigen, Löschen, /exit
- Dynamische Wissensbasis in Supabase
- Keine Kontakt-/Nachrichtenversendung durch die AI
- Keine API-Schlüssel im öffentlichen Frontend

## Ping und AI-Test

**PING** prüft nur den Supabase-Backend-Endpunkt und die KI-Konfiguration. Dabei wird **kein KI-Aufruf** durchgeführt.

**AI-TEST** führt einen kleinen echten KI-Funktionstest mit einer festen Testfrage aus. Damit lässt sich getrennt prüfen, ob der konfigurierte KI-Anbieter tatsächlich antwortet.

## Praxiswissen
Die festen Informationen wurden aus der öffentlich zugänglichen Website von Zahnkultur by Dr. Joachim Kraus aufgebaut:
https://www.zahnkultur-kraus.de/

## Technik
GitHub Pages → Zahnkultur AI Frontend → Supabase Edge Function → KI-Anbieter + Supabase-Wissensbasis.

Supabase-Projekt: eopvkwhcgznvubesaszv  
Edge Function: zahnkultur-ai

Secrets bleiben serverseitig.

## Medizinischer Hinweis
Der Assistent ist ein Informationssystem und ersetzt keine zahnärztliche Untersuchung. Bei akuten Beschwerden soll die Praxis kontaktiert werden. Bei medizinischen Notfällen gilt 112 bzw. die zuständige Notfallversorgung.

## GitHub Pages
Repository:
https://github.com/LordLOLQDH/Zahnkultur-AI

Vorgesehene Pages-Adresse:
https://lordlolqdh.github.io/Zahnkultur-AI/
