"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([["app_views_settings_account_accountDetails_tsx"],{

/***/ "./app/data/forms/accountDetails.tsx":
/*!*******************************************!*\
  !*** ./app/data/forms/accountDetails.tsx ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "route": () => (/* binding */ route)
/* harmony export */ });
const route = '/settings/account/details/'; // For fields that are

const getUserIsManaged = _ref => {
  let {
    user
  } = _ref;
  return user.isManaged;
};

const formGroups = [{
  // Form "section"/"panel"
  title: 'Account Details',
  fields: [{
    name: 'name',
    type: 'string',
    required: true,
    // additional data/props that is related to rendering of form field rather than data
    label: 'Name',
    placeholder: 'e.g. John Doe',
    help: 'Your full name'
  }, {
    name: 'username',
    type: 'string',
    required: true,
    autoComplete: 'username',
    label: 'Username',
    placeholder: 'e.g. name@example.com',
    help: '',
    disabled: getUserIsManaged,
    visible: _ref2 => {
      let {
        user
      } = _ref2;
      return user.email !== user.username;
    }
  }]
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formGroups);

/***/ }),

/***/ "./app/data/forms/accountPreferences.tsx":
/*!***********************************************!*\
  !*** ./app/data/forms/accountPreferences.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "route": () => (/* binding */ route)
/* harmony export */ });
/* harmony import */ var sentry_data_languages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sentry/data/languages */ "./app/data/languages.tsx");
/* harmony import */ var sentry_data_timezones__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sentry/data/timezones */ "./app/data/timezones.tsx");
/* harmony import */ var sentry_locale__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sentry/locale */ "./app/locale.tsx");


 // Export route to make these forms searchable by label/help

const route = '/settings/account/details/'; // Called before sending API request, these fields need to be sent as an
// `options` object

const transformOptions = data => ({
  options: data
});

const formGroups = [{
  // Form "section"/"panel"
  title: 'Preferences',
  fields: [{
    name: 'theme',
    type: 'select',
    label: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Theme'),
    help: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)("Select your theme preference. It can be synced to your system's theme, always light mode, or always dark mode."),
    choices: [['light', (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Light')], ['dark', (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Dark')], ['system', (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Default to system')]],
    getData: transformOptions
  }, {
    name: 'language',
    type: 'select',
    label: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Language'),
    choices: sentry_data_languages__WEBPACK_IMPORTED_MODULE_0__["default"],
    getData: transformOptions
  }, {
    name: 'timezone',
    type: 'select',
    label: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Timezone'),
    choices: sentry_data_timezones__WEBPACK_IMPORTED_MODULE_1__["default"],
    getData: transformOptions
  }, {
    name: 'clock24Hours',
    type: 'boolean',
    label: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Use a 24-hour clock'),
    getData: transformOptions
  }, {
    name: 'stacktraceOrder',
    type: 'select',
    required: false,
    choices: [[-1, (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Default (let Sentry decide)')], [1, (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Most recent call last')], [2, (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Most recent call first')]],
    label: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Stack Trace Order'),
    help: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Choose the default ordering of frames in stack traces'),
    getData: transformOptions
  }]
}];
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (formGroups);

/***/ }),

/***/ "./app/data/languages.tsx":
/*!********************************!*\
  !*** ./app/data/languages.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([['ja', 'Japanese'], ['it', 'Italian'], ['zh-tw', 'Traditional Chinese'], ['cs', 'Czech'], ['ru', 'Russian'], ['zh-cn', 'Simplified Chinese'], ['bg', 'Bulgarian'], ['de', 'German'], ['fi', 'Finnish'], ['fr', 'French'], ['es', 'Spanish'], ['en', 'English']]);

/***/ }),

/***/ "./app/data/timezones.tsx":
/*!********************************!*\
  !*** ./app/data/timezones.tsx ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ([['Pacific/Midway', '(UTC-1100) Pacific/Midway'], ['Pacific/Niue', '(UTC-1100) Pacific/Niue'], ['Pacific/Pago_Pago', '(UTC-1100) Pacific/Pago_Pago'], ['America/Adak', '(UTC-1000) America/Adak'], ['Pacific/Honolulu', '(UTC-1000) Pacific/Honolulu'], ['Pacific/Johnston', '(UTC-1000) Pacific/Johnston'], ['Pacific/Rarotonga', '(UTC-1000) Pacific/Rarotonga'], ['Pacific/Tahiti', '(UTC-1000) Pacific/Tahiti'], ['US/Hawaii', '(UTC-1000) US/Hawaii'], ['Pacific/Marquesas', '(UTC-0930) Pacific/Marquesas'], ['America/Anchorage', '(UTC-0900) America/Anchorage'], ['America/Juneau', '(UTC-0900) America/Juneau'], ['America/Metlakatla', '(UTC-0900) America/Metlakatla'], ['America/Nome', '(UTC-0900) America/Nome'], ['America/Sitka', '(UTC-0900) America/Sitka'], ['America/Yakutat', '(UTC-0900) America/Yakutat'], ['Pacific/Gambier', '(UTC-0900) Pacific/Gambier'], ['US/Alaska', '(UTC-0900) US/Alaska'], ['America/Dawson', '(UTC-0800) America/Dawson'], ['America/Los_Angeles', '(UTC-0800) America/Los_Angeles'], ['America/Tijuana', '(UTC-0800) America/Tijuana'], ['America/Vancouver', '(UTC-0800) America/Vancouver'], ['America/Whitehorse', '(UTC-0800) America/Whitehorse'], ['Canada/Pacific', '(UTC-0800) Canada/Pacific'], ['Pacific/Pitcairn', '(UTC-0800) Pacific/Pitcairn'], ['US/Pacific', '(UTC-0800) US/Pacific'], ['America/Boise', '(UTC-0700) America/Boise'], ['America/Cambridge_Bay', '(UTC-0700) America/Cambridge_Bay'], ['America/Chihuahua', '(UTC-0700) America/Chihuahua'], ['America/Creston', '(UTC-0700) America/Creston'], ['America/Dawson_Creek', '(UTC-0700) America/Dawson_Creek'], ['America/Denver', '(UTC-0700) America/Denver'], ['America/Edmonton', '(UTC-0700) America/Edmonton'], ['America/Fort_Nelson', '(UTC-0700) America/Fort_Nelson'], ['America/Hermosillo', '(UTC-0700) America/Hermosillo'], ['America/Inuvik', '(UTC-0700) America/Inuvik'], ['America/Mazatlan', '(UTC-0700) America/Mazatlan'], ['America/Ojinaga', '(UTC-0700) America/Ojinaga'], ['America/Phoenix', '(UTC-0700) America/Phoenix'], ['America/Yellowknife', '(UTC-0700) America/Yellowknife'], ['Canada/Mountain', '(UTC-0700) Canada/Mountain'], ['US/Arizona', '(UTC-0700) US/Arizona'], ['US/Mountain', '(UTC-0700) US/Mountain'], ['America/Bahia_Banderas', '(UTC-0600) America/Bahia_Banderas'], ['America/Belize', '(UTC-0600) America/Belize'], ['America/Chicago', '(UTC-0600) America/Chicago'], ['America/Costa_Rica', '(UTC-0600) America/Costa_Rica'], ['America/El_Salvador', '(UTC-0600) America/El_Salvador'], ['America/Guatemala', '(UTC-0600) America/Guatemala'], ['America/Indiana/Knox', '(UTC-0600) America/Indiana/Knox'], ['America/Indiana/Tell_City', '(UTC-0600) America/Indiana/Tell_City'], ['America/Managua', '(UTC-0600) America/Managua'], ['America/Matamoros', '(UTC-0600) America/Matamoros'], ['America/Menominee', '(UTC-0600) America/Menominee'], ['America/Merida', '(UTC-0600) America/Merida'], ['America/Mexico_City', '(UTC-0600) America/Mexico_City'], ['America/Monterrey', '(UTC-0600) America/Monterrey'], ['America/North_Dakota/Beulah', '(UTC-0600) America/North_Dakota/Beulah'], ['America/North_Dakota/Center', '(UTC-0600) America/North_Dakota/Center'], ['America/North_Dakota/New_Salem', '(UTC-0600) America/North_Dakota/New_Salem'], ['America/Rainy_River', '(UTC-0600) America/Rainy_River'], ['America/Rankin_Inlet', '(UTC-0600) America/Rankin_Inlet'], ['America/Regina', '(UTC-0600) America/Regina'], ['America/Resolute', '(UTC-0600) America/Resolute'], ['America/Swift_Current', '(UTC-0600) America/Swift_Current'], ['America/Tegucigalpa', '(UTC-0600) America/Tegucigalpa'], ['America/Winnipeg', '(UTC-0600) America/Winnipeg'], ['Canada/Central', '(UTC-0600) Canada/Central'], ['Pacific/Galapagos', '(UTC-0600) Pacific/Galapagos'], ['US/Central', '(UTC-0600) US/Central'], ['America/Atikokan', '(UTC-0500) America/Atikokan'], ['America/Bogota', '(UTC-0500) America/Bogota'], ['America/Cancun', '(UTC-0500) America/Cancun'], ['America/Cayman', '(UTC-0500) America/Cayman'], ['America/Detroit', '(UTC-0500) America/Detroit'], ['America/Eirunepe', '(UTC-0500) America/Eirunepe'], ['America/Grand_Turk', '(UTC-0500) America/Grand_Turk'], ['America/Guayaquil', '(UTC-0500) America/Guayaquil'], ['America/Havana', '(UTC-0500) America/Havana'], ['America/Indiana/Indianapolis', '(UTC-0500) America/Indiana/Indianapolis'], ['America/Indiana/Marengo', '(UTC-0500) America/Indiana/Marengo'], ['America/Indiana/Petersburg', '(UTC-0500) America/Indiana/Petersburg'], ['America/Indiana/Vevay', '(UTC-0500) America/Indiana/Vevay'], ['America/Indiana/Vincennes', '(UTC-0500) America/Indiana/Vincennes'], ['America/Indiana/Winamac', '(UTC-0500) America/Indiana/Winamac'], ['America/Iqaluit', '(UTC-0500) America/Iqaluit'], ['America/Jamaica', '(UTC-0500) America/Jamaica'], ['America/Kentucky/Louisville', '(UTC-0500) America/Kentucky/Louisville'], ['America/Kentucky/Monticello', '(UTC-0500) America/Kentucky/Monticello'], ['America/Lima', '(UTC-0500) America/Lima'], ['America/Nassau', '(UTC-0500) America/Nassau'], ['America/New_York', '(UTC-0500) America/New_York'], ['America/Nipigon', '(UTC-0500) America/Nipigon'], ['America/Panama', '(UTC-0500) America/Panama'], ['America/Pangnirtung', '(UTC-0500) America/Pangnirtung'], ['America/Port-au-Prince', '(UTC-0500) America/Port-au-Prince'], ['America/Rio_Branco', '(UTC-0500) America/Rio_Branco'], ['America/Thunder_Bay', '(UTC-0500) America/Thunder_Bay'], ['America/Toronto', '(UTC-0500) America/Toronto'], ['Canada/Eastern', '(UTC-0500) Canada/Eastern'], ['Pacific/Easter', '(UTC-0500) Pacific/Easter'], ['US/Eastern', '(UTC-0500) US/Eastern'], ['America/Caracas', '(UTC-0400) America/Caracas'], ['America/Anguilla', '(UTC-0400) America/Anguilla'], ['America/Antigua', '(UTC-0400) America/Antigua'], ['America/Aruba', '(UTC-0400) America/Aruba'], ['America/Barbados', '(UTC-0400) America/Barbados'], ['America/Blanc-Sablon', '(UTC-0400) America/Blanc-Sablon'], ['America/Boa_Vista', '(UTC-0400) America/Boa_Vista'], ['America/Curacao', '(UTC-0400) America/Curacao'], ['America/Dominica', '(UTC-0400) America/Dominica'], ['America/Glace_Bay', '(UTC-0400) America/Glace_Bay'], ['America/Goose_Bay', '(UTC-0400) America/Goose_Bay'], ['America/Grenada', '(UTC-0400) America/Grenada'], ['America/Guadeloupe', '(UTC-0400) America/Guadeloupe'], ['America/Guyana', '(UTC-0400) America/Guyana'], ['America/Halifax', '(UTC-0400) America/Halifax'], ['America/Kralendijk', '(UTC-0400) America/Kralendijk'], ['America/La_Paz', '(UTC-0400) America/La_Paz'], ['America/Lower_Princes', '(UTC-0400) America/Lower_Princes'], ['America/Manaus', '(UTC-0400) America/Manaus'], ['America/Marigot', '(UTC-0400) America/Marigot'], ['America/Martinique', '(UTC-0400) America/Martinique'], ['America/Moncton', '(UTC-0400) America/Moncton'], ['America/Montserrat', '(UTC-0400) America/Montserrat'], ['America/Port_of_Spain', '(UTC-0400) America/Port_of_Spain'], ['America/Porto_Velho', '(UTC-0400) America/Porto_Velho'], ['America/Puerto_Rico', '(UTC-0400) America/Puerto_Rico'], ['America/Santo_Domingo', '(UTC-0400) America/Santo_Domingo'], ['America/St_Barthelemy', '(UTC-0400) America/St_Barthelemy'], ['America/St_Kitts', '(UTC-0400) America/St_Kitts'], ['America/St_Lucia', '(UTC-0400) America/St_Lucia'], ['America/St_Thomas', '(UTC-0400) America/St_Thomas'], ['America/St_Vincent', '(UTC-0400) America/St_Vincent'], ['America/Thule', '(UTC-0400) America/Thule'], ['America/Tortola', '(UTC-0400) America/Tortola'], ['Atlantic/Bermuda', '(UTC-0400) Atlantic/Bermuda'], ['Canada/Atlantic', '(UTC-0400) Canada/Atlantic'], ['America/St_Johns', '(UTC-0330) America/St_Johns'], ['Canada/Newfoundland', '(UTC-0330) Canada/Newfoundland'], ['America/Araguaina', '(UTC-0300) America/Araguaina'], ['America/Argentina/Buenos_Aires', '(UTC-0300) America/Argentina/Buenos_Aires'], ['America/Argentina/Catamarca', '(UTC-0300) America/Argentina/Catamarca'], ['America/Argentina/Cordoba', '(UTC-0300) America/Argentina/Cordoba'], ['America/Argentina/Jujuy', '(UTC-0300) America/Argentina/Jujuy'], ['America/Argentina/La_Rioja', '(UTC-0300) America/Argentina/La_Rioja'], ['America/Argentina/Mendoza', '(UTC-0300) America/Argentina/Mendoza'], ['America/Argentina/Rio_Gallegos', '(UTC-0300) America/Argentina/Rio_Gallegos'], ['America/Argentina/Salta', '(UTC-0300) America/Argentina/Salta'], ['America/Argentina/San_Juan', '(UTC-0300) America/Argentina/San_Juan'], ['America/Argentina/San_Luis', '(UTC-0300) America/Argentina/San_Luis'], ['America/Argentina/Tucuman', '(UTC-0300) America/Argentina/Tucuman'], ['America/Argentina/Ushuaia', '(UTC-0300) America/Argentina/Ushuaia'], ['America/Asuncion', '(UTC-0300) America/Asuncion'], ['America/Bahia', '(UTC-0300) America/Bahia'], ['America/Belem', '(UTC-0300) America/Belem'], ['America/Campo_Grande', '(UTC-0300) America/Campo_Grande'], ['America/Cayenne', '(UTC-0300) America/Cayenne'], ['America/Cuiaba', '(UTC-0300) America/Cuiaba'], ['America/Fortaleza', '(UTC-0300) America/Fortaleza'], ['America/Godthab', '(UTC-0300) America/Godthab'], ['America/Maceio', '(UTC-0300) America/Maceio'], ['America/Miquelon', '(UTC-0300) America/Miquelon'], ['America/Montevideo', '(UTC-0300) America/Montevideo'], ['America/Paramaribo', '(UTC-0300) America/Paramaribo'], ['America/Recife', '(UTC-0300) America/Recife'], ['America/Santarem', '(UTC-0300) America/Santarem'], ['America/Santiago', '(UTC-0300) America/Santiago'], ['America/Sao_Paulo', '(UTC-0300) America/Sao_Paulo'], ['Antarctica/Palmer', '(UTC-0300) Antarctica/Palmer'], ['Antarctica/Rothera', '(UTC-0300) Antarctica/Rothera'], ['Atlantic/Stanley', '(UTC-0300) Atlantic/Stanley'], ['America/Noronha', '(UTC-0200) America/Noronha'], ['Atlantic/South_Georgia', '(UTC-0200) Atlantic/South_Georgia'], ['America/Scoresbysund', '(UTC-0100) America/Scoresbysund'], ['Atlantic/Azores', '(UTC-0100) Atlantic/Azores'], ['Atlantic/Cape_Verde', '(UTC-0100) Atlantic/Cape_Verde'], ['Africa/Abidjan', '(UTC+0000) Africa/Abidjan'], ['Africa/Accra', '(UTC+0000) Africa/Accra'], ['Africa/Bamako', '(UTC+0000) Africa/Bamako'], ['Africa/Banjul', '(UTC+0000) Africa/Banjul'], ['Africa/Bissau', '(UTC+0000) Africa/Bissau'], ['Africa/Casablanca', '(UTC+0000) Africa/Casablanca'], ['Africa/Conakry', '(UTC+0000) Africa/Conakry'], ['Africa/Dakar', '(UTC+0000) Africa/Dakar'], ['Africa/El_Aaiun', '(UTC+0000) Africa/El_Aaiun'], ['Africa/Freetown', '(UTC+0000) Africa/Freetown'], ['Africa/Lome', '(UTC+0000) Africa/Lome'], ['Africa/Monrovia', '(UTC+0000) Africa/Monrovia'], ['Africa/Nouakchott', '(UTC+0000) Africa/Nouakchott'], ['Africa/Ouagadougou', '(UTC+0000) Africa/Ouagadougou'], ['Africa/Sao_Tome', '(UTC+0000) Africa/Sao_Tome'], ['America/Danmarkshavn', '(UTC+0000) America/Danmarkshavn'], ['Antarctica/Troll', '(UTC+0000) Antarctica/Troll'], ['Atlantic/Canary', '(UTC+0000) Atlantic/Canary'], ['Atlantic/Faroe', '(UTC+0000) Atlantic/Faroe'], ['Atlantic/Madeira', '(UTC+0000) Atlantic/Madeira'], ['Atlantic/Reykjavik', '(UTC+0000) Atlantic/Reykjavik'], ['Atlantic/St_Helena', '(UTC+0000) Atlantic/St_Helena'], ['Europe/Dublin', '(UTC+0000) Europe/Dublin'], ['Europe/Guernsey', '(UTC+0000) Europe/Guernsey'], ['Europe/Isle_of_Man', '(UTC+0000) Europe/Isle_of_Man'], ['Europe/Jersey', '(UTC+0000) Europe/Jersey'], ['Europe/Lisbon', '(UTC+0000) Europe/Lisbon'], ['Europe/London', '(UTC+0000) Europe/London'], ['GMT', '(UTC+0000) GMT'], ['UTC', '(UTC+0000) UTC'], ['Africa/Algiers', '(UTC+0100) Africa/Algiers'], ['Africa/Bangui', '(UTC+0100) Africa/Bangui'], ['Africa/Brazzaville', '(UTC+0100) Africa/Brazzaville'], ['Africa/Ceuta', '(UTC+0100) Africa/Ceuta'], ['Africa/Douala', '(UTC+0100) Africa/Douala'], ['Africa/Kinshasa', '(UTC+0100) Africa/Kinshasa'], ['Africa/Lagos', '(UTC+0100) Africa/Lagos'], ['Africa/Libreville', '(UTC+0100) Africa/Libreville'], ['Africa/Luanda', '(UTC+0100) Africa/Luanda'], ['Africa/Malabo', '(UTC+0100) Africa/Malabo'], ['Africa/Ndjamena', '(UTC+0100) Africa/Ndjamena'], ['Africa/Niamey', '(UTC+0100) Africa/Niamey'], ['Africa/Porto-Novo', '(UTC+0100) Africa/Porto-Novo'], ['Africa/Tunis', '(UTC+0100) Africa/Tunis'], ['Arctic/Longyearbyen', '(UTC+0100) Arctic/Longyearbyen'], ['Europe/Amsterdam', '(UTC+0100) Europe/Amsterdam'], ['Europe/Andorra', '(UTC+0100) Europe/Andorra'], ['Europe/Belgrade', '(UTC+0100) Europe/Belgrade'], ['Europe/Berlin', '(UTC+0100) Europe/Berlin'], ['Europe/Bratislava', '(UTC+0100) Europe/Bratislava'], ['Europe/Brussels', '(UTC+0100) Europe/Brussels'], ['Europe/Budapest', '(UTC+0100) Europe/Budapest'], ['Europe/Busingen', '(UTC+0100) Europe/Busingen'], ['Europe/Copenhagen', '(UTC+0100) Europe/Copenhagen'], ['Europe/Gibraltar', '(UTC+0100) Europe/Gibraltar'], ['Europe/Ljubljana', '(UTC+0100) Europe/Ljubljana'], ['Europe/Luxembourg', '(UTC+0100) Europe/Luxembourg'], ['Europe/Madrid', '(UTC+0100) Europe/Madrid'], ['Europe/Malta', '(UTC+0100) Europe/Malta'], ['Europe/Monaco', '(UTC+0100) Europe/Monaco'], ['Europe/Oslo', '(UTC+0100) Europe/Oslo'], ['Europe/Paris', '(UTC+0100) Europe/Paris'], ['Europe/Podgorica', '(UTC+0100) Europe/Podgorica'], ['Europe/Prague', '(UTC+0100) Europe/Prague'], ['Europe/Rome', '(UTC+0100) Europe/Rome'], ['Europe/San_Marino', '(UTC+0100) Europe/San_Marino'], ['Europe/Sarajevo', '(UTC+0100) Europe/Sarajevo'], ['Europe/Skopje', '(UTC+0100) Europe/Skopje'], ['Europe/Stockholm', '(UTC+0100) Europe/Stockholm'], ['Europe/Tirane', '(UTC+0100) Europe/Tirane'], ['Europe/Vaduz', '(UTC+0100) Europe/Vaduz'], ['Europe/Vatican', '(UTC+0100) Europe/Vatican'], ['Europe/Vienna', '(UTC+0100) Europe/Vienna'], ['Europe/Warsaw', '(UTC+0100) Europe/Warsaw'], ['Europe/Zagreb', '(UTC+0100) Europe/Zagreb'], ['Europe/Zurich', '(UTC+0100) Europe/Zurich'], ['Africa/Blantyre', '(UTC+0200) Africa/Blantyre'], ['Africa/Bujumbura', '(UTC+0200) Africa/Bujumbura'], ['Africa/Cairo', '(UTC+0200) Africa/Cairo'], ['Africa/Gaborone', '(UTC+0200) Africa/Gaborone'], ['Africa/Harare', '(UTC+0200) Africa/Harare'], ['Africa/Johannesburg', '(UTC+0200) Africa/Johannesburg'], ['Africa/Juba', '(UTC+0200) Africa/Juba'], ['Africa/Khartoum', '(UTC+0200) Africa/Khartoum'], ['Africa/Kigali', '(UTC+0200) Africa/Kigali'], ['Africa/Lubumbashi', '(UTC+0200) Africa/Lubumbashi'], ['Africa/Lusaka', '(UTC+0200) Africa/Lusaka'], ['Africa/Maputo', '(UTC+0200) Africa/Maputo'], ['Africa/Maseru', '(UTC+0200) Africa/Maseru'], ['Africa/Mbabane', '(UTC+0200) Africa/Mbabane'], ['Africa/Tripoli', '(UTC+0200) Africa/Tripoli'], ['Africa/Windhoek', '(UTC+0200) Africa/Windhoek'], ['Asia/Amman', '(UTC+0200) Asia/Amman'], ['Asia/Beirut', '(UTC+0200) Asia/Beirut'], ['Asia/Damascus', '(UTC+0200) Asia/Damascus'], ['Asia/Gaza', '(UTC+0200) Asia/Gaza'], ['Asia/Hebron', '(UTC+0200) Asia/Hebron'], ['Asia/Jerusalem', '(UTC+0200) Asia/Jerusalem'], ['Asia/Nicosia', '(UTC+0200) Asia/Nicosia'], ['Europe/Athens', '(UTC+0200) Europe/Athens'], ['Europe/Bucharest', '(UTC+0200) Europe/Bucharest'], ['Europe/Chisinau', '(UTC+0200) Europe/Chisinau'], ['Europe/Helsinki', '(UTC+0200) Europe/Helsinki'], ['Europe/Kaliningrad', '(UTC+0200) Europe/Kaliningrad'], ['Europe/Mariehamn', '(UTC+0200) Europe/Mariehamn'], ['Europe/Riga', '(UTC+0200) Europe/Riga'], ['Europe/Sofia', '(UTC+0200) Europe/Sofia'], ['Europe/Tallinn', '(UTC+0200) Europe/Tallinn'], ['Europe/Uzhgorod', '(UTC+0200) Europe/Uzhgorod'], ['Europe/Vilnius', '(UTC+0200) Europe/Vilnius'], ['Europe/Zaporozhye', '(UTC+0200) Europe/Zaporozhye'], ['Africa/Addis_Ababa', '(UTC+0300) Africa/Addis_Ababa'], ['Africa/Asmara', '(UTC+0300) Africa/Asmara'], ['Africa/Dar_es_Salaam', '(UTC+0300) Africa/Dar_es_Salaam'], ['Africa/Djibouti', '(UTC+0300) Africa/Djibouti'], ['Africa/Kampala', '(UTC+0300) Africa/Kampala'], ['Africa/Mogadishu', '(UTC+0300) Africa/Mogadishu'], ['Africa/Nairobi', '(UTC+0300) Africa/Nairobi'], ['Antarctica/Syowa', '(UTC+0300) Antarctica/Syowa'], ['Asia/Aden', '(UTC+0300) Asia/Aden'], ['Asia/Baghdad', '(UTC+0300) Asia/Baghdad'], ['Asia/Bahrain', '(UTC+0300) Asia/Bahrain'], ['Asia/Kuwait', '(UTC+0300) Asia/Kuwait'], ['Asia/Qatar', '(UTC+0300) Asia/Qatar'], ['Asia/Riyadh', '(UTC+0300) Asia/Riyadh'], ['Europe/Istanbul', '(UTC+0300) Europe/Istanbul'], ['Europe/Kiev', '(UTC+0300) Europe/Kiev'], ['Europe/Minsk', '(UTC+0300) Europe/Minsk'], ['Europe/Moscow', '(UTC+0300) Europe/Moscow'], ['Europe/Simferopol', '(UTC+0300) Europe/Simferopol'], ['Indian/Antananarivo', '(UTC+0300) Indian/Antananarivo'], ['Indian/Comoro', '(UTC+0300) Indian/Comoro'], ['Indian/Mayotte', '(UTC+0300) Indian/Mayotte'], ['Asia/Tehran', '(UTC+0330) Asia/Tehran'], ['Asia/Baku', '(UTC+0400) Asia/Baku'], ['Asia/Dubai', '(UTC+0400) Asia/Dubai'], ['Asia/Muscat', '(UTC+0400) Asia/Muscat'], ['Asia/Tbilisi', '(UTC+0400) Asia/Tbilisi'], ['Asia/Yerevan', '(UTC+0400) Asia/Yerevan'], ['Europe/Samara', '(UTC+0400) Europe/Samara'], ['Europe/Volgograd', '(UTC+0400) Europe/Volgograd'], ['Indian/Mahe', '(UTC+0400) Indian/Mahe'], ['Indian/Mauritius', '(UTC+0400) Indian/Mauritius'], ['Indian/Reunion', '(UTC+0400) Indian/Reunion'], ['Asia/Kabul', '(UTC+0430) Asia/Kabul'], ['Antarctica/Mawson', '(UTC+0500) Antarctica/Mawson'], ['Asia/Aqtau', '(UTC+0500) Asia/Aqtau'], ['Asia/Aqtobe', '(UTC+0500) Asia/Aqtobe'], ['Asia/Ashgabat', '(UTC+0500) Asia/Ashgabat'], ['Asia/Dushanbe', '(UTC+0500) Asia/Dushanbe'], ['Asia/Karachi', '(UTC+0500) Asia/Karachi'], ['Asia/Oral', '(UTC+0500) Asia/Oral'], ['Asia/Samarkand', '(UTC+0500) Asia/Samarkand'], ['Asia/Tashkent', '(UTC+0500) Asia/Tashkent'], ['Asia/Yekaterinburg', '(UTC+0500) Asia/Yekaterinburg'], ['Indian/Kerguelen', '(UTC+0500) Indian/Kerguelen'], ['Indian/Maldives', '(UTC+0500) Indian/Maldives'], ['Asia/Colombo', '(UTC+0530) Asia/Colombo'], ['Asia/Kolkata', '(UTC+0530) Asia/Kolkata'], ['Asia/Kathmandu', '(UTC+0545) Asia/Kathmandu'], ['Antarctica/Vostok', '(UTC+0600) Antarctica/Vostok'], ['Asia/Almaty', '(UTC+0600) Asia/Almaty'], ['Asia/Bishkek', '(UTC+0600) Asia/Bishkek'], ['Asia/Dhaka', '(UTC+0600) Asia/Dhaka'], ['Asia/Novosibirsk', '(UTC+0600) Asia/Novosibirsk'], ['Asia/Omsk', '(UTC+0600) Asia/Omsk'], ['Asia/Qyzylorda', '(UTC+0600) Asia/Qyzylorda'], ['Asia/Thimphu', '(UTC+0600) Asia/Thimphu'], ['Asia/Urumqi', '(UTC+0600) Asia/Urumqi'], ['Indian/Chagos', '(UTC+0600) Indian/Chagos'], ['Asia/Rangoon', '(UTC+0630) Asia/Rangoon'], ['Indian/Cocos', '(UTC+0630) Indian/Cocos'], ['Antarctica/Davis', '(UTC+0700) Antarctica/Davis'], ['Asia/Bangkok', '(UTC+0700) Asia/Bangkok'], ['Asia/Ho_Chi_Minh', '(UTC+0700) Asia/Ho_Chi_Minh'], ['Asia/Hovd', '(UTC+0700) Asia/Hovd'], ['Asia/Jakarta', '(UTC+0700) Asia/Jakarta'], ['Asia/Krasnoyarsk', '(UTC+0700) Asia/Krasnoyarsk'], ['Asia/Novokuznetsk', '(UTC+0700) Asia/Novokuznetsk'], ['Asia/Phnom_Penh', '(UTC+0700) Asia/Phnom_Penh'], ['Asia/Pontianak', '(UTC+0700) Asia/Pontianak'], ['Asia/Vientiane', '(UTC+0700) Asia/Vientiane'], ['Indian/Christmas', '(UTC+0700) Indian/Christmas'], ['Antarctica/Casey', '(UTC+0800) Antarctica/Casey'], ['Asia/Brunei', '(UTC+0800) Asia/Brunei'], ['Asia/Choibalsan', '(UTC+0800) Asia/Choibalsan'], ['Asia/Hong_Kong', '(UTC+0800) Asia/Hong_Kong'], ['Asia/Irkutsk', '(UTC+0800) Asia/Irkutsk'], ['Asia/Kuala_Lumpur', '(UTC+0800) Asia/Kuala_Lumpur'], ['Asia/Kuching', '(UTC+0800) Asia/Kuching'], ['Asia/Macau', '(UTC+0800) Asia/Macau'], ['Asia/Makassar', '(UTC+0800) Asia/Makassar'], ['Asia/Manila', '(UTC+0800) Asia/Manila'], ['Asia/Shanghai', '(UTC+0800) Asia/Shanghai'], ['Asia/Singapore', '(UTC+0800) Asia/Singapore'], ['Asia/Taipei', '(UTC+0800) Asia/Taipei'], ['Asia/Ulaanbaatar', '(UTC+0800) Asia/Ulaanbaatar'], ['Australia/Perth', '(UTC+0800) Australia/Perth'], ['Australia/Eucla', '(UTC+0845) Australia/Eucla'], ['Asia/Chita', '(UTC+0900) Asia/Chita'], ['Asia/Dili', '(UTC+0900) Asia/Dili'], ['Asia/Jayapura', '(UTC+0900) Asia/Jayapura'], ['Asia/Khandyga', '(UTC+0900) Asia/Khandyga'], ['Asia/Pyongyang', '(UTC+0900) Asia/Pyongyang'], ['Asia/Seoul', '(UTC+0900) Asia/Seoul'], ['Asia/Tokyo', '(UTC+0900) Asia/Tokyo'], ['Asia/Yakutsk', '(UTC+0900) Asia/Yakutsk'], ['Pacific/Palau', '(UTC+0900) Pacific/Palau'], ['Australia/Darwin', '(UTC+0930) Australia/Darwin'], ['Antarctica/DumontDUrville', '(UTC+1000) Antarctica/DumontDUrville'], ['Asia/Magadan', '(UTC+1000) Asia/Magadan'], ['Asia/Sakhalin', '(UTC+1000) Asia/Sakhalin'], ['Asia/Ust-Nera', '(UTC+1000) Asia/Ust-Nera'], ['Asia/Vladivostok', '(UTC+1000) Asia/Vladivostok'], ['Australia/Brisbane', '(UTC+1000) Australia/Brisbane'], ['Australia/Lindeman', '(UTC+1000) Australia/Lindeman'], ['Pacific/Chuuk', '(UTC+1000) Pacific/Chuuk'], ['Pacific/Guam', '(UTC+1000) Pacific/Guam'], ['Pacific/Port_Moresby', '(UTC+1000) Pacific/Port_Moresby'], ['Pacific/Saipan', '(UTC+1000) Pacific/Saipan'], ['Australia/Adelaide', '(UTC+1030) Australia/Adelaide'], ['Australia/Broken_Hill', '(UTC+1030) Australia/Broken_Hill'], ['Antarctica/Macquarie', '(UTC+1100) Antarctica/Macquarie'], ['Asia/Srednekolymsk', '(UTC+1100) Asia/Srednekolymsk'], ['Australia/Currie', '(UTC+1100) Australia/Currie'], ['Australia/Hobart', '(UTC+1100) Australia/Hobart'], ['Australia/Lord_Howe', '(UTC+1100) Australia/Lord_Howe'], ['Australia/Melbourne', '(UTC+1100) Australia/Melbourne'], ['Australia/Sydney', '(UTC+1100) Australia/Sydney'], ['Pacific/Bougainville', '(UTC+1100) Pacific/Bougainville'], ['Pacific/Efate', '(UTC+1100) Pacific/Efate'], ['Pacific/Guadalcanal', '(UTC+1100) Pacific/Guadalcanal'], ['Pacific/Kosrae', '(UTC+1100) Pacific/Kosrae'], ['Pacific/Norfolk', '(UTC+1100) Pacific/Norfolk'], ['Pacific/Noumea', '(UTC+1100) Pacific/Noumea'], ['Pacific/Pohnpei', '(UTC+1100) Pacific/Pohnpei'], ['Asia/Anadyr', '(UTC+1200) Asia/Anadyr'], ['Asia/Kamchatka', '(UTC+1200) Asia/Kamchatka'], ['Pacific/Funafuti', '(UTC+1200) Pacific/Funafuti'], ['Pacific/Kwajalein', '(UTC+1200) Pacific/Kwajalein'], ['Pacific/Majuro', '(UTC+1200) Pacific/Majuro'], ['Pacific/Nauru', '(UTC+1200) Pacific/Nauru'], ['Pacific/Tarawa', '(UTC+1200) Pacific/Tarawa'], ['Pacific/Wake', '(UTC+1200) Pacific/Wake'], ['Pacific/Wallis', '(UTC+1200) Pacific/Wallis'], ['Antarctica/McMurdo', '(UTC+1300) Antarctica/McMurdo'], ['Pacific/Auckland', '(UTC+1300) Pacific/Auckland'], ['Pacific/Enderbury', '(UTC+1300) Pacific/Enderbury'], ['Pacific/Fakaofo', '(UTC+1300) Pacific/Fakaofo'], ['Pacific/Fiji', '(UTC+1300) Pacific/Fiji'], ['Pacific/Tongatapu', '(UTC+1300) Pacific/Tongatapu'], ['Pacific/Chatham', '(UTC+1345) Pacific/Chatham'], ['Pacific/Apia', '(UTC+1400) Pacific/Apia'], ['Pacific/Kiritimati', '(UTC+1400) Pacific/Kiritimati']]);

/***/ }),

/***/ "./app/views/asyncView.tsx":
/*!*********************************!*\
  !*** ./app/views/asyncView.tsx ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AsyncView)
/* harmony export */ });
/* harmony import */ var sentry_components_asyncComponent__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sentry/components/asyncComponent */ "./app/components/asyncComponent.tsx");
/* harmony import */ var sentry_components_sentryDocumentTitle__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sentry/components/sentryDocumentTitle */ "./app/components/sentryDocumentTitle.tsx");
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js");



class AsyncView extends sentry_components_asyncComponent__WEBPACK_IMPORTED_MODULE_0__["default"] {
  getTitle() {
    return '';
  }

  render() {
    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(sentry_components_sentryDocumentTitle__WEBPACK_IMPORTED_MODULE_1__["default"], {
      title: this.getTitle(),
      children: this.renderComponent()
    });
  }

}
AsyncView.displayName = "AsyncView";

/***/ }),

/***/ "./app/views/settings/account/accountDetails.tsx":
/*!*******************************************************!*\
  !*** ./app/views/settings/account/accountDetails.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/defineProperty */ "../node_modules/@babel/runtime/helpers/esm/defineProperty.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "../node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var sentry_actionCreators_account__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sentry/actionCreators/account */ "./app/actionCreators/account.tsx");
/* harmony import */ var sentry_components_avatarChooser__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! sentry/components/avatarChooser */ "./app/components/avatarChooser.tsx");
/* harmony import */ var sentry_components_forms_form__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! sentry/components/forms/form */ "./app/components/forms/form.tsx");
/* harmony import */ var sentry_components_forms_jsonForm__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! sentry/components/forms/jsonForm */ "./app/components/forms/jsonForm.tsx");
/* harmony import */ var sentry_data_forms_accountDetails__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! sentry/data/forms/accountDetails */ "./app/data/forms/accountDetails.tsx");
/* harmony import */ var sentry_data_forms_accountPreferences__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! sentry/data/forms/accountPreferences */ "./app/data/forms/accountPreferences.tsx");
/* harmony import */ var sentry_locale__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! sentry/locale */ "./app/locale.tsx");
/* harmony import */ var sentry_views_asyncView__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! sentry/views/asyncView */ "./app/views/asyncView.tsx");
/* harmony import */ var sentry_views_settings_components_settingsPageHeader__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! sentry/views/settings/components/settingsPageHeader */ "./app/views/settings/components/settingsPageHeader.tsx");
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js");













const ENDPOINT = '/users/me/';

class AccountDetails extends sentry_views_asyncView__WEBPACK_IMPORTED_MODULE_9__["default"] {
  constructor() {
    super(...arguments);

    (0,_babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_0__["default"])(this, "handleSubmitSuccess", user => {
      // the updateUser method updates our Config Store
      // No components listen to the ConfigStore, they just access it directly
      (0,sentry_actionCreators_account__WEBPACK_IMPORTED_MODULE_2__.updateUser)(user); // We need to update the state, because AvatarChooser is using it,
      // otherwise it will flick

      this.setState({
        user
      });
    });
  }

  getEndpoints() {
    // local state is NOT updated when the form saves
    return [['user', ENDPOINT]];
  }

  renderBody() {
    const user = this.state.user;
    const formCommonProps = {
      apiEndpoint: ENDPOINT,
      apiMethod: 'PUT',
      allowUndo: true,
      saveOnBlur: true,
      onSubmitSuccess: this.handleSubmitSuccess
    };
    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsxs)("div", {
      children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(sentry_views_settings_components_settingsPageHeader__WEBPACK_IMPORTED_MODULE_10__["default"], {
        title: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_8__.t)('Account Details')
      }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(sentry_components_forms_form__WEBPACK_IMPORTED_MODULE_4__["default"], {
        initialData: user,
        ...formCommonProps,
        children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(sentry_components_forms_jsonForm__WEBPACK_IMPORTED_MODULE_5__["default"], {
          forms: sentry_data_forms_accountDetails__WEBPACK_IMPORTED_MODULE_6__["default"],
          additionalFieldProps: {
            user
          }
        })
      }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(sentry_components_forms_form__WEBPACK_IMPORTED_MODULE_4__["default"], {
        initialData: user.options,
        ...formCommonProps,
        children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(sentry_components_forms_jsonForm__WEBPACK_IMPORTED_MODULE_5__["default"], {
          forms: sentry_data_forms_accountPreferences__WEBPACK_IMPORTED_MODULE_7__["default"],
          additionalFieldProps: {
            user
          }
        })
      }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_11__.jsx)(sentry_components_avatarChooser__WEBPACK_IMPORTED_MODULE_3__["default"], {
        endpoint: "/users/me/avatar/",
        model: user,
        onSave: resp => {
          this.handleSubmitSuccess(resp);
        },
        isUser: true
      })]
    });
  }

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AccountDetails);

/***/ })

}]);
//# sourceMappingURL=../sourcemaps/app_views_settings_account_accountDetails_tsx.cd232e477a2ab75d615daed22d4037c0.js.map