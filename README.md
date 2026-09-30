# Zahnkultur AI

Digitaler KI-Assistent für Zahnkultur by Dr. Joachim Kraus in Korntal-Münchingen.

## Version
1.0

## Funktionen
- Chat-Assistent für Praxisinformationen
- Wissensbasis zu Praxis, Team, Leistungen, Technik, Kontakt und Sprechzeiten
- Allgemeine Orientierung zu zahnmedizinischen Themen
- Sicherheitsregeln für medizinische Antworten
- Keine Ferndiagnosen und keine individuellen Therapieanweisungen
- Quick-Buttons für häufige Fragen
- Responsive Oberfläche für Smartphone, Tablet und PC
- Manuelles Aktualisieren mit Cache-Busting
- Admin-Modus nach dem gleichen Grundprinzip wie KDS AI
- Admin-Befehle: Speichern, Suchen, Alle anzeigen, Löschen, /exit
- Dynamische Wissensbasis in Supabase
- Keine Kontakt-/Nachrichtenversendung durch die AI
- Keine API-Schlüssel im öffentlichen Frontend

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

## Admin
Der interne Admin-Modus verwendet einen serverseitig signierten, zeitlich begrenzten Token. Die Wissensdatenbank ist für anon und authenticated gesperrt und wird ausschließlich von der Edge Function verwaltet.

## GitHub Pages
Repository:
https://github.com/LordLOLQDH/Zahnkultur-AI

Vorgesehene Pages-Adresse:
https://lordlolqdh.github.io/Zahnkultur-AI/