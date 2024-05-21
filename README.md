# Webtechnológiák 2
## Beadandó feladat, 2023/24/II
### Készítette
**Név:** Palencsár Enikő \
**Neptun kód:** YD11NL
### Feladat
Szótárfüzet alkalmazás. \
**Technológia:** Angular, Bootstrap, Node.js, Express, TypeORM, Chart.js, JWT \
**Adatbázis:** MongoDB \
**Dokumentáció:** [vocabulary.pdf](vocabulary.pdf) 
### Konfiguráció
#### Adatbázis
**Host és port:** localhost:27017 \
**Adatbázis neve:** vocabulary \
**Kollekciók:** practice, topic, user \
**Importálható:** [vocabulary.practice.json](vocabulary.practice.json), [vocabulary.topic.json](vocabulary.topic.json), [vocabulary.user.json](vocabulary.user.json) \
*A konfigurációs paraméterek megváltoztatása: [itt](vocabulary/server/src/data-source.ts).*
#### Alkalmazás
**Gyökérjegyzék:** [vocabulary](vocabulary) \
**Globális telepítés:** `npm install -g typescript ts-node ts-node-dev typeorm` \
**Függőségek telepítése:** `npm i` \
**Backend:** `npm run start:server` \
**Frontend:** `npm run start:client` \
**Bejelentkezési adatok** *(kollekciók importálása után)*:
* **Bejelentkezési név:** user1 vagy user2
* **Bejelentkezési jelszó:** password

