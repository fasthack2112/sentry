"use strict";
(globalThis["webpackChunk"] = globalThis["webpackChunk"] || []).push([["app_components_replays_walker_urlWalker_tsx-app_utils_replays_replayDataUtils_tsx-app_utils_u-d549a4"],{

/***/ "./app/components/events/interfaces/breadcrumbs/breadcrumb/type/icon.tsx":
/*!*******************************************************************************!*\
  !*** ./app/components/events/interfaces/breadcrumbs/breadcrumb/type/icon.tsx ***!
  \*******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var sentry_icons__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sentry/icons */ "./app/icons/index.tsx");
/* harmony import */ var sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sentry/types/breadcrumbs */ "./app/types/breadcrumbs.tsx");
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js");




function Icon(_ref) {
  let {
    type
  } = _ref;

  switch (type) {
    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbType.USER:
    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbType.UI:
      return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(sentry_icons__WEBPACK_IMPORTED_MODULE_0__.IconUser, {
        size: "xs"
      });

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbType.NAVIGATION:
      return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(sentry_icons__WEBPACK_IMPORTED_MODULE_0__.IconLocation, {
        size: "xs"
      });

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbType.DEBUG:
      return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(sentry_icons__WEBPACK_IMPORTED_MODULE_0__.IconFix, {
        size: "xs"
      });

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbType.INFO:
      return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(sentry_icons__WEBPACK_IMPORTED_MODULE_0__.IconInfo, {
        size: "xs"
      });

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbType.ERROR:
      return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(sentry_icons__WEBPACK_IMPORTED_MODULE_0__.IconFire, {
        size: "xs"
      });

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbType.HTTP:
      return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(sentry_icons__WEBPACK_IMPORTED_MODULE_0__.IconSort, {
        size: "xs",
        rotated: true
      });

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbType.WARNING:
      return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(sentry_icons__WEBPACK_IMPORTED_MODULE_0__.IconWarning, {
        size: "xs"
      });

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbType.QUERY:
      return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(sentry_icons__WEBPACK_IMPORTED_MODULE_0__.IconStack, {
        size: "xs"
      });

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbType.SYSTEM:
      return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(sentry_icons__WEBPACK_IMPORTED_MODULE_0__.IconMobile, {
        size: "xs"
      });

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbType.SESSION:
      return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(sentry_icons__WEBPACK_IMPORTED_MODULE_0__.IconRefresh, {
        size: "xs"
      });

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbType.TRANSACTION:
      return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(sentry_icons__WEBPACK_IMPORTED_MODULE_0__.IconSpan, {
        size: "xs"
      });

    default:
      return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(sentry_icons__WEBPACK_IMPORTED_MODULE_0__.IconTerminal, {
        size: "xs"
      });
  }
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Icon);

/***/ }),

/***/ "./app/components/events/interfaces/breadcrumbs/utils.tsx":
/*!****************************************************************!*\
  !*** ./app/components/events/interfaces/breadcrumbs/utils.tsx ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "convertCrumbType": () => (/* binding */ convertCrumbType),
/* harmony export */   "getVirtualCrumb": () => (/* binding */ getVirtualCrumb),
/* harmony export */   "transformCrumbs": () => (/* binding */ transformCrumbs)
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "../node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ "../node_modules/core-js/modules/es.array.includes.js");
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var sentry_locale__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sentry/locale */ "./app/locale.tsx");
/* harmony import */ var sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! sentry/types/breadcrumbs */ "./app/types/breadcrumbs.tsx");
/* harmony import */ var sentry_types_event__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! sentry/types/event */ "./app/types/event.tsx");
/* harmony import */ var sentry_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! sentry/utils */ "./app/utils.tsx");






function convertCrumbType(breadcrumb) {
  if (breadcrumb.type === sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.EXCEPTION) {
    return { ...breadcrumb,
      type: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.ERROR
    };
  } // special case for 'ui.' and `sentry.` category breadcrumbs
  // TODO: find a better way to customize UI around non-schema data


  if (breadcrumb.type === sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.DEFAULT && (0,sentry_utils__WEBPACK_IMPORTED_MODULE_5__.defined)(breadcrumb === null || breadcrumb === void 0 ? void 0 : breadcrumb.category)) {
    const [category, subcategory] = breadcrumb.category.split('.');

    if (category === 'ui') {
      return { ...breadcrumb,
        type: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.UI
      };
    }

    if (category === 'console') {
      return { ...breadcrumb,
        type: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.DEBUG
      };
    }

    if (category === 'navigation') {
      return { ...breadcrumb,
        type: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.NAVIGATION
      };
    }

    if (category === 'sentry' && (subcategory === 'transaction' || subcategory === 'event')) {
      return { ...breadcrumb,
        type: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.TRANSACTION
      };
    }
  }

  if (!Object.values(sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType).includes(breadcrumb.type)) {
    return { ...breadcrumb,
      type: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.DEFAULT
    };
  }

  return breadcrumb;
}

function getCrumbDescriptionAndColor(type) {
  switch (type) {
    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.USER:
    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.UI:
      return {
        color: 'purple300',
        description: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('User Action')
      };

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.NAVIGATION:
      return {
        color: 'green300',
        description: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Navigation')
      };

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.DEBUG:
      return {
        color: 'purple300',
        description: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Debug')
      };

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.INFO:
      return {
        color: 'blue300',
        description: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Info')
      };

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.ERROR:
      return {
        color: 'red300',
        description: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Error')
      };

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.HTTP:
      return {
        color: 'green300',
        description: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('HTTP request')
      };

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.WARNING:
      return {
        color: 'yellow300',
        description: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Warning')
      };

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.QUERY:
      return {
        color: 'blue300',
        description: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Query')
      };

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.SYSTEM:
      return {
        color: 'pink300',
        description: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('System')
      };

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.SESSION:
      return {
        color: 'pink300',
        description: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Session')
      };

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.TRANSACTION:
      return {
        color: 'pink300',
        description: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Transaction')
      };

    default:
      return {
        color: 'gray300',
        description: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_2__.t)('Default')
      };
  }
}

function transformCrumbs(breadcrumbs) {
  return breadcrumbs.map((breadcrumb, index) => {
    var _convertedCrumbType$l;

    const convertedCrumbType = convertCrumbType(breadcrumb);
    const {
      color,
      description
    } = getCrumbDescriptionAndColor(convertedCrumbType.type);
    return { ...convertedCrumbType,
      id: index,
      color,
      description,
      level: (_convertedCrumbType$l = convertedCrumbType.level) !== null && _convertedCrumbType$l !== void 0 ? _convertedCrumbType$l : sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbLevelType.UNDEFINED
    };
  });
}

function moduleToCategory(module) {
  if (!module) {
    return undefined;
  }

  const match = module.match(/^.*\/(.*?)(:\d+)/);

  if (!match) {
    return module.split(/./)[0];
  }

  return match[1];
}

function getVirtualCrumb(event) {
  const exception = event.entries.find(entry => entry.type === sentry_types_event__WEBPACK_IMPORTED_MODULE_4__.EntryType.EXCEPTION);

  if (!exception && !event.message) {
    return undefined;
  }

  const timestamp = event.dateCreated;

  if (exception) {
    const {
      type,
      value,
      module: mdl
    } = exception.data.values[0];
    return {
      type: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.ERROR,
      level: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbLevelType.ERROR,
      category: moduleToCategory(mdl) || 'exception',
      data: {
        type,
        value
      },
      timestamp
    };
  }

  const levelTag = (event.tags || []).find(tag => tag.key === 'level');
  return {
    type: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbType.INFO,
    level: (levelTag === null || levelTag === void 0 ? void 0 : levelTag.value) || sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_3__.BreadcrumbLevelType.UNDEFINED,
    category: 'message',
    message: event.message,
    timestamp
  };
}

/***/ }),

/***/ "./app/components/replays/breadcrumbs/utils.tsx":
/*!******************************************************!*\
  !*** ./app/components/replays/breadcrumbs/utils.tsx ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getDescription": () => (/* binding */ getDescription),
/* harmony export */   "getDetails": () => (/* binding */ getDetails),
/* harmony export */   "getTitle": () => (/* binding */ getTitle)
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "../node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sentry/types/breadcrumbs */ "./app/types/breadcrumbs.tsx");


/**
 * Generate breadcrumb descriptions based on type
 */

function getDescription(crumb) {
  var _crumb$data$to, _crumb$data;

  switch (crumb.type) {
    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbType.NAVIGATION:
      return `${(_crumb$data$to = (_crumb$data = crumb.data) === null || _crumb$data === void 0 ? void 0 : _crumb$data.to) !== null && _crumb$data$to !== void 0 ? _crumb$data$to : ''}`;

    case sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_1__.BreadcrumbType.DEFAULT:
      return JSON.stringify(crumb.data);

    default:
      return crumb.message || '';
  }
}
/**
 * Get title of breadcrumb
 */

function getTitle(crumb) {
  var _crumb$category;

  const [type, action] = ((_crumb$category = crumb.category) === null || _crumb$category === void 0 ? void 0 : _crumb$category.split('.')) || []; // Supports replay specific breadcrumbs

  if (crumb.data && 'label' in crumb.data) {
    return crumb.data.label;
  }

  return `${type === 'ui' ? 'User' : type} ${action || ''}`;
}
/**
 * Generate breadcrumb title + descriptions
 */

function getDetails(crumb) {
  return {
    title: getTitle(crumb),
    description: getDescription(crumb)
  };
}

/***/ }),

/***/ "./app/components/replays/playerRelativeTime.tsx":
/*!*******************************************************!*\
  !*** ./app/components/replays/playerRelativeTime.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/styled/base */ "../node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js");
/* harmony import */ var sentry_components_dateTime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sentry/components/dateTime */ "./app/components/dateTime.tsx");
/* harmony import */ var sentry_components_replays_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sentry/components/replays/utils */ "./app/components/replays/utils.tsx");
/* harmony import */ var sentry_components_tooltip__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! sentry/components/tooltip */ "./app/components/tooltip.tsx");
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js");






const PlayerRelativeTime = _ref => {
  let {
    relativeTimeMs,
    timestamp
  } = _ref;

  if (!timestamp || !relativeTimeMs) {
    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {});
  }

  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(sentry_components_tooltip__WEBPACK_IMPORTED_MODULE_3__["default"], {
    title: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(sentry_components_dateTime__WEBPACK_IMPORTED_MODULE_1__["default"], {
      date: timestamp,
      seconds: true
    }),
    disabled: !timestamp,
    skipWrapper: true,
    disableForVisualTest: true,
    underlineColor: "gray300",
    showUnderline: true,
    children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(Value, {
      children: (0,sentry_components_replays_utils__WEBPACK_IMPORTED_MODULE_2__.showPlayerTime)(timestamp, relativeTimeMs)
    })
  });
};

PlayerRelativeTime.displayName = "PlayerRelativeTime";

const Value = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])('p',  true ? {
  target: "e1g9xaze0"
} : 0)("color:", p => p.theme.subText, ";font-size:", p => p.theme.fontSizeSmall, ";font-variant-numeric:tabular-nums;margin-bottom:0;" + ( true ? "" : 0));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PlayerRelativeTime);

/***/ }),

/***/ "./app/components/replays/replayContext.tsx":
/*!**************************************************!*\
  !*** ./app/components/replays/replayContext.tsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Provider": () => (/* binding */ Provider),
/* harmony export */   "useReplayContext": () => (/* binding */ useReplayContext)
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "../node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "../node_modules/react/index.js");
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @emotion/react */ "../node_modules/@emotion/react/dist/emotion-element-cbed451f.browser.esm.js");
/* harmony import */ var rrweb__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rrweb */ "../node_modules/rrweb/es/rrweb/packages/rrweb/src/replay/index.js");
/* harmony import */ var rrweb__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rrweb */ "../node_modules/rrweb/es/rrweb/packages/rrweb/src/types.js");
/* harmony import */ var sentry_utils_replays_highlightNode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sentry/utils/replays/highlightNode */ "./app/utils/replays/highlightNode.tsx");
/* harmony import */ var sentry_utils_replays_hooks_useRAF__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! sentry/utils/replays/hooks/useRAF */ "./app/utils/replays/hooks/useRAF.tsx");
/* harmony import */ var sentry_utils_usePrevious__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! sentry/utils/usePrevious */ "./app/utils/usePrevious.tsx");
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js");








const ReplayPlayerContext = /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_1__.createContext({
  clearAllHighlights: () => {},
  currentHoverTime: undefined,
  currentTime: 0,
  dimensions: {
    height: 0,
    width: 0
  },
  fastForwardSpeed: 0,
  highlight: () => {},
  initRoot: () => {},
  isBuffering: false,
  isFinished: false,
  isPlaying: false,
  isSkippingInactive: true,
  removeHighlight: () => {},
  replay: null,
  restart: () => {},
  setCurrentHoverTime: () => {},
  setCurrentTime: () => {},
  setSpeed: () => {},
  speed: 1,
  togglePlayPause: () => {},
  toggleSkipInactive: () => {}
});

function useCurrentTime(callback) {
  const [currentTime, setCurrentTime] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
  (0,sentry_utils_replays_hooks_useRAF__WEBPACK_IMPORTED_MODULE_3__["default"])(() => setCurrentTime(callback));
  return currentTime;
}

function Provider(_ref) {
  var _replayerRef$current;

  let {
    children,
    replay,
    initialTimeOffset = 0,
    value = {}
  } = _ref;
  const events = replay === null || replay === void 0 ? void 0 : replay.getRRWebEvents();
  const theme = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_5__.a)();
  const oldEvents = (0,sentry_utils_usePrevious__WEBPACK_IMPORTED_MODULE_4__["default"])(events); // Note we have to check this outside of hooks, see `usePrevious` comments

  const hasNewEvents = events !== oldEvents;
  const replayerRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
  const [dimensions, setDimensions] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
    height: 0,
    width: 0
  });
  const [currentHoverTime, setCurrentHoverTime] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)();
  const [isPlaying, setIsPlaying] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const [finishedAtMS, setFinishedAtMS] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(-1);
  const [isSkippingInactive, setIsSkippingInactive] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
  const [speed, setSpeedState] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(1);
  const [fastForwardSpeed, setFFSpeed] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0);
  const [buffer, setBufferTime] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)({
    target: -1,
    previous: -1
  });
  const playTimer = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(undefined);
  const unMountedRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(false);
  const isFinished = ((_replayerRef$current = replayerRef.current) === null || _replayerRef$current === void 0 ? void 0 : _replayerRef$current.getCurrentTime()) === finishedAtMS;

  const forceDimensions = dimension => {
    setDimensions(dimension);
  };

  const onFastForwardStart = e => {
    setFFSpeed(e.speed);
  };

  const onFastForwardEnd = () => {
    setFFSpeed(0);
  };

  const highlight = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(_ref2 => {
    let {
      nodeId,
      annotation
    } = _ref2;
    const replayer = replayerRef.current;

    if (!replayer) {
      return;
    }

    (0,sentry_utils_replays_highlightNode__WEBPACK_IMPORTED_MODULE_2__.highlightNode)({
      replayer,
      nodeId,
      annotation
    });
  }, []);
  const clearAllHighlightsCallback = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    const replayer = replayerRef.current;

    if (!replayer) {
      return;
    }

    (0,sentry_utils_replays_highlightNode__WEBPACK_IMPORTED_MODULE_2__.clearAllHighlights)({
      replayer
    });
  }, []);
  const removeHighlight = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(_ref3 => {
    let {
      nodeId
    } = _ref3;
    const replayer = replayerRef.current;

    if (!replayer) {
      return;
    }

    (0,sentry_utils_replays_highlightNode__WEBPACK_IMPORTED_MODULE_2__.removeHighlightedNode)({
      replayer,
      nodeId
    });
  }, []);
  const setReplayFinished = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    var _replayerRef$current$, _replayerRef$current2;

    setFinishedAtMS((_replayerRef$current$ = (_replayerRef$current2 = replayerRef.current) === null || _replayerRef$current2 === void 0 ? void 0 : _replayerRef$current2.getCurrentTime()) !== null && _replayerRef$current$ !== void 0 ? _replayerRef$current$ : -1);
    setIsPlaying(false);
  }, []);
  const initRoot = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(root => {
    if (events === undefined) {
      return;
    }

    if (root === null) {
      return;
    }

    if (replayerRef.current) {
      var _replayerRef$current$2;

      if (!hasNewEvents && !unMountedRef.current) {
        // Already have a player for these events, the parent node must've re-rendered
        return;
      }

      if (((_replayerRef$current$2 = replayerRef.current.iframe.contentDocument) === null || _replayerRef$current$2 === void 0 ? void 0 : _replayerRef$current$2.body.childElementCount) === 0) {
        // If this is true, then no need to clear old iframe as nothing was rendered
        return;
      } // We have new events, need to clear out the old iframe because a new
      // `Replayer` instance is about to be created


      while (root.firstChild) {
        root.removeChild(root.firstChild);
      }
    } // eslint-disable-next-line no-new


    const inst = new rrweb__WEBPACK_IMPORTED_MODULE_6__.Replayer(events, {
      root,
      blockClass: 'sr-block',
      // liveMode: false,
      // triggerFocus: false,
      mouseTail: {
        duration: 0.75 * 1000,
        lineCap: 'round',
        lineWidth: 2,
        strokeStyle: theme.purple200
      },
      // unpackFn: _ => _,
      // plugins: [],
      skipInactive: true
    }); // @ts-expect-error: rrweb types event handlers with `unknown` parameters

    inst.on(rrweb__WEBPACK_IMPORTED_MODULE_7__.ReplayerEvents.Resize, forceDimensions);
    inst.on(rrweb__WEBPACK_IMPORTED_MODULE_7__.ReplayerEvents.Finish, setReplayFinished); // @ts-expect-error: rrweb types event handlers with `unknown` parameters

    inst.on(rrweb__WEBPACK_IMPORTED_MODULE_7__.ReplayerEvents.SkipStart, onFastForwardStart);
    inst.on(rrweb__WEBPACK_IMPORTED_MODULE_7__.ReplayerEvents.SkipEnd, onFastForwardEnd); // `.current` is marked as readonly, but it's safe to set the value from
    // inside a `useEffect` hook.
    // See: https://reactjs.org/docs/hooks-faq.html#is-there-something-like-instance-variables
    // @ts-expect-error

    replayerRef.current = inst;

    if (unMountedRef.current) {
      unMountedRef.current = false;
    }
  }, [events, theme.purple200, setReplayFinished, hasNewEvents]);
  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState !== 'visible') {
        var _replayerRef$current3;

        (_replayerRef$current3 = replayerRef.current) === null || _replayerRef$current3 === void 0 ? void 0 : _replayerRef$current3.pause();
      }
    };

    if (replayerRef.current && events) {
      initRoot(replayerRef.current.wrapper.parentElement);
      document.addEventListener('visibilitychange', handleVisibilityChange);
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [initRoot, events]);
  const getCurrentTime = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => replayerRef.current ? Math.max(replayerRef.current.getCurrentTime(), 0) : 0, []);
  const setCurrentTime = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(requestedTimeMs => {
    var _replayerRef$current4;

    const replayer = replayerRef.current;

    if (!replayer) {
      return;
    }

    const maxTimeMs = (_replayerRef$current4 = replayerRef.current) === null || _replayerRef$current4 === void 0 ? void 0 : _replayerRef$current4.getMetaData().totalTime;
    const time = requestedTimeMs > maxTimeMs ? 0 : requestedTimeMs; // Sometimes rrweb doesn't get to the exact target time, as long as it has
    // changed away from the previous time then we can hide then buffering message.

    setBufferTime({
      target: time,
      previous: getCurrentTime()
    }); // Clear previous timers. Without this (but with the setTimeout) multiple
    // requests to set the currentTime could finish out of order and cause jumping.

    if (playTimer.current) {
      window.clearTimeout(playTimer.current);
    }

    if (isPlaying) {
      playTimer.current = window.setTimeout(() => replayer.play(time), 0);
      setIsPlaying(true);
    } else {
      playTimer.current = window.setTimeout(() => replayer.pause(time), 0);
      setIsPlaying(false);
    }
  }, [getCurrentTime, isPlaying]);
  const setSpeed = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(newSpeed => {
    const replayer = replayerRef.current;

    if (!replayer) {
      return;
    }

    if (isPlaying) {
      replayer.pause();
      replayer.setConfig({
        speed: newSpeed
      });
      replayer.play(getCurrentTime());
    } else {
      replayer.setConfig({
        speed: newSpeed
      });
    }

    setSpeedState(newSpeed);
  }, [getCurrentTime, isPlaying]);
  const togglePlayPause = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(play => {
    const replayer = replayerRef.current;

    if (!replayer) {
      return;
    }

    if (play) {
      replayer.play(getCurrentTime());
    } else {
      replayer.pause(getCurrentTime());
    }

    setIsPlaying(play);
  }, [getCurrentTime]);
  const restart = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(() => {
    if (replayerRef.current) {
      replayerRef.current.play(0);
      setIsPlaying(true);
    }
  }, []);
  const toggleSkipInactive = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(skip => {
    const replayer = replayerRef.current;

    if (!replayer) {
      return;
    }

    if (skip !== replayer.config.skipInactive) {
      replayer.setConfig({
        skipInactive: skip
      });
    }

    setIsSkippingInactive(skip);
  }, []); // Only on pageload: set the initial playback timestamp

  (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    if (initialTimeOffset && events && replayerRef.current) {
      setCurrentTime(initialTimeOffset * 1000);
    }

    return () => {
      unMountedRef.current = true;
    };
  }, [events, replayerRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  const currentPlayerTime = useCurrentTime(getCurrentTime);
  const [isBuffering, currentTime] = buffer.target !== -1 && buffer.previous === currentPlayerTime && buffer.target !== buffer.previous ? [true, buffer.target] : [false, currentPlayerTime];

  if (!isBuffering && buffer.target !== -1) {
    setBufferTime({
      target: -1,
      previous: -1
    });
  }

  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_8__.jsx)(ReplayPlayerContext.Provider, {
    value: {
      clearAllHighlights: clearAllHighlightsCallback,
      currentHoverTime,
      currentTime,
      dimensions,
      fastForwardSpeed,
      highlight,
      initRoot,
      isBuffering,
      isFinished,
      isPlaying,
      isSkippingInactive,
      removeHighlight,
      replay,
      restart,
      setCurrentHoverTime,
      setCurrentTime,
      setSpeed,
      speed,
      togglePlayPause,
      toggleSkipInactive,
      ...value
    },
    children: children
  });
}
Provider.displayName = "Provider";
const useReplayContext = () => (0,react__WEBPACK_IMPORTED_MODULE_1__.useContext)(ReplayPlayerContext);

/***/ }),

/***/ "./app/components/replays/utils.tsx":
/*!******************************************!*\
  !*** ./app/components/replays/utils.tsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "countColumns": () => (/* binding */ countColumns),
/* harmony export */   "divide": () => (/* binding */ divide),
/* harmony export */   "flattenSpans": () => (/* binding */ flattenSpans),
/* harmony export */   "formatTime": () => (/* binding */ formatTime),
/* harmony export */   "getCrumbsByColumn": () => (/* binding */ getCrumbsByColumn),
/* harmony export */   "relativeTimeInMs": () => (/* binding */ relativeTimeInMs),
/* harmony export */   "showPlayerTime": () => (/* binding */ showPlayerTime)
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "../node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash_padStart__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash/padStart */ "../node_modules/lodash/padStart.js");
/* harmony import */ var lodash_padStart__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash_padStart__WEBPACK_IMPORTED_MODULE_1__);



function padZero(num) {
  let len = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
  const str = String(num);
  return lodash_padStart__WEBPACK_IMPORTED_MODULE_1___default()(str, len, '0');
}

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
/**
 * @param timestamp The timestamp that is our reference point. Can be anything that `moment` accepts such as `'2022-05-04T19:47:52.915000Z'` or `1651664872.915`
 * @param diffMs Number of milliseconds to adjust the timestamp by, either positive (future) or negative (past)
 * @returns Unix timestamp of the adjusted timestamp, in milliseconds
 */

function relativeTimeInMs(timestamp, diffMs) {
  return Math.abs(new Date(timestamp).getTime() - diffMs);
}
function showPlayerTime(timestamp, relativeTimeMs) {
  let showMs = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  return formatTime(relativeTimeInMs(timestamp, relativeTimeMs), showMs);
} // TODO: move into 'sentry/utils/formatters'

function formatTime(ms, showMs) {
  if (ms <= 0 || isNaN(ms)) {
    if (showMs) {
      return '00:00.000';
    }

    return '00:00';
  }

  const hour = Math.floor(ms / HOUR);
  ms = ms % HOUR;
  const minute = Math.floor(ms / MINUTE);
  ms = ms % MINUTE;
  const second = Math.floor(ms / SECOND);
  let formattedTime = '00:00';

  if (hour) {
    formattedTime = `${padZero(hour)}:${padZero(minute)}:${padZero(second)}`;
  } else {
    formattedTime = `${padZero(minute)}:${padZero(second)}`;
  }

  if (showMs) {
    const milliseconds = Math.floor(ms % SECOND);
    formattedTime = `${formattedTime}.${padZero(milliseconds, 3)}`;
  }

  return formattedTime;
}
/**
 * Figure out how many ticks to show in an area.
 * If there is more space available, we can show more granular ticks, but if
 * less space is available, fewer ticks.
 * Similarly if the duration is short, the ticks will represent a short amount
 * of time (like every second) but if the duration is long one tick may
 * represent an hour.
 *
 * @param durationMs The amount of time that we need to chop up into even sections
 * @param width Total width available, pixels
 * @param minWidth Minimum space for each column, pixels. Ex: So we can show formatted time like `1:00:00` between major ticks
 * @returns
 */

function countColumns(durationMs, width) {
  let minWidth = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 50;
  let maxCols = Math.floor(width / minWidth);
  const remainder = durationMs - maxCols * width > 0 ? 1 : 0;
  maxCols -= remainder; // List of all the possible time granularities to display
  // We could generate the list, which is basically a version of fizzbuzz, hard-coding is quicker.

  const timeOptions = [1 * HOUR, 30 * MINUTE, 20 * MINUTE, 15 * MINUTE, 10 * MINUTE, 5 * MINUTE, 2 * MINUTE, 1 * MINUTE, 30 * SECOND, 10 * SECOND, 5 * SECOND, 1 * SECOND];
  const timeBasedCols = timeOptions.reduce((map, time) => {
    map.set(time, Math.floor(durationMs / time));
    return map;
  }, new Map());
  const [timespan, cols] = Array.from(timeBasedCols.entries()).filter(_ref => {
    let [_span, c] = _ref;
    return c <= maxCols;
  }) // Filter for any valid timespan option where all ticks would fit
  .reduce((best, next) => next[1] > best[1] ? next : best, [0, 0]); // select the timespan option with the most ticks

  const remaining = (durationMs - timespan * cols) / timespan;
  return {
    timespan,
    cols,
    remaining
  };
}
/**
 * Group Crumbs for display along the timeline.
 *
 * The timeline is broken down into columns (aka buckets, or time-slices).
 * Columns translate to a fixed width on the screen, to prevent side-scrolling.
 *
 * This function groups crumbs into columns based on the number of columns available
 * and the timestamp of the crumb.
 */

function getCrumbsByColumn(startTimestampMs, durationMs, crumbs, totalColumns) {
  const safeDurationMs = isNaN(durationMs) ? 1 : durationMs;
  const columnCrumbPairs = crumbs.map(breadcrumb => {
    const {
      timestamp
    } = breadcrumb;
    const timestampMilliSeconds = +new Date(String(timestamp));
    const sinceStart = isNaN(timestampMilliSeconds) ? 0 : timestampMilliSeconds - startTimestampMs;
    const columnPositionCalc = Math.floor(sinceStart / safeDurationMs * (totalColumns - 1)) + 1; // Should start at minimum in the first column

    const column = Math.max(1, columnPositionCalc);
    return [column, breadcrumb];
  });
  const crumbsByColumn = columnCrumbPairs.reduce((map, _ref2) => {
    let [column, breadcrumb] = _ref2;

    if (map.has(column)) {
      var _map$get;

      (_map$get = map.get(column)) === null || _map$get === void 0 ? void 0 : _map$get.push(breadcrumb);
    } else {
      map.set(column, [breadcrumb]);
    }

    return map;
  }, new Map());
  return crumbsByColumn;
}

function doesOverlap(a, b) {
  const bStartsWithinA = a.startTimestamp <= b.startTimestamp && b.startTimestamp <= a.endTimestamp;
  const bEndsWithinA = a.startTimestamp <= b.endTimestamp && b.endTimestamp <= a.endTimestamp;
  return bStartsWithinA || bEndsWithinA;
}

function flattenSpans(rawSpans) {
  if (!rawSpans.length) {
    return [];
  }

  const spans = rawSpans.map(span => {
    const startTimestamp = span.startTimestamp * 1000; // `endTimestamp` is at least msPerPixel wide, otherwise it disappears

    const endTimestamp = span.endTimestamp * 1000;
    return {
      spanCount: 1,
      // spanId: span.span_id,
      startTimestamp,
      endTimestamp,
      duration: endTimestamp - startTimestamp
    };
  });
  const [firstSpan, ...restSpans] = spans;
  const flatSpans = [firstSpan];

  for (const span of restSpans) {
    let overlap = false;

    for (const fspan of flatSpans) {
      if (doesOverlap(fspan, span)) {
        overlap = true;
        fspan.spanCount += 1;
        fspan.startTimestamp = Math.min(fspan.startTimestamp, span.startTimestamp);
        fspan.endTimestamp = Math.max(fspan.endTimestamp, span.endTimestamp);
        fspan.duration = fspan.endTimestamp - fspan.startTimestamp;
        break;
      }
    }

    if (!overlap) {
      flatSpans.push(span);
    }
  }

  return flatSpans;
}
/**
 * Divide two numbers safely
 */

function divide(numerator, denominator) {
  if (denominator === undefined || isNaN(denominator) || denominator === 0) {
    return 0;
  }

  return numerator / denominator;
}

/***/ }),

/***/ "./app/components/replays/walker/chevronDividedList.tsx":
/*!**************************************************************!*\
  !*** ./app/components/replays/walker/chevronDividedList.tsx ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/styled/base */ "../node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js");
/* harmony import */ var sentry_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sentry/icons */ "./app/icons/index.tsx");
/* harmony import */ var sentry_styles_space__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sentry/styles/space */ "./app/styles/space.tsx");
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js");


function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }





function ChevronDividedList(_ref) {
  let {
    items
  } = _ref;
  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(List, {
    cols: items.length,
    children: items.flatMap((item, i) => {
      const li = (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Item, {
        children: item
      }, `${i}-item`);

      return i === 0 ? li : [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Item, {
        children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(Chevron, {
          children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(sentry_icons__WEBPACK_IMPORTED_MODULE_1__.IconChevron, {
            color: "gray300",
            size: "xs",
            direction: "right"
          })
        })
      }, `${i}-chev`), li];
    })
  });
}

ChevronDividedList.displayName = "ChevronDividedList";

const List = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])('ul',  true ? {
  target: "e1k88cjg2"
} : 0)("padding:0;margin:0;list-style:none;display:grid;gap:", (0,sentry_styles_space__WEBPACK_IMPORTED_MODULE_2__["default"])(1), ";grid-template-columns:", p => `minmax(auto, max-content) repeat(${(p.cols - 2) * 2 + 1}, max-content) minmax(auto, max-content)`, ";flex-wrap:nowrap;align-items:center;overflow:hidden;" + ( true ? "" : 0));

const Item = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])('li',  true ? {
  target: "e1k88cjg1"
} : 0)( true ? {
  name: "jc8dhw",
  styles: "display:flex;flex-direction:column;overflow:hidden"
} : 0);

const Chevron = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])('span',  true ? {
  target: "e1k88cjg0"
} : 0)("color:", p => p.theme.gray300, ";font-size:", p => p.theme.fontSizeSmall, ";line-height:1;" + ( true ? "" : 0));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChevronDividedList);

/***/ }),

/***/ "./app/components/replays/walker/splitCrumbs.tsx":
/*!*******************************************************!*\
  !*** ./app/components/replays/walker/splitCrumbs.tsx ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/styled/base */ "../node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "../node_modules/react/index.js");
/* harmony import */ var lodash_first__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/first */ "../node_modules/lodash/first.js");
/* harmony import */ var lodash_first__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_first__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var lodash_last__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! lodash/last */ "../node_modules/lodash/last.js");
/* harmony import */ var lodash_last__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(lodash_last__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var sentry_components_hovercard__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! sentry/components/hovercard */ "./app/components/hovercard.tsx");
/* harmony import */ var sentry_components_textOverflow__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! sentry/components/textOverflow */ "./app/components/textOverflow.tsx");
/* harmony import */ var sentry_components_tooltip__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! sentry/components/tooltip */ "./app/components/tooltip.tsx");
/* harmony import */ var sentry_locale__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! sentry/locale */ "./app/locale.tsx");
/* harmony import */ var sentry_styles_space__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! sentry/styles/space */ "./app/styles/space.tsx");
/* harmony import */ var sentry_views_replays_detail_breadcrumbs_breadcrumbItem__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! sentry/views/replays/detail/breadcrumbs/breadcrumbItem */ "./app/views/replays/detail/breadcrumbs/breadcrumbItem.tsx");
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js");












function splitCrumbs(_ref) {
  var _first, _first$data, _last, _last$data;

  let {
    crumbs,
    onClick,
    startTimestampMs
  } = _ref;
  const firstUrl = (_first = lodash_first__WEBPACK_IMPORTED_MODULE_2___default()(crumbs)) === null || _first === void 0 ? void 0 : (_first$data = _first.data) === null || _first$data === void 0 ? void 0 : _first$data.to;
  const summarizedCrumbs = crumbs.slice(1, -1);
  const lastUrl = (_last = lodash_last__WEBPACK_IMPORTED_MODULE_3___default()(crumbs)) === null || _last === void 0 ? void 0 : (_last$data = _last.data) === null || _last$data === void 0 ? void 0 : _last$data.to;

  if (crumbs.length === 0) {
    // This one shouldn't overflow, but by including the component css stays
    // consistent with the other Segment types
    return [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(Span, {
      children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(sentry_components_textOverflow__WEBPACK_IMPORTED_MODULE_5__["default"], {
        children: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_7__.tn)('%s Page', '%s Pages', 0)
      })
    }, "summary")];
  }

  if (crumbs.length > 3) {
    return [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(SingleLinkSegment, {
      path: firstUrl,
      onClick: onClick ? () => onClick(lodash_first__WEBPACK_IMPORTED_MODULE_2___default()(crumbs)) : null
    }, "first"), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(SummarySegment, {
      crumbs: summarizedCrumbs,
      startTimestampMs: startTimestampMs,
      handleOnClick: onClick
    }, "summary"), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(SingleLinkSegment, {
      path: lastUrl,
      onClick: onClick ? () => onClick(lodash_last__WEBPACK_IMPORTED_MODULE_3___default()(crumbs)) : null
    }, "last")];
  }

  return crumbs.map((crumb, i) => (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(SingleLinkSegment, {
    path: firstUrl,
    onClick: onClick ? () => onClick(crumb) : null
  }, i));
}

function SingleLinkSegment(_ref2) {
  let {
    onClick,
    path
  } = _ref2;

  if (!path) {
    return null;
  }

  const content = (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(sentry_components_tooltip__WEBPACK_IMPORTED_MODULE_6__["default"], {
    title: path,
    children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(sentry_components_textOverflow__WEBPACK_IMPORTED_MODULE_5__["default"], {
      ellipsisDirection: "left",
      children: path
    })
  });

  if (onClick) {
    return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(Link, {
      href: "#",
      onClick: onClick,
      children: content
    });
  }

  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(Span, {
    children: content
  });
}

SingleLinkSegment.displayName = "SingleLinkSegment";

function SummarySegment(_ref3) {
  let {
    crumbs,
    handleOnClick,
    startTimestampMs
  } = _ref3;
  const summaryItems = crumbs.map(crumb => (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(sentry_views_replays_detail_breadcrumbs_breadcrumbItem__WEBPACK_IMPORTED_MODULE_9__["default"], {
    crumb: crumb,
    startTimestampMs: startTimestampMs,
    isHovered: false,
    isSelected: false,
    onClick: handleOnClick
  }, crumb.id));
  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(Span, {
    children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(HalfPaddingHovercard, {
      body: summaryItems,
      position: "right",
      children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(sentry_components_textOverflow__WEBPACK_IMPORTED_MODULE_5__["default"], {
        children: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_7__.tn)('%s Page', '%s Pages', summaryItems.length)
      })
    })
  });
}

SummarySegment.displayName = "SummarySegment";

const Span = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])('span',  true ? {
  target: "efcvq592"
} : 0)("color:", p => p.theme.subText, ";font-size:", p => p.theme.fontSizeSmall, ";line-height:0;" + ( true ? "" : 0));

const Link = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])('a',  true ? {
  target: "efcvq591"
} : 0)("color:", p => p.theme.subText, ";font-size:", p => p.theme.fontSizeSmall, ";line-height:0;text-decoration:underline;" + ( true ? "" : 0));

const HalfPaddingHovercard = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])(_ref4 => {
  let {
    children,
    bodyClassName,
    ...props
  } = _ref4;
  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(sentry_components_hovercard__WEBPACK_IMPORTED_MODULE_4__.Hovercard, {
    bodyClassName: bodyClassName || '' + ' half-padding',
    ...props,
    children: children
  });
},  true ? {
  target: "efcvq590"
} : 0)(".half-padding{padding:", (0,sentry_styles_space__WEBPACK_IMPORTED_MODULE_8__["default"])(0.5), ";}" + ( true ? "" : 0));

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (splitCrumbs);

/***/ }),

/***/ "./app/components/replays/walker/urlWalker.tsx":
/*!*****************************************************!*\
  !*** ./app/components/replays/walker/urlWalker.tsx ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CrumbWalker": () => (/* binding */ CrumbWalker),
/* harmony export */   "StringWalker": () => (/* binding */ StringWalker)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../node_modules/react/index.js");
/* harmony import */ var sentry_components_replays_replayContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! sentry/components/replays/replayContext */ "./app/components/replays/replayContext.tsx");
/* harmony import */ var sentry_components_replays_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sentry/components/replays/utils */ "./app/components/replays/utils.tsx");
/* harmony import */ var sentry_components_replays_walker_chevronDividedList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! sentry/components/replays/walker/chevronDividedList */ "./app/components/replays/walker/chevronDividedList.tsx");
/* harmony import */ var sentry_components_replays_walker_splitCrumbs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! sentry/components/replays/walker/splitCrumbs */ "./app/components/replays/walker/splitCrumbs.tsx");
/* harmony import */ var sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! sentry/types/breadcrumbs */ "./app/types/breadcrumbs.tsx");
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js");







const CrumbWalker = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(function CrumbWalker(_ref) {
  let {
    crumbs,
    replayRecord
  } = _ref;
  const {
    setCurrentTime
  } = (0,sentry_components_replays_replayContext__WEBPACK_IMPORTED_MODULE_1__.useReplayContext)();
  const startTimestampMs = replayRecord.startedAt.getTime();
  const handleClick = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(crumb => {
    crumb.timestamp !== undefined ? setCurrentTime((0,sentry_components_replays_utils__WEBPACK_IMPORTED_MODULE_2__.relativeTimeInMs)(crumb.timestamp, startTimestampMs)) : null;
  }, [setCurrentTime, startTimestampMs]);
  const navCrumbs = crumbs.filter(crumb => crumb.type === sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__.BreadcrumbType.NAVIGATION);
  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(sentry_components_replays_walker_chevronDividedList__WEBPACK_IMPORTED_MODULE_3__["default"], {
    items: (0,sentry_components_replays_walker_splitCrumbs__WEBPACK_IMPORTED_MODULE_4__["default"])({
      crumbs: navCrumbs,
      startTimestampMs,
      onClick: handleClick
    })
  });
});
const StringWalker = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_0__.memo)(function StringWalker(_ref2) {
  let {
    urls
  } = _ref2;
  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(sentry_components_replays_walker_chevronDividedList__WEBPACK_IMPORTED_MODULE_3__["default"], {
    items: (0,sentry_components_replays_walker_splitCrumbs__WEBPACK_IMPORTED_MODULE_4__["default"])({
      crumbs: urls.map(urlToCrumb),
      startTimestampMs: 0,
      onClick: null
    })
  });
});

function urlToCrumb(url) {
  return {
    type: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__.BreadcrumbType.NAVIGATION,
    category: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__.BreadcrumbType.NAVIGATION,
    level: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__.BreadcrumbLevelType.INFO,
    description: 'Navigation',
    id: 0,
    color: 'green300',
    timestamp: undefined,
    data: {
      to: url
    }
  };
}

/***/ }),

/***/ "./app/types/breadcrumbs.tsx":
/*!***********************************!*\
  !*** ./app/types/breadcrumbs.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BreadcrumbLevelType": () => (/* binding */ BreadcrumbLevelType),
/* harmony export */   "BreadcrumbType": () => (/* binding */ BreadcrumbType),
/* harmony export */   "isBreadcrumbTypeDefault": () => (/* binding */ isBreadcrumbTypeDefault)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ "../node_modules/core-js/modules/es.array.includes.js");
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);

let BreadcrumbLevelType;

(function (BreadcrumbLevelType) {
  BreadcrumbLevelType["FATAL"] = "fatal";
  BreadcrumbLevelType["ERROR"] = "error";
  BreadcrumbLevelType["WARNING"] = "warning";
  BreadcrumbLevelType["INFO"] = "info";
  BreadcrumbLevelType["DEBUG"] = "debug";
  BreadcrumbLevelType["UNDEFINED"] = "undefined";
  BreadcrumbLevelType["LOG"] = "log";
})(BreadcrumbLevelType || (BreadcrumbLevelType = {}));

let BreadcrumbType;

(function (BreadcrumbType) {
  BreadcrumbType["INFO"] = "info";
  BreadcrumbType["DEBUG"] = "debug";
  BreadcrumbType["MESSAGE"] = "message";
  BreadcrumbType["QUERY"] = "query";
  BreadcrumbType["UI"] = "ui";
  BreadcrumbType["USER"] = "user";
  BreadcrumbType["EXCEPTION"] = "exception";
  BreadcrumbType["WARNING"] = "warning";
  BreadcrumbType["ERROR"] = "error";
  BreadcrumbType["DEFAULT"] = "default";
  BreadcrumbType["HTTP"] = "http";
  BreadcrumbType["NAVIGATION"] = "navigation";
  BreadcrumbType["SYSTEM"] = "system";
  BreadcrumbType["SESSION"] = "session";
  BreadcrumbType["TRANSACTION"] = "transaction";
  BreadcrumbType["INIT"] = "init";
})(BreadcrumbType || (BreadcrumbType = {}));

function isBreadcrumbTypeDefault(breadcrumb) {
  return ![BreadcrumbType.HTTP, BreadcrumbType.NAVIGATION].includes(breadcrumb.type);
}

/***/ }),

/***/ "./app/utils/replays/highlightNode.tsx":
/*!*********************************************!*\
  !*** ./app/utils/replays/highlightNode.tsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "clearAllHighlights": () => (/* binding */ clearAllHighlights),
/* harmony export */   "highlightNode": () => (/* binding */ highlightNode),
/* harmony export */   "removeHighlightedNode": () => (/* binding */ removeHighlightedNode)
/* harmony export */ });
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "../node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_0__);

const DEFAULT_HIGHLIGHT_COLOR = 'rgba(168, 196, 236, 0.75)';
const highlightsByNodeId = new Map();
function clearAllHighlights(_ref) {
  let {
    replayer
  } = _ref;

  for (const nodeId of highlightsByNodeId.keys()) {
    removeHighlightedNode({
      replayer,
      nodeId
    });
  }
}
/**
 * Remove the canvas that has the highlight for a node.
 *
 * XXX: This is potentially not good if we have a lot of highlights, as we
 * are creating a new canvas PER highlight.
 */

function removeHighlightedNode(_ref2) {
  let {
    replayer,
    nodeId
  } = _ref2;

  if (!highlightsByNodeId.has(nodeId)) {
    return false;
  }

  const highlightObj = highlightsByNodeId.get(nodeId);

  if (!highlightObj || !replayer.wrapper.contains(highlightObj.canvas)) {
    return false;
  }

  replayer.wrapper.removeChild(highlightObj.canvas);
  highlightsByNodeId.delete(nodeId);
  return true;
}
/**
 * Attempt to highlight the node inside of a replay recording
 */

function highlightNode(_ref3) {
  var _replayer$iframe$cont, _replayer$iframe$cont2;

  let {
    replayer,
    nodeId,
    annotation = '',
    color
  } = _ref3;
  // @ts-expect-error mouseTail is private
  const {
    mouseTail,
    wrapper
  } = replayer;
  const mirror = replayer.getMirror();
  const node = mirror.getNode(nodeId); // TODO(replays): There is some sort of race condition here when you "rewind" a replay,
  // mirror will be empty and highlight does not get added because node is null

  if (!node || !((_replayer$iframe$cont = replayer.iframe.contentDocument) !== null && _replayer$iframe$cont !== void 0 && (_replayer$iframe$cont2 = _replayer$iframe$cont.body) !== null && _replayer$iframe$cont2 !== void 0 && _replayer$iframe$cont2.contains(node))) {
    return null;
  } // @ts-ignore This builds locally, but fails in CI -- ignoring for now


  const {
    top,
    left,
    width,
    height
  } = node.getBoundingClientRect();
  const highlightColor = color !== null && color !== void 0 ? color : DEFAULT_HIGHLIGHT_COLOR; // Clone the mouseTail canvas as it has the dimensions and position that we
  // want on top of the replay. We may need to revisit this strategy as we
  // create a new canvas for every highlight. See additional notes in
  // removeHighlight() method.

  const canvas = mouseTail.cloneNode();
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  } // TODO(replays): Does not account for scrolling (should we attempt to keep highlight visible, or does it disappear)
  // Draw a rectangle to highlight element


  ctx.fillStyle = highlightColor;
  ctx.fillRect(left, top, width, height); // Draw a dashed border around highlight

  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(left, top);
  ctx.lineTo(left + width, top);
  ctx.lineTo(left + width, top + height);
  ctx.lineTo(left, top + height);
  ctx.closePath();
  ctx.stroke();
  ctx.font = '24px Rubik';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';
  const textWidth = ctx.measureText(annotation).width; // Draw rect around text

  ctx.fillStyle = 'rgba(30, 30, 30, 0.75)';
  ctx.fillRect(left + width - textWidth, top + height - 30, textWidth, 30); // Draw text

  ctx.fillStyle = 'white';
  ctx.fillText(annotation, left + width, top + height);
  highlightsByNodeId.set(nodeId, {
    canvas
  });
  wrapper.insertBefore(canvas, mouseTail);
  return {
    canvas
  };
}

/***/ }),

/***/ "./app/utils/replays/hooks/useRAF.tsx":
/*!********************************************!*\
  !*** ./app/utils/replays/hooks/useRAF.tsx ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useRAF)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../node_modules/react/index.js");
 // TODO: move into app/utils/*

function useRAF(callback) {
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const timer = window.requestAnimationFrame(callback);
    return () => window.cancelAnimationFrame(timer);
  }, [callback]);
}

/***/ }),

/***/ "./app/utils/replays/replayDataUtils.tsx":
/*!***********************************************!*\
  !*** ./app/utils/replays/replayDataUtils.tsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "breadcrumbFactory": () => (/* binding */ breadcrumbFactory),
/* harmony export */   "mapResponseToReplayRecord": () => (/* binding */ mapResponseToReplayRecord),
/* harmony export */   "replayTimestamps": () => (/* binding */ replayTimestamps),
/* harmony export */   "rrwebEventListFactory": () => (/* binding */ rrwebEventListFactory),
/* harmony export */   "spansFactory": () => (/* binding */ spansFactory)
/* harmony export */ });
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es.array.includes.js */ "../node_modules/core-js/modules/es.array.includes.js");
/* harmony import */ var core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es_array_includes_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/web.dom-collections.iterator.js */ "../node_modules/core-js/modules/web.dom-collections.iterator.js");
/* harmony import */ var core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_collections_iterator_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_first__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash/first */ "../node_modules/lodash/first.js");
/* harmony import */ var lodash_first__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_first__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var sentry_components_events_interfaces_breadcrumbs_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! sentry/components/events/interfaces/breadcrumbs/utils */ "./app/components/events/interfaces/breadcrumbs/utils.tsx");
/* harmony import */ var sentry_locale__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! sentry/locale */ "./app/locale.tsx");
/* harmony import */ var sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! sentry/types/breadcrumbs */ "./app/types/breadcrumbs.tsx");






function mapResponseToReplayRecord(apiResponse) {
  return { ...apiResponse,
    ...(apiResponse.startedAt ? {
      startedAt: new Date(apiResponse.startedAt)
    } : {}),
    ...(apiResponse.finishedAt ? {
      finishedAt: new Date(apiResponse.finishedAt)
    } : {}),
    user: {
      email: apiResponse.user.email || '',
      id: apiResponse.user.id || '',
      ip_address: apiResponse.user.ip_address || '',
      name: apiResponse.user.name || '',
      username: ''
    }
  };
}
function rrwebEventListFactory(replayRecord, rrwebEvents) {
  const events = [].concat(rrwebEvents).concat({
    type: 5,
    // EventType.Custom,
    timestamp: replayRecord.finishedAt.getTime(),
    data: {
      tag: 'replay-end'
    }
  });
  events.sort((a, b) => a.timestamp - b.timestamp);
  const firstRRWebEvent = lodash_first__WEBPACK_IMPORTED_MODULE_2___default()(events);
  firstRRWebEvent.timestamp = replayRecord.startedAt.getTime();
  return events;
}
function breadcrumbFactory(replayRecord, errors, rawCrumbs, spans) {
  const initialUrl = replayRecord.tags.url;
  const initBreadcrumb = {
    type: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__.BreadcrumbType.INIT,
    timestamp: replayRecord.startedAt.toISOString(),
    level: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__.BreadcrumbLevelType.INFO,
    message: initialUrl,
    data: {
      action: 'replay-init',
      label: (0,sentry_locale__WEBPACK_IMPORTED_MODULE_4__.t)('Start recording'),
      url: initialUrl
    }
  };
  const errorCrumbs = errors.map(error => ({
    type: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__.BreadcrumbType.ERROR,
    level: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__.BreadcrumbLevelType.ERROR,
    category: 'exception',
    message: error['error.value'],
    data: {
      label: error['error.type']
    },
    timestamp: error.timestamp
  }));
  const spanCrumbs = spans.filter(span => ['navigation.navigate', 'navigation.reload', 'largest-contentful-paint'].includes(span.op)).map(span => {
    if (span.op.startsWith('navigation')) {
      const [, action] = span.op.split('.');
      return {
        category: 'default',
        type: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__.BreadcrumbType.NAVIGATION,
        timestamp: new Date(span.startTimestamp * 1000).toISOString(),
        level: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__.BreadcrumbLevelType.INFO,
        message: span.description,
        action,
        data: {
          to: span.description,
          label: action === 'reload' ? (0,sentry_locale__WEBPACK_IMPORTED_MODULE_4__.t)('Reload') : action === 'navigate' ? (0,sentry_locale__WEBPACK_IMPORTED_MODULE_4__.t)('Page load') : (0,sentry_locale__WEBPACK_IMPORTED_MODULE_4__.t)('Navigation'),
          ...span.data
        }
      };
    }

    return {
      type: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__.BreadcrumbType.DEBUG,
      timestamp: new Date(span.startTimestamp * 1000).toISOString(),
      level: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__.BreadcrumbLevelType.INFO,
      category: 'default',
      data: {
        action: span.op,
        ...span.data,
        label: span.op === 'largest-contentful-paint' ? (0,sentry_locale__WEBPACK_IMPORTED_MODULE_4__.t)('LCP') : span.op
      }
    };
  });
  const hasPageLoad = spans.find(span => span.op === 'navigation.navigate');
  const result = (0,sentry_components_events_interfaces_breadcrumbs_utils__WEBPACK_IMPORTED_MODULE_3__.transformCrumbs)([...(!hasPageLoad ? [initBreadcrumb] : []), ...rawCrumbs.map(_ref => {
    let {
      timestamp,
      ...crumb
    } = _ref;
    return { ...crumb,
      type: sentry_types_breadcrumbs__WEBPACK_IMPORTED_MODULE_5__.BreadcrumbType.DEFAULT,
      timestamp: new Date(timestamp * 1000).toISOString()
    };
  }), ...errorCrumbs, ...spanCrumbs]);
  return result.sort((a, b) => +new Date(a.timestamp || 0) - +new Date(b.timestamp || 0));
}
function spansFactory(spans) {
  return spans.sort((a, b) => a.startTimestamp - b.startTimestamp);
}
/**
 * We need to figure out the real start and end timestamps based on when
 * first and last bits of data were collected. In milliseconds.
 *
 * @deprecated Once the backend returns the corrected timestamps, this is not needed.
 */

function replayTimestamps(rrwebEvents, rawCrumbs, rawSpanData) {
  const rrwebTimestamps = rrwebEvents.map(event => event.timestamp);
  const breadcrumbTimestamps = rawCrumbs.map(rawCrumb => rawCrumb.timestamp).filter(Boolean).map(timestamp => +new Date(timestamp * 1000));
  const spanStartTimestamps = rawSpanData.map(span => span.startTimestamp * 1000);
  const spanEndTimestamps = rawSpanData.map(span => span.endTimestamp * 1000);
  return {
    startTimestampMs: Math.min(...[...rrwebTimestamps, ...breadcrumbTimestamps, ...spanStartTimestamps]),
    endTimestampMs: Math.max(...[...rrwebTimestamps, ...breadcrumbTimestamps, ...spanEndTimestamps])
  };
}

/***/ }),

/***/ "./app/utils/useLocation.tsx":
/*!***********************************!*\
  !*** ./app/utils/useLocation.tsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "useLocation": () => (/* binding */ useLocation)
/* harmony export */ });
/* harmony import */ var sentry_utils_useRouteContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! sentry/utils/useRouteContext */ "./app/utils/useRouteContext.tsx");

function useLocation() {
  const route = (0,sentry_utils_useRouteContext__WEBPACK_IMPORTED_MODULE_0__.useRouteContext)();
  return route.location;
}

/***/ }),

/***/ "./app/views/replays/detail/breadcrumbs/breadcrumbItem.tsx":
/*!*****************************************************************!*\
  !*** ./app/views/replays/detail/breadcrumbs/breadcrumbItem.tsx ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @emotion/styled/base */ "../node_modules/@emotion/styled/base/dist/emotion-styled-base.browser.esm.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "../node_modules/react/index.js");
/* harmony import */ var sentry_components_events_interfaces_breadcrumbs_breadcrumb_type_icon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! sentry/components/events/interfaces/breadcrumbs/breadcrumb/type/icon */ "./app/components/events/interfaces/breadcrumbs/breadcrumb/type/icon.tsx");
/* harmony import */ var sentry_components_panels__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! sentry/components/panels */ "./app/components/panels/index.tsx");
/* harmony import */ var sentry_components_replays_breadcrumbs_utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! sentry/components/replays/breadcrumbs/utils */ "./app/components/replays/breadcrumbs/utils.tsx");
/* harmony import */ var sentry_components_replays_playerRelativeTime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! sentry/components/replays/playerRelativeTime */ "./app/components/replays/playerRelativeTime.tsx");
/* harmony import */ var sentry_styles_space__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! sentry/styles/space */ "./app/styles/space.tsx");
/* harmony import */ var _emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @emotion/react/jsx-runtime */ "../node_modules/@emotion/react/jsx-runtime/dist/emotion-react-jsx-runtime.browser.esm.js");


function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }










function BreadcrumbItem(_ref) {
  let {
    crumb,
    isHovered,
    isSelected,
    startTimestampMs,
    onMouseEnter,
    onMouseLeave,
    onClick
  } = _ref;
  const {
    title,
    description
  } = (0,sentry_components_replays_breadcrumbs_utils__WEBPACK_IMPORTED_MODULE_4__.getDetails)(crumb);
  const handleMouseEnter = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(e => onMouseEnter && onMouseEnter(crumb, e), [onMouseEnter, crumb]);
  const handleMouseLeave = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(e => onMouseLeave && onMouseLeave(crumb, e), [onMouseLeave, crumb]);
  const handleClick = (0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)(e => onClick === null || onClick === void 0 ? void 0 : onClick(crumb, e), [onClick, crumb]);
  return (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(CrumbItem, {
    as: onClick ? 'button' : 'span',
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick,
    isHovered: isHovered,
    isSelected: isSelected,
    "aria-current": isSelected,
    children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(IconWrapper, {
      color: crumb.color,
      children: (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(sentry_components_events_interfaces_breadcrumbs_breadcrumb_type_icon__WEBPACK_IMPORTED_MODULE_2__["default"], {
        type: crumb.type
      })
    }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(CrumbDetails, {
      children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(TitleContainer, {
        children: [(0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Title, {
          children: title
        }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(sentry_components_replays_playerRelativeTime__WEBPACK_IMPORTED_MODULE_5__["default"], {
          relativeTimeMs: startTimestampMs,
          timestamp: crumb.timestamp
        })]
      }), (0,_emotion_react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(Description, {
        title: description,
        children: description
      })]
    })]
  });
}

BreadcrumbItem.displayName = "BreadcrumbItem";

const CrumbDetails = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])('div',  true ? {
  target: "e1kgqibp5"
} : 0)( true ? {
  name: "jc8dhw",
  styles: "display:flex;flex-direction:column;overflow:hidden"
} : 0);

const TitleContainer = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])('div',  true ? {
  target: "e1kgqibp4"
} : 0)("display:flex;justify-content:space-between;gap:", (0,sentry_styles_space__WEBPACK_IMPORTED_MODULE_6__["default"])(1), ";" + ( true ? "" : 0));

const Title = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])('span',  true ? {
  target: "e1kgqibp3"
} : 0)(p => p.theme.overflowEllipsis, ";text-transform:capitalize;font-weight:600;color:", p => p.theme.gray400, ";line-height:", p => p.theme.text.lineHeightBody, ";" + ( true ? "" : 0));

const Description = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])('span',  true ? {
  target: "e1kgqibp2"
} : 0)(p => p.theme.overflowEllipsis, ";font-size:0.7rem;font-variant-numeric:tabular-nums;line-height:", p => p.theme.text.lineHeightBody, ";color:", p => p.theme.subText, ";" + ( true ? "" : 0));

const CrumbItem = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])(sentry_components_panels__WEBPACK_IMPORTED_MODULE_3__.PanelItem,  true ? {
  target: "e1kgqibp1"
} : 0)("display:grid;grid-template-columns:max-content auto;align-items:flex-start;gap:", (0,sentry_styles_space__WEBPACK_IMPORTED_MODULE_6__["default"])(1), ";width:100%;font-size:", p => p.theme.fontSizeMedium, ";background:transparent;padding:", (0,sentry_styles_space__WEBPACK_IMPORTED_MODULE_6__["default"])(1), ";text-align:left;border:none;position:relative;", p => p.isSelected && `background-color: ${p.theme.purple100};`, " ", p => p.isHovered && `background-color: ${p.theme.surface100};`, " border-radius:", p => p.theme.borderRadius, ";&::after{content:'';position:absolute;left:19.5px;width:1px;background:", p => p.theme.gray200, ";height:100%;}&:first-of-type::after{top:", (0,sentry_styles_space__WEBPACK_IMPORTED_MODULE_6__["default"])(1), ";bottom:0;}&:last-of-type::after{top:0;height:", (0,sentry_styles_space__WEBPACK_IMPORTED_MODULE_6__["default"])(1), ";}&:only-of-type::after{height:0;}" + ( true ? "" : 0));
/**
 * Taken `from events/interfaces/.../breadcrumbs/types`
 */


const IconWrapper = /*#__PURE__*/(0,_emotion_styled_base__WEBPACK_IMPORTED_MODULE_0__["default"])('div',  true ? {
  target: "e1kgqibp0"
} : 0)("display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;color:", p => p.theme.white, ";background:", p => {
  var _p$theme$p$color;

  return (_p$theme$p$color = p.theme[p.color]) !== null && _p$theme$p$color !== void 0 ? _p$theme$p$color : p.color;
}, ";box-shadow:", p => p.theme.dropShadowLightest, ";position:relative;z-index:", p => p.theme.zIndex.initial, ";" + ( true ? "" : 0));

const MemoizedBreadcrumbItem = /*#__PURE__*/(0,react__WEBPACK_IMPORTED_MODULE_1__.memo)(BreadcrumbItem);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MemoizedBreadcrumbItem);

/***/ })

}]);
//# sourceMappingURL=../sourcemaps/app_components_replays_walker_urlWalker_tsx-app_utils_replays_replayDataUtils_tsx-app_utils_u-d549a4.9ffe45b526dc9f76e792dcf639d51a37.js.map