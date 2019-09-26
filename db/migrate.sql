CREATE TABLE IF NOT EXISTS users (
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(64) NOT NULL,
    birhtday DATE,
    UNIQUE(email)
);
CREATE TABLE IF NOT EXISTS reports (
    week INT NOT NULL,
    title VARCHAR(128) NOT NULL,
    report TEXT NOT NULL,
    UNIQUE(week)
);

INSERT INTO reports (week, title, report) VALUES
(1, "Kmom 01" "JS-Ramverk Me-Sida
Detta är min me-sida för kursen jsramverk skriven i VueJS.
Starta upp sidan
Börja med att installera node-modules via `npm install`, sedan kan du starta sidan med kommandot `npm run serve`. Då startar den upp en dev-server på port 8080 som standard (om porten är upptagen används 8081).
Versionshantering
För varje kursmoment som avklarats så publiceras en tagg (1.x för kmom01, 2.x för kmom02, osv...) "),
(2, "Registreringsformulär & Datepicker", "I detta kursmoment gjordes ett registreringsformulär för nya användare. Formuläret innehåller användarens namn, födelsedag, epost och lösenord. Formuläret kräver även att man godkänner att sidan sparar ens persondata, detta för att följa GDPR-lagstiftningen. För att mata in sin födelsedag så får man tre fält på en rad som är tydligt markerade för år, månad och dag. Maxlängden av tecken (fyra för år och två för månad och datum) Om Siffrorna är utanför maxlängden så går det inte att skriva fler siffror i fältet. Om siffrorna man har skrivit i är utanför värdegränserna (till exempel 1900-nuvarande år för födelseår) så blir fältet rödmarkerat. Jag fick inte min insperation från någon specifik sida utan kollade på många olika implementationer och kom fram till att jag ville ha ett fast datumformat utan tvetydigheter samtidigt som det ska vara lätt att validera. "),
(3, "Backend time!", "I detta kursmomentet har vi skrivit en backend. Det var roligt att sätta upp en server med");
