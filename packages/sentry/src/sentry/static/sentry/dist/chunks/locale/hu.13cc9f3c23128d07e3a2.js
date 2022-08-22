(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([["locale/hu"],{

/***/ "../node_modules/moment/locale/hu.js":
/*!*******************************************!*\
  !*** ../node_modules/moment/locale/hu.js ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

//! moment.js locale configuration
//! locale : Hungarian [hu]
//! author : Adam Brunner : https://github.com/adambrunner
//! author : Peter Viszt  : https://github.com/passatgt

;(function (global, factory) {
    true ? factory(__webpack_require__(/*! ../moment */ "../node_modules/moment/moment.js")) :
   0
}(this, (function (moment) { 'use strict';

    //! moment.js locale configuration

    var weekEndings =
        'vasárnap hétfőn kedden szerdán csütörtökön pénteken szombaton'.split(' ');
    function translate(number, withoutSuffix, key, isFuture) {
        var num = number;
        switch (key) {
            case 's':
                return isFuture || withoutSuffix
                    ? 'néhány másodperc'
                    : 'néhány másodperce';
            case 'ss':
                return num + (isFuture || withoutSuffix)
                    ? ' másodperc'
                    : ' másodperce';
            case 'm':
                return 'egy' + (isFuture || withoutSuffix ? ' perc' : ' perce');
            case 'mm':
                return num + (isFuture || withoutSuffix ? ' perc' : ' perce');
            case 'h':
                return 'egy' + (isFuture || withoutSuffix ? ' óra' : ' órája');
            case 'hh':
                return num + (isFuture || withoutSuffix ? ' óra' : ' órája');
            case 'd':
                return 'egy' + (isFuture || withoutSuffix ? ' nap' : ' napja');
            case 'dd':
                return num + (isFuture || withoutSuffix ? ' nap' : ' napja');
            case 'M':
                return 'egy' + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
            case 'MM':
                return num + (isFuture || withoutSuffix ? ' hónap' : ' hónapja');
            case 'y':
                return 'egy' + (isFuture || withoutSuffix ? ' év' : ' éve');
            case 'yy':
                return num + (isFuture || withoutSuffix ? ' év' : ' éve');
        }
        return '';
    }
    function week(isFuture) {
        return (
            (isFuture ? '' : '[múlt] ') +
            '[' +
            weekEndings[this.day()] +
            '] LT[-kor]'
        );
    }

    var hu = moment.defineLocale('hu', {
        months: 'január_február_március_április_május_június_július_augusztus_szeptember_október_november_december'.split(
            '_'
        ),
        monthsShort:
            'jan._feb._márc._ápr._máj._jún._júl._aug._szept._okt._nov._dec.'.split(
                '_'
            ),
        monthsParseExact: true,
        weekdays: 'vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat'.split('_'),
        weekdaysShort: 'vas_hét_kedd_sze_csüt_pén_szo'.split('_'),
        weekdaysMin: 'v_h_k_sze_cs_p_szo'.split('_'),
        longDateFormat: {
            LT: 'H:mm',
            LTS: 'H:mm:ss',
            L: 'YYYY.MM.DD.',
            LL: 'YYYY. MMMM D.',
            LLL: 'YYYY. MMMM D. H:mm',
            LLLL: 'YYYY. MMMM D., dddd H:mm',
        },
        meridiemParse: /de|du/i,
        isPM: function (input) {
            return input.charAt(1).toLowerCase() === 'u';
        },
        meridiem: function (hours, minutes, isLower) {
            if (hours < 12) {
                return isLower === true ? 'de' : 'DE';
            } else {
                return isLower === true ? 'du' : 'DU';
            }
        },
        calendar: {
            sameDay: '[ma] LT[-kor]',
            nextDay: '[holnap] LT[-kor]',
            nextWeek: function () {
                return week.call(this, true);
            },
            lastDay: '[tegnap] LT[-kor]',
            lastWeek: function () {
                return week.call(this, false);
            },
            sameElse: 'L',
        },
        relativeTime: {
            future: '%s múlva',
            past: '%s',
            s: translate,
            ss: translate,
            m: translate,
            mm: translate,
            h: translate,
            hh: translate,
            d: translate,
            dd: translate,
            M: translate,
            MM: translate,
            y: translate,
            yy: translate,
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: '%d.',
        week: {
            dow: 1, // Monday is the first day of the week.
            doy: 4, // The week that contains Jan 4th is the first week of the year.
        },
    });

    return hu;

})));


/***/ }),

/***/ "../src/sentry/locale/hu/LC_MESSAGES/django.po":
/*!*****************************************************!*\
  !*** ../src/sentry/locale/hu/LC_MESSAGES/django.po ***!
  \*****************************************************/
/***/ ((module) => {

module.exports = {"Username":["Felhasználói név"],"Permissions":["Jogosultságok"],"Info":["Infó"],"Remove":["Eltávolít"],"Configure":["Beállítás"],"Continue":["Folytatás"],"Priority":["Prioritás"],"Last Seen":["Utolsó előfordulás"],"First Seen":["Első megjelenés"],"Frequency":["Gyakoriság"],"Score":["Pont"],"Name":["Neve"],"URL":["URL"],"Project":["Projekt"],"Active":["Aktív"],"Unresolved":["Megoldatlan"],"Resolved":["Megoldva"],"error":["hiba"],"Events":["Események"],"Users":["Felhasználók"],"name":["név"],"user":["felhasználó"],"Page Not Found":["Lap Nem Található"],"The page you are looking for was not found.":["A keresett lap nem található."],"Cancel":["Mégse"],"Confirm Password":["Jelszó jóváhagyása"],"Lost your password?":["Elfelejtetted a jelszavad?"],"Sign out":["Kilépés"],"Submit":["Elküldés"],"Next":["Következő"],"Sign in to continue":["Jelentkezzen be a folytatáshoz"],"Register":["Regisztráció"],"Privacy Policy":["Adatvédelmi irányelvek"],"Organization ID":["Szervezeti azonosító"],"Approve":["Jóváhagy"],"Deny":["Megtagad"],"Auth":["Autentikáció"],"Save Changes":["Módosítások mentése"],"Method":["Metódus"],"Query":["Lekérés"],"Fragment":["Töredék"],"ID:":["ID:"],"Username:":["Felhasználó név:"],"Create Issue":["Probléma létrehozása"],"Link Issue":["Probléma linkelése"],"Restore Organization":["Szervezet visszaállítása"],"Deletion Scheduled":["Ütemezett törlés"],"Two-Factor Authentication":["Kétlépcsős hitelesítés"],"never":["soha"],"1 day":["1 napja"],"Account":["Felhasználó"],"username or email":["felhasználói név vagy e-mail cím"],"Password":["Jelszó"],"password":["jelszó"],"Email":["E-mail"],"Close":["Bezárás"],"Default Role":["Alapértelmezett jogkör"],"Saving changes...":["Változások mentése ..."],"Unable to add repository.":["Nem lehet tárolót hozzáadni."],"Unable to delete repository.":["Nem lehet törölni a tárolót."],"Enabling...":["Engedélyezés..."],"Plugin was enabled":["A bővítmény engedélyezve van"],"Unable to enable plugin":["Nem lehet engedélyezni a bővítményt"],"Disabling...":["Letiltás..."],"Plugin was disabled":["A bővítmény le van tiltva"],"Unable to disable plugin":["Nem lehet letiltani a bővítményt"],"[project] was successfully removed":["[project] sikeresen eltávolítva"],"Error removing [project]":["Hiba a [projekt] eltávolításakor"],"This feature is coming soon!":["Ez a funkció hamarosan elérhető lesz!"],"Enables the %s feature":["%s funkció engedélyezése"],"Help":["Súgó"],"from now":["mostantól"],"Change status to unresolved":["Az állapot megváltoztatása megoldatlanra"],"Unresolve":["Nincs megoldva"],"Set up release tracking in order to use this feature.":["Állítsd be a kiadás követést ehhez a funkció eléréséhez."],"Resolved In":["Megoldott"],"The next release":["A következő verzió"],"The current release":["Az aktuális verzió"],"The current release (%s)":["Az aktuális verzió (%s)"],"Resolve":["Megoldva"],"Edit":["Szerkesztés"],"Are you sure you wish to delete this comment?":["Biztosan szeretnéd törölni ezt a megjegyzést?"],"Save Comment":["Megjegyzés mentése"],"Post Comment":["Megjegyzés elküldése"],"Unable to post comment":["Nem lehet megjegyzést küldeni"],"Write":["Írás"],"Preview":["Előnézet"],"Markdown supported":["Markdonw szintakszis engedélyezett"],"Undo":["Visszavonás"],"Teams":["Csapatok"],"Filter teams and people":["Csapatok és emberek szűrése"],"Clear Assignee":["Hozzárendelés törlése"],"Invite Member":["Tagok meghívása"],"Assigned to [name]":["[name]-hoz rendelve"],"Projects":["Projektek"],"Issues":["Problémák"],"Releases":["Verziók"],"Discover":["Felfedez"],"Issue":["Probléma"],"Details":["Részletek"],"Exception":["Kivétel"],"Tags":["Címkék"],"Breadcrumbs":["Morzsák"],"Release":["Kiadás"],"Dismiss":["Elvetés"],"You are not authorized to access this resource.":["Nincs jogosultsága ehhez az erőforráshoz."],"Successfully saved avatar preferences":["Sikeresen menetette az avatar beállításokat"],"Save Avatar":["Avatar mentése"],"Change Photo":["Fotó megváltoztatása"],"Success!":["Siker!"],"Unable to save changes. Please try again.":["Nem sikerült menteni a módosításokat. Kérjük próbálja újra."],"An error occurred.":["Hiba történt."],"Previous":["Előző"],"Show More":["Több mutatása"],"Collapse":["Összecsuk"],"No message provided":["Nincs üzenet"],"Unknown author":["Ismeretlen szerző"],"Confirm":["Jóváhagyás"],"All Projects":["Összes projekt"],"e.g. 100":["pl. 100"],"Time window":["Idő ablak"],"e.g. per hour":["pl. per óra"],"Date":["Dátum"],"Time (UTC)":["Idő (UTC)"],"Created":["Létrehozva"],"Version":["Verziók"],"e.g. 1.0.4":["pl. 1.0.4"],"Sort by":["Rendezés"],"Documentation":["Dokumentáció"],"No results found":["Nincs találat"],"Description":["Leírás"],"Filter":["Szűrő"],"No items":["Nincs elem"],"Filter search":["Szűrési feltétel"],"found":["találat"],"There was a problem rendering this component":["Hiba történt az összetevő megjelenítésében"],"Or see your sample event":["Vagy tekintse meg a minta eseményt"],"Create a sample event":["Hozzon létre egy minta eseményt"],"Waiting for events…":["Várakozás eseményekre.."],"Installation Instructions":["Telepítési útmutatók"],"Retry":["Újra"],"Fill out a report":["Töltse ki a jelentést"],"Service status":["Szolgáltatás állapota"],"Contact support":["Kapcsolatfelvétel"],"The events have been deleted":["Az eseményeket törölték"],"ID":["ID"],"Device":["Eszköz"],"User":["Felhasználó"],"Language":["Nyelv"],"Status":["Állapot"],"Unknown Browser":["Ismeretlen böngésző"],"Unknown Runtime":["Ismeretlen futási környezet"],"Unknown Device":["Ismeretlen eszköz"],"Arch:":["Architektúra"],"Model:":["Modell:"],"Version:":["Verzió:"],"Unknown GPU":["Ismeretlen GPU"],"Unknown":["Ismeretlen"],"Unknown OS":["Ismeretlen operációs rendszer"],"Kernel:":["Kernel:"],"Unknown User":["Ismeretlen felhasználó"],"Expand":["Kinyit"],"Hide":["Elrejtés"],"Show":["Megjelenítés"],"Delete":["Törlés"],"Download":["Letöltés"],"Size":["Méret"],"Actions":["Műveletek"],"Show less":["Kevesebb mutatása"],"Show more":["Több mutatása"],"Snooze":["Elrejtés"],"Raw":["Nyers"],"Formatted":["Formázott"],"There was an error rendering this data.":["Hiba történt az adatok megjelenítésekor."],"Latest Event Not Available":["Legutóbbi esemény nem érhető el"],"Additional Data":["További adat"],"SDK":["SDK"],"Type":["Típus"],"Warning":["Figyelmeztetés"],"Time":["Idő"],"System":["Rendszer"],"Default":["Alapértelmezett"],"code":["forráskód"],"Full":["Teljes"],"Original":["Eredeti"],"App Only":["Csak alkalmazás"],"Report":["Riport"],"CSP Report":["CSP Riport"],"Debug ID":["Hibakeresési azonosító"],"Path":["Útvonal"],"Source Map":["Forrás térkép"],"Hexadecimal":["Hexadecimális"],"Numeric":["Szám"],"Message":["Üzenet"],"Query String":["Lekérdezés szövege"],"Cookies":["Sütik"],"Headers":["Fejlécek"],"Environment":["Környezet"],"Body":["Törzs"],"Template":["Sablon"],"Label":["Címke"],"Other":["Egyéb"],"Packages":["Csomagok"],"View event":["Esemény megtekintése"],"API":["API"],"Docs":["Dokumentumok"],"Contribute":["Hozzájárul"],"%s is not a member of project":["%s nem tagja a projektnek"],"Add %s to project":["%s hozzáadása a projekthez"],"You do not have permission to add team to project.":["Nincs jogosultsága hozzáadni a csapatot a projekthez."],"Create":["Létrehoz"],"ago":["óta"],"old":["régi"],"First seen":["Először megtekintve"],"Last seen":["Utoljára megtekintve"],"Last 24 Hours":["Elmúlt 24 óra"],"Last 30 Days":["Elmúlt 30 nap"],"No tags found":["Nincsenek címkék"],"View more":["Továbbiak megjelenítése"],"Learn more":["Tudj meg többet"],"Click to assign":["Kattintson a hozzárendeléshez"],"Nothing to show here, move along.":["Nincs itt semmi látnivaló, menj tovább."],"events":["események"],"Unknown Author":["Ismeretlen szerző"],"Save":["Mentés"],"Create Team":["Csapat létrehozása"],"Back":["Vissza"],"Update":["Frissítés"],"Done":["Kész"],"Role":["Szerep"],"Skip this step":["Lépés kihagyása"],"Add a Phone Number":["Telefonszám hozzáadása"],"Continue to %s":["Folytassa %s"],"Incorrect password":["Hibás jelszó"],"Confirm Password to Continue":["Jelszó megerősítése a folytatáshoz"],"Email Address":["E-mail cím"],"Oldest":["Legrégebbi"],"Older":["Régebbi"],"Newer":["Újabb"],"Newest":["Legújabb"],"You do not have permission to join a team.":["Nincs jogosultsága csapathoz való csatlakozásra"],"Join a Team":["Csatlakozás a csapathoz"],"Create a project":["Projekt létrehozása"],"Filter projects":["Projektek szűrése"],"Use UTC":["UTC használata"],"All":["Mind"],"Test Plugin":["Teszt bővítmény"],"Disable":["Letilt"],"Test Complete!":["Teszt kész!"],"Request Access":["Hozzáférés kérése"],"Join Team":["Csatlakozás a csapathoz"],"Request Pending":["Kérés függőben van"],"Event":["Esemény"],"%s Dashboard":["%s Irányítópult"],"Organization Dashboard":["Szervezeti irányítópult"],"%s Settings":["%s Beállítások"],"Organization Settings":["Szervezet beállítások"],"Project Settings":["Projekt beállítások"],"Project Details":["Projekt adatai"],"What's new":["Újdonság"],"What's new in Sentry":["Újdonságok a Sentryben"],"User Feedback":["Felhasználói visszajelzés"],"Activity":["Tevékenység"],"Stats":["Statisztikák"],"Settings":["Beállítások"],"Organization settings":["Szervezet beállítások"],"Members":["Tagok"],"User settings":["Felhasználói beállítások"],"API keys":["API kulcs"],"Admin":["Admin"],"Create a new organization":["Hozzon létre egy új szervezetet"],"Read More":["Olvass tovább"],"Similar":["Hasonló"],"Not Similar":["Nem hasonló"],"last event from [ago]":["utolsó esemény [ago]"],"Show details":["Mutasd a részleteket"],"n/a":["Nem elérhető"],"No recent data.":["Nincs újabb adat."],"Support":["Támogatás"],"Error: ":["Hiba:"],"Try Again":["Próbáld újra"],"New Issues":["Új problémák"],"by ":["által"],"authors":["szerzők"],"author":["szerző"],"Last 24 hours":["Legutóbbi 24 óra"],"Unknown error. Please try again.":["Ismeretlen hiba. Kérlek próbáld meg később."],"Always":["Mindig"],"Never":["Soha"],"Weekly Reports":["Heti jelentések"],"My Activity":["Saját tevékenység"],"Use a 24-hour clock":["24 órás óra használata"],"Use default ignored sources":["Használja az alapértelmezett figyelmen kívül hagyott forrásokat"],"Additional ignored sources":["További figyelmen kívül hagyott források"],"Custom Filters":["Egyéni szűrők"],"IP Addresses":["IP-címek"],"Error Message":["Hiba üzenet"],"General":["Általános"],"Open Membership":["Nyílt tagsági"],"Security & Privacy":["Biztonság és adatvédelem"],"e.g. business-email":["pl. üzleti e-mail"],"Prevent Storing of IP Addresses":["Megakadályozza az IP címek elmentését"],"Require Two-Factor Authentication":["Kétlépcsős hitelesítés szükséges"],"Allow Shared Issues":["Probléma megosztás engedélyezése"],"Subject Template":["Tárgy sablon"],"https://example.com or example.com":["https://example.com vagy example.com"],"Allowed Domains":["Engedélyezett domének"],"Enable JavaScript source fetching":["Engedélyezze a JavaScript források letöltését"],"Security Token":["Biztonsági token"],"X-Sentry-Token":["X-Sentry-Token"],"Security Token Header":["Biztonsági token fejléc"],"my-service-name":["saját-szolgáltatás-neve"],"Subject Prefix":["Tárgy előtag"],"e.g. [my-org]":["pl. [my-org]"],"Auto Resolve":["Automatikus megoldás"],"Disabled":["Tiltva"],"email":["e-mail"],"business-email":["üzleti e-mail"],"Popular":["Népszerű"],"Browser":["Böngésző"],"Server":["Szerver"],"Mobile":["Mobil"],"Desktop":["Asztal"],"New Alert Rule":["Új riasztási szabály"],"Buffer":["Puffer"],"Organizations":["Szervezetek"],"Queue":["Sor"],"Mail":["Üzenet"],"Organization":["Szervezet"],"Notifications":["Értesítések"],"Emails":["e-mailek"],"Security":["Biztonság"],"Session History":["Munkamenet előzmények"],"Subscriptions":["Feliratkozások"],"Identities":["Identitás"],"Auth Tokens":["Authentikációs tokenek"],"Create New Token":["Új token létrehozása"],"Applications":["Alkalmazások"],"Close Account":["Fiók lezárása"],"Environments":["Környezetek"],"Release Tracking":["Verzió követés"],"Issue Owners":["Probléma tulajdonosok"],"Inbound Filters":["Bejövő szűrők"],"Client Keys":["Kliens kulcsok"],"Security Headers":["Biztonsági fejlécek"],"Content Security Policy":["Tartalombiztonsági politika"],"Certificate Transparency":["Tanúsítvány-átláthatóság"],"Configuration":["Beállítások"],"API Key":["API kulkcs"],"Audit Log":["Napló"],"Repositories":["Tárolók"],"Team":["Csapat"],"Integrations":["Integrációk"],"Developer Settings":["Fejlesztői beállítások"],"Create a new account":["Új felhasználó létrehozása"],"Transfer Project":["Projekt átvitele"],"Server Version":["Kiszolgáló verzió"],"Python Version":["Python verzió"],"Configuration File":["Beállítási fájl"],"Uptime":["üzemidő"],"SMTP Settings":["SMTP beállítások"],"From Address":["Feladó címe"],"Host":["Kiszolgáló"],"not set":["nincs beállítáva"],"No":["Nem"],"Yes":["Igen"],"Test Settings":["Beállítások tesztelése"],"Accepted":["Elfogadva"],"System Overview":["Rendszer áttekintése"],"Event Throughput":["Esemény átvitele"],"API Responses":["API válaszok"],"Extensions":["Kiterjesztések"],"Modules":["Modulok"],"Disable the account.":["Fiók letiltása."],"Remove User":["Felhasználó eltávolítása"],"Superuser":["Rendszergazda"],"Setup Sentry":["Sentry beállítása"],"Welcome to Sentry":["Üdvözöllek a Sentry -ben"],"Email From":["E-mail feladó"],"SMTP Host":["SMTP kiszolgáló"],"SMTP Port":["SMTP port"],"SMTP Username":["SMTP felhasználói név"],"SMTP Password":["SMTP jelszó"],"Outbound email":["Kimenő e-mail"],"Authentication":["Hitelesítés"],"5 minutes":["5 perc"],"10 minutes":["10 perc"],"30 minutes":["30 perce"],"1 hour":["1 óra"],"2 hours":["2 órája"],"24 hours":["24 órára"],"Updated alert rule":["Riasztási szabály frissítve"],"Created alert rule":["Riasztási szabály létrehozva"],"Field is required":["Kötelező mező"],"Save Rule":["Szabály mentése"],"None":["Egyik sem"],"Member":["Tag"],"60 minutes":["60 perc"],"3 hours":["3 óra"],"12 hours":["12 óra"],"1 week":["1 hét"],"30 days":["30 napja"],"My Rule Name":["Szabályom neve"],"all":["mind"],"any":["bármelyik"],"none":["egyik sem"],"Apply Changes":["Módosítások érvényesítése"],"Alert Rules":["Riasztási szabályok"],"History":["Előtörténet"],"Filters":["Szűrők"],"Edit Rule":["Szabály szerkesztése"],"Sessions":["Munkamenetek"],"Login":["Belépés"],"Table":["Táblázat"],"Limit":["Korlátozás"],"Select an organization":["Válasszon ki egy szervezetet"],"Select a project":["Válassz projektet"],"Merge Selected Issues":["A kiválasztott problémák egyesítése"],"Merge":["Egyesít"],"Add to Bookmarks":["Könyvjelzőkhöz adás"],"Remove from Bookmarks":["Eltávolítás a könyvjelzőkből"],"Set status to: Unresolved":["Státusz beállítása: Megoldatlan"],"Delete Issues":["Problémák törlése"],"Graph:":["Grafikon:"],"24h":["24 óra"],"This action cannot be undone.":["Ezt a műveletet nem lehet visszavonni."],"Save Current Search":["Jelenlegi keresés mentése"],"Saved Searches":["Mentett keresések"],"Custom Search":["Egyéni keresés"],"Tag":["Címke"],"Text":["Szöveg"],"Pause":["Szünet"],"Enable":["Engedélyezés"],"Create Project":["Projekt létrehozása"],"a group":["egy csoport"],"Create Organization":["Szervezet létrehozása"],"Create a New Organization":["Új szervezet létrehozása"],"Organization Name":["Szervezet neve"],"e.g. My Company":["pl. Cégem"],"Error sharing":["Hiba megosztása"],"Bookmark":["Könyvjelző"],"Subscribe":["Iratkozz fel"],"Removing comment...":["Megjegyzés eltávolítása ..."],"Failed to delete comment":["A megjegyzés törlése nem sikerült"],"Sorry, no events match your search query.":["Sajnálom, nincsen a keresési feltételeknek megfelelő esemény."],"There don't seem to be any events yet.":["Nincs egy esemény sem jelenleg."],"Unmerge":["Egyesítés megszüntetése"],"Compare":["Összehasonlítás"],"Expand All":["Mindent kinyit"],"Collapse All":["Mindet összecsuk"],"Are you sure you want to merge these issues?":["Biztos benne, hogy egyesíti a problémákat?"],"More Details":["További részletek"],"Affected Users":["Érintett felhasználók"],"Count":["Számol"],"Issue #":["Probléma #"],"Attachments":["Mellékletek"],"Similar Issues":["Hasonló problémák"],"Learn More":["Tudj meg többet"],"Project Configuration":["Projekt beállítások"],"Add Alert Rule":["Riasztási szabály hozzáadása"],"Add Repository":["Tárló hozzáadása"],"No repositories available":["Nincsenek elérhető tárolók"],"No repositories found":["Nem találhatóak tárolók"],"Enabled":["Engedélyezve"],"Filtered":["Szűrve"],"Total":["Összesen"],"No results":["Nincs találat"],"Overview":["Áttekintés"],"Permission Denied":["Hozzáférés megtagadva"],"< Back":["< Vissza"],"Full Documentation":["Teljes dokumentáció"],"Project name":["Projekt neve"],"Give your project a name":["Adjon nevet a projektnek"],"Configure your application":["Állítsa be az alkalmazást"],"DSN":["DSN"],"No activity yet.":["Nincs tevékenység."],"Resources":["Erőforrások"],"All Issues":["Minden probléma"],"First Event":["Első esemény"],"Last Event":["Utolsó esemény"],"Search":["Keresés"],"Project Name":["Projekt neve"],"14d":["14 nap"],"Release Stats":["Statisztikák kiadása"],"Approved Applications":["Jóváhagyott alkalmazások"],"Remove the following organizations":["A következő szervezeteket eltávolítása"],"Closing Account":["Fiók zárása"],"Goodbye":["Viszontlátásra"],"Account Details":["Fiók részletei"],"Unverified":["Ellenőrizetlen"],"Primary":["Elsődleges"],"Set as primary":["Beállítás elsődlegesként"],"Resend verification":["Ellenőrzés újraküldése"],"Disconnect":["Szétkapcsol"],"Integration":["Integráció"],"Search Projects":["Projekt keresése"],"Created at":["Létrehozva"],"Last used":["Utoljára használt"],"%s has been removed":["%s eltávolítva"],"Error removing %s":["%s hiba eltávolítása"],"Send Code":["Kód küldésa"],"Sending code to %s...":["Kód küldése %s..."],"Incorrect OTP":["Helytelen OTP"],"Error sending SMS":["SMS küldés sikertelen"],"Sent code to %s":["Kód elküldve a %s"],"Error regenerating backup codes":["Hiba történt a biztonsági kódok újragenerálásakor"],"Unused Codes":["Nem használt kódok"],"Regenerate Codes":["Kód újragenerálása"],"Do you want to remove this method?":["Szeretné eltávolítani ezt a eljárást?"],"Device name":["Eszköz neve"],"Add Another Device":["Másik eszköz hozzáadása"],"Sign out of all devices":["Jelentkezzen ki az összes eszközről"],"Add":["Hozzáad"],"requires 2FA":["kötelező 2FA"],"Subscription":["feliratkozás"],"Credentials":["Hitelesítő adatok"],"Created a new API Application":["Új API Alkalmazás létrehozása"],"Unable to remove application. Please try again.":["Nem lehet eltávolítani az alkalmazást. Próbálkozzon újra."],"Create New Application":["Új alkalmazás létrehozása"],"Application Name":["Alkalmazás neve"],"Create Token":["Token létrehozása"],"Scopes":["Hatáskör"],"Removed token":["Eltávolított token"],"Change your account details and preferences (e.g. timezone/clock, avatar, language)":["Módosítsa fiókja adatait és beállításait (pl. időzóna/óra, avatar, nyelv)"],"Authorized Applications":["Engedélyezett alkalmazások"],"On":["Be"],"Off":["Ki"],"Change password":["Jelszó módosítása"],"Add Item":["Elem hozzáadása"],"Invalid value":["Érvénytelen érték"],"No teams":["Nincsenek csoportok"],"General Settings":["Beállítások"],"API Keys":["API kulcsok"],"Manage developer applications":["A fejlesztői alkalmazások kezelése"],"Are you sure you want to remove this API key?":["Biztos benne, hogy eltávolítja az API kulcsot?"],"Remove API Key?":["Eltávolítja az API kulcsot?"],"New API Key":["Új API kulcs"],"No API keys for this organization":["Ennek a szervezetnek nincs API kulcsa"],"Key":["Kulcs"],"Any action":["Bármilyen művelet"],"Action":["Művelet"],"IP":["IP"],"Sent reminders to members":["Emlékeztetők küldése a tagoknak"],"Failed to send reminders":["Nem sikerült az emlékeztetők elküldése"],"No authentication providers are available.":["Nincs elérhető hitelesítési szolgáltató."],"Choose a provider":["Válasszon szolgáltatót"],"%s SSO is disabled.":["%s SSO kikapcsolva."],"SSO Auth":["SSO autentikáció"],"Revoke":["Visszavon"],"Dashboard":["Munka asztal"],"Remove Organization":["Szervezet eltávolítása"],"Organization Integration Settings":["Szervezet integrációs beállításai"],"Invited":["Meghívott"],"Member Settings":["Tag beállításai"],"Basics":["Alapok"],"Added":["Hozzáadva"],"Invite Link":["meghívó link"],"Generate New Invite":["Új meghívó generálása"],"Resend Invite":["Meghívó újraküldése"],"Save Member":["Tag mentése"],"Saving...":["Mentés..."],"Resend invite":["Meghívó újraküldése"],"Are you sure you want to remove [name] from [orgName]?":["Biztos vagy benne, hogy eltávolítja [name] a [orgName]?"],"Are you sure you want to leave [orgName]?":["Biztos vagy benne, hogy elhagyod [orgName]?"],"Leave":["Elhagy"],"Error sending invite":["Hiba a meghívás elküldése során"],"Search Members":["Tagok keresése"],"No members found.":["Nem találhatóak tagok"],"No projects found.":["Nem találhatóak projektek."],"No Limit":["Korlátlan"],"Adjust Limits":["Korlátozások beállítása"],"Account Limit":["Fiókkorlát"],"[number] per hour":["[number] óránként"],"Public Key":["Publikus kulcs"],"Added Repositories":["Hozzáadott tárolók"],"Unable to save change":["Nem sikerült menteni a változást"],"No teams here. [teamCreate]":["Nincs itt csapat. [teamCreate]"],"You have left [team]":["Elhagytad a [team] csapatot"],"Unable to leave [team]":["Nem lehet elhagyni a [team] csapatot"],"Leave Team":["Csapat elhagyása"],"You have joined [team]":["CSatlakoztál a [team] csapathoz"],"Unable to join [team]":["Nem lehet csatlakozni a [team]"],"Your Teams":["Csapataid"],"Other Teams":["Egyéb csapatok"],"You do not have permission to create teams":["Nincs jogosultsága csapatok létrehozására"],"Unable to load organization members.":["Nem lehet betölteni a szervezet tagjait."],"Successfully added member to team.":["Sikeresen hozzáadott egy tagot a csapathoz."],"Unable to add team member.":["Nem lehet csapattagot hozzáadni."],"No members":["Nincsenek tagok"],"Add Member":["Tag hozzáadása"],"Add Project":["Projekt hozzáadása"],"No projects":["Nincsenek projektek"],"Team name changed":["Csapatnév megváltozott"],"Remove Team":["Csapat törlése"],"SDK Setup":["SDK beállítás"],"Project Teams":["Projekt csapat"],"Manage Environments":["Környezetek kezelése"],"Hidden":["Rejtett"],"Active Environments":["Aktív környezetek"],"Updated [environment]":[" [environment] frissített"],"Inbound Data Filters":["Bejövő adatszűrők"],"Data Filters":["Adatszűrők"],"Discarded Issues":["Elvetett problémák"],"Custom Inbound Filters":["Egyéni bejövő szűrők"],"Key Details":["Kulcs részletei"],"Window":["Ablak"],"4.x":["4.x"],"Revoke Key":["Kulcs visszavonása"],"Revoked key":["Visszavont kulcs"],"Generate New Key":["Új kulcs generálása"],"Remove Key":["Kulcs eltávolítása"],"DSN (Deprecated)":["DSN (elavult)"],"Secret Key":["Titkos kulcs"],"Project ID":["Projekt ID"],"Pending Issues":["Megoldásra váró problémák"],"Problem":["Probléma"],"Client Configuration":["Kliens beállítások"],"Token":["Token"],"Regenerate Token":["Token újragenerálása"],"Webhook":["Webhook"],"Delete Hook":["Hook törlése"],"You must be a project admin to create teams":["Projektvezetőnek kell lennie a csoportok létrehozásához"],"Looking to fine-tune your personal notification preferences? Visit your Account Settings":["Szeretné finomhagolni a személyes értesítési beállításait? Látogassa meg fiókja beállításait"],"Email Settings":["E-mail beállítások"],"dynamic library":["dinamikus könyvtár"],"executable":["futtatható"],"Remove Project":["Projekt eltávolítása"],"Remove project":["Projekt eltávolítása"],"Organization Owner":["Szervezet tulajdonos"],"Event Settings":["Esemény beállítások"],"Client Security":["Ügyfélbiztonság"],"Project Administration":["Projek adminisztráció"],"Enable Plugin":["Bővítmény engedélyezése"],"Disable Plugin":["Bővítmény tiltása"],"Reset Configuration":["Beállítások visszaállítása"],"Plugin Information":["Bővítmény információ"],"Author":["Szerző"],"Plugin was reset":["Bővítmény visszaállítása"],"Configure plugin":["Bővítmény beállítása"],"Additional Configuration":["További beállítások"],"The environment name (e.g. production)":["A környezet neve (pl. éles környezet)"],"The version of the application.":["Az alkalmazás verziója."],"Supported Formats":["Támogatott Formátumok"],"Instructions":["Útmutatók"],"Quick links":["Gyors linkek"],"Change my password":["Jelszó módosítása"],"Notification Preferences":["Értesítési beállítások"],"Change my avatar":["Avatarom megváltoztatása"],"No Organization":["Nincs szervezet"],"Quickstart Guide":["Gyors üzembe helyezési útmutató"],"Platforms & Frameworks":["Platformok és keretrendszerek"],"Sentry CLI":["Sentry CLI"],"Sentry on GitHub":["Sentry a GitHub-on"],"Service Status":["Szolgáltatás állapota"],"Community Forums":["Közösségi fórum"],"My Account":["Fiókom"],"Create a New Team":["Új csapat létrehozása"],"":{"domain":"sentry","plural_forms":"nplurals=2; plural=(n != 1);","lang":"hu"}};

/***/ })

}]);
//# sourceMappingURL=../../sourcemaps/locale/hu.4c2cb0cb43023f8690b3b564b1a575c0.js.map