/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function (useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if (item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */';
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(8);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(13);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./index.scss", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/index.js!../../node_modules/sass-loader/lib/loader.js!./index.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var _window = window;
var _document = document;
_window.onresize = RemInit;
function RemInit() {
    var c = _document.getElementsByTagName('html')[0];
    var b = c.clientWidth;
    c.style.fontSize = b / 20 / 16 * 100 + 'px';
}
exports.RemInit = RemInit;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(17);
var html = __webpack_require__(14);
var App = (function () {
    function App() {
        this.elemList = [];
        var elemList = document.querySelectorAll('app');
        for (var i = 0, len = elemList.length; i < len; i++) {
            elemList[i].innerHTML = html;
            this.elemList.push(elemList[i]);
        }
    }
    App.prototype.hide = function () {
        this.elemList.forEach(function (elem) { return $(elem).css({ display: 'none' }); });
    };
    App.prototype.show = function () {
        this.elemList.forEach(function (elem) { return $(elem).css({ display: 'block' }); });
    };
    return App;
}());
exports.App = App;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(18);
var html = __webpack_require__(15);
var game = null;
__webpack_require__(24);
__webpack_require__(25);
var _window = window;
var checkRectCollision = _window.ndgmr.checkRectCollision;
var checkPixelCollision = _window.ndgmr.checkPixelCollision;
var player_1 = __webpack_require__(21);
var gameCtrl_1 = __webpack_require__(20);
var devicePixelRatio = window.devicePixelRatio;
var showRatio = 568 / 320;
var Game = (function () {
    function Game() {
        this.elemList = [];
        this.player = new player_1.Player();
        this.gameCtrl = new gameCtrl_1.GameCtrl();
        if (game)
            return game;
        var gameElem = document.createElement('game');
        gameElem.innerHTML = html;
        document.querySelector('body').appendChild(gameElem);
        this.elemList.push(gameElem);
        this.canvas = gameElem.querySelector('#canvas');
        this.initCreatejs();
    }
    Game.prototype.hide = function () {
        this.elemList.forEach(function (elem) { return $(elem).css({ display: 'none' }); });
    };
    Game.prototype.show = function () {
        this.elemList.forEach(function (elem) { return $(elem).css({ display: 'block' }); });
    };
    Game.prototype.initCreatejs = function () {
        var _this = this;
        this.showContainer_height = 850;
        this.showContainer_width = 1500;
        this.canvas.setAttribute('width', this.showContainer_width + '');
        this.canvas.setAttribute('height', (this.showContainer_width / showRatio) + '');
        this.stage = new createjs.Stage(this.canvas);
        setInterval(function () {
            console.log(_this.player.state);
            switch (_this.player.state) {
                case 'run':
                    _this.player.stand();
                    break;
                case 'stand':
                    _this.player.run();
                    break;
            }
        }, 3000);
        this.player.run();
        createjs.Ticker.addEventListener("tick", function (e) { return _this.createjsTicker(e); });
        // createjs.Ticker.setFPS(10); //Deprecated
        createjs.Ticker.framerate = 30;
    };
    Game.prototype.createjsTicker = function (e) {
        var _this = this;
        this.player.removeList.forEach(function (removeObject) {
            _this.stage.removeChild(removeObject);
            _this.player.clearRemoveCache();
        });
        this.player.renderList.forEach(function (renderObject, i) {
            _this.stage.addChild(renderObject);
            _this.player.clearRenderCache();
        });
        this.stage.update();
        // 碰撞检测
        checkRectCollision;
    };
    return Game;
}());
exports.Game = Game;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(19);
var html = __webpack_require__(16);
var OrientationTip = (function () {
    function OrientationTip() {
        if (!document.querySelector('#orientLayer')) {
            var a = document.createElement('orientation-tip');
            a.innerHTML = html;
            this.elem = a;
            document.querySelector('body').appendChild(a);
        }
    }
    OrientationTip.prototype.hide = function () {
        $(this.elem).css({
            display: 'none'
        });
    };
    return OrientationTip;
}());
exports.OrientationTip = OrientationTip;


/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = createjs;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
	// get current location
	var location = typeof window !== "undefined" && window.location;

	if (!location) {
		throw new Error("fixUrls requires window.location");
	}

	// blank or null?
	if (!css || typeof css !== "string") {
		return css;
	}

	var baseUrl = location.protocol + "//" + location.host;
	var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
 This regular expression is just a way to recursively match brackets within
 a string.
 	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
    (  = Start a capturing group
      (?:  = Start a non-capturing group
          [^)(]  = Match anything that isn't a parentheses
          |  = OR
          \(  = Match a start parentheses
              (?:  = Start another non-capturing groups
                  [^)(]+  = Match anything that isn't a parentheses
                  |  = OR
                  \(  = Match a start parentheses
                      [^)(]*  = Match anything that isn't a parentheses
                  \)  = Match a end parentheses
              )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
  \)  = Match a close parens
 	 /gi  = Get all matches, not the first.  Be case insensitive.
  */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function (fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl.trim().replace(/^"(.*)"$/, function (o, $1) {
			return $1;
		}).replace(/^'(.*)'$/, function (o, $1) {
			return $1;
		});

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
			return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
			//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * todo
 * can use Url module
 */

var a = document.createElement('a');
var a_pathname = document.createElement('a');
var __dirname__list = null;
var __dirname = null;

var __protocol = location.protocol;
var __host = location.host;
var __origin = __protocol + '//' + __host;

setDirName(location.pathname);

function dir2List(path) {
    var pathListNew = [],
        pathList = path.split('/');

    for (var i = 0, len = pathList.length - 1; i < len; i++) {
        if (pathList[i] != '') {
            pathListNew.push(pathList[i]);
        }
    }

    return pathListNew;
}
function dirList2String(pathList) {
    return '/' + pathList.join('/') + '/';
}
function setDirName(path) {
    a.href = path;
    path = a.pathname;
    __protocol = a.protocol;
    __host = a.host;
    __origin = __protocol + '//' + __host;
    __dirname__list = dir2List(path);
    __dirname = dirList2String(__dirname__list);
}

var Cache = {
    update: setDirName,
    getPath: function getPath() {
        return __dirname;
    },
    resolve: function resolve(url) {
        a_pathname.href = __origin + __dirname + url;

        var search = a_pathname.search;
        var hash = a_pathname.hash;

        return a_pathname.href;
    }
};

try {
    Cache.update(document.querySelector('[main-js]').src);
} catch (e) {
    console.error('script 缺少 main-js 属性');
}

module.exports = Cache;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "", ""]);

// exports


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "game {\n  height: 100%;\n  overflow: hidden;\n  position: relative; }\n  game .canvas-container {\n    position: relative;\n    width: 100%;\n    padding-top: 56.33803%; }\n  game #canvas {\n    position: absolute;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 100%;\n    display: block;\n    background: #000; }\n", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "@-webkit-keyframes rotation {\n  10% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg); }\n  50%, 60% {\n    -webkit-transform: rotate(90deg);\n            transform: rotate(90deg); }\n  100% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg); } }\n\n@-moz-keyframes rotation {\n  10% {\n    -moz-transform: rotate(0deg);\n         transform: rotate(0deg); }\n  50%, 60% {\n    -moz-transform: rotate(90deg);\n         transform: rotate(90deg); }\n  100% {\n    -moz-transform: rotate(0deg);\n         transform: rotate(0deg); } }\n\n@-o-keyframes rotation {\n  10% {\n    -o-transform: rotate(0deg);\n       transform: rotate(0deg); }\n  50%, 60% {\n    -o-transform: rotate(90deg);\n       transform: rotate(90deg); }\n  100% {\n    -o-transform: rotate(0deg);\n       transform: rotate(0deg); } }\n\n@keyframes rotation {\n  10% {\n    -webkit-transform: rotate(0deg);\n       -moz-transform: rotate(0deg);\n         -o-transform: rotate(0deg);\n            transform: rotate(0deg); }\n  50%, 60% {\n    -webkit-transform: rotate(90deg);\n       -moz-transform: rotate(90deg);\n         -o-transform: rotate(90deg);\n            transform: rotate(90deg); }\n  100% {\n    -webkit-transform: rotate(0deg);\n       -moz-transform: rotate(0deg);\n         -o-transform: rotate(0deg);\n            transform: rotate(0deg); } }\n\n#orientLayer {\n  display: none; }\n\n@media screen and (max-aspect-ratio: 12 / 7) {\n  #orientLayer {\n    display: block; } }\n\n.mod-orient-layer {\n  display: none;\n  position: fixed;\n  height: 100%;\n  width: 100%;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background: #333;\n  z-index: 9997; }\n\n.mod-orient-layer__content {\n  position: absolute;\n  width: 100%;\n  top: 45%;\n  margin-top: -75px;\n  text-align: center; }\n\n.mod-orient-layer__icon-orient {\n  background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIYAAADaCAMAAABU68ovAAAAXVBMVEUAAAD29vb////x8fH////////x8fH5+fn29vby8vL////5+fn39/f6+vr////x8fH////////+/v7////09PT////x8fH39/f////////////////////x8fH///+WLTLGAAAAHXRSTlMAIpML+gb4ZhHWn1c2gvHBvq1uKJcC6k8b187lQ9yhhboAAAQYSURBVHja7d3blpowFIDhTUIAOchZDkre/zE7ycySrbUUpsRN2/1fzO18KzEqxEVgTiZNfgmmtxRc8iaR8HNe8x4BtjQePKayYCIoyBSgvNNE1AkNSHqZyLqk97EgUCCHBzZ5mkg7ScvIJuIyOyXBRFxgpqWZyGsAZLB1KjsJi8nutHU4JCRbFRH8tmirI9k8Jx2sqNs8K/m0LQkrktO2crgcgXGB4AiTEsB0hJfo9MGgX7CGcYiYwQxmMOOvZwRhBG8tCoMXjBDeXvWCEcHbi14wgCBmMIMZzGAGM5jxETNwzMAxA8cMHDNwzMAxA8cMHDNwzMAxA8cMHDNwzMAxY6E2rUQxnH2tz9cirlJFwFBJedaPnUv0M7++egPDE8iAJcIDmxwH5wwv9vUviw2kLbVO3TJU5uul/EyB0FoLp4x60PdGUd3qPurrWyjGGTc05u+1dcgI7/+tCCPARWGhH7o5Y7RCf+bH9ctXLp6v2BVDxfqz0oPXeSVaNtINo/1SXDv4dck8IIkbhtC2ol+iouEonTBCbYvVMnXOjxww6s/RFrBUpXHh/gw1rHj5d/qhYn9Gpk2FWh6xRBRX5Oj3Znh2Sq49/L6+y8pB26q9GbE2dbA2mVbx6I+7MfBglLCttm73ZQi7AD3iL4HqjFYJHSPRppqaUaJ3ATpGa+ckpGak2hRRMyqjGMkvl+xyFeSMwjAqcsZgGDdyhl0oNTnDN4yenJGZFGxNChP5/Y3efh6SM2rDOJMzboYxkDMqwyjIGcIw6F+io2FU1IxIm1JqRmgXSkvNKNCXeTpGrU0JNSO2c6LIGPgCS8AuDHz9ta0SXWDtxoDRH+MqlbC2Dt2G2JFRadtQZt2qq/orGowdGb2euxYiqWEpVWhTBnszoNAPdStuQwxqf0aocdWKW4Z+DfszIh8pxJqbuCE4YAC+4bm0evtipjpgJHeFnyyt1Ku2xa0bhjxr27p75rECNwyI9ZwvXkHq+7aTaMEV44YYy/spfgjgjNHaWW+GeUhGEX7tLlVinIFDDSgnOwhi1V6bU0b6tVS9eAERe863g4dRrtiHdc6o+nn5vtyVVgR79Cqt4uL6gfHPQyGqtP2vf7HADGbcYwaOGThm4JiBYwaOGThm4JiBYwaOGThm4JiBYwaOGThm4JiBYwaOGThm4JjhtOM+J/AgT008yDMkN/dPP9hzS8zAMQN3OEYeekp5YU7KOKXwVXqiY+QS7smcinGKABWdiBgpPJTSMHJ4KidhhPBUSMLw4CmPhKHgKUXCkHsygum71ftNSgCX6bsl8FQyfbcL5EdYsDk0R3j7aiA5wpt5AjKg/2gLJEBD/0Hf2OOf/vRrj6z/7GtP4B3nMKyjHA12kIPSjnJs3FEO0TvKkYJHOWCR+rjJH0Vn6fI5PjNbAAAAAElFTkSuQmCC\");\n  display: inline-block;\n  width: 67px;\n  height: 109px;\n  -webkit-transform: rotate(0deg);\n     -moz-transform: rotate(0deg);\n       -o-transform: rotate(0deg);\n          transform: rotate(0deg);\n  -webkit-animation: rotation infinite 1.5s ease-in-out;\n  -moz-animation: rotation infinite 1.5s ease-in-out;\n    -o-animation: rotation infinite 1.5s ease-in-out;\n       animation: rotation infinite 1.5s ease-in-out;\n  background-size: 67px; }\n\n.mod-orient-layer__desc {\n  margin-top: 20px;\n  font-size: 15px;\n  color: #fff; }\n\n.qr-box {\n  display: none; }\n\n@media only screen and (min-width: 1023px) {\n  html {\n    width: 414px;\n    margin: 0 auto;\n    background-color: #333 !important;\n    position: absolute;\n    left: 50%;\n    margin-left: -207px;\n    max-height: 672px; }\n  .qr-box {\n    position: absolute;\n    left: 50%;\n    margin-left: -75px;\n    border-radius: 4px;\n    z-index: 9999;\n    background-color: #fff;\n    top: 50%;\n    margin-top: -100px;\n    display: block; }\n  .qr-box__thumb {\n    position: absolute;\n    right: 59px;\n    width: 25px;\n    height: 25px;\n    display: block;\n    top: 59px;\n    z-index: 9999;\n    padding: 2px;\n    background-size: 25px;\n    background-repeat: no-repeat;\n    background-position: 2px 2px;\n    border: none; }\n  .qr-box__thumb_default {\n    background-color: #fff; }\n  .qr-box__text {\n    width: 100%;\n    text-align: center;\n    font-size: 14px;\n    line-height: 18px;\n    padding-bottom: 10px; }\n  .qr-box__img {\n    width: 150px;\n    height: 150px;\n    border: none;\n    border-radius: 10px 10px 0 0;\n    background-size: 140px;\n    -webkit-background-size: 140px;\n    background-repeat: no-repeat;\n    background-position: 5px; }\n  .qr-box__img img {\n    padding: 5px;\n    width: 140px;\n    height: 140px; }\n  .screen__inner {\n    -webkit-transform: scale(1.29375) !important;\n    -moz-transform: scale(1.29375) !important;\n      -o-transform: scale(1.29375) !important;\n         transform: scale(1.29375) !important; }\n  .mod-orient-layer__content {\n    display: none; } }\n", ""]);

// exports


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(undefined);
// imports


// module
exports.push([module.i, "html, body {\n  width: 100%;\n  height: 100%; }\n", ""]);

// exports


/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = "<div>app</div>";

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = "<div class=\"canvas-container\">\r\n    <canvas id=\"canvas\"></canvas>\r\n</div>";

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = "<div id=\"orientLayer\" class=\"mod-orient-layer\">\r\n    <div class=\"mod-orient-layer__content\"><i class=\"icon mod-orient-layer__icon-orient\"></i>\r\n        <div class=\"mod-orient-layer__desc\">为了更好的体验，请使用横屏浏览</div>\r\n    </div>\r\n</div>";

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(10);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./app.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./app.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./game.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./game.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(12);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(1)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./orientLayer.scss", function() {
			var newContent = require("!!../../../node_modules/css-loader/index.js!../../../node_modules/postcss-loader/index.js!../../../node_modules/sass-loader/lib/loader.js!./orientLayer.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var GameCtrl = (function () {
    function GameCtrl() {
    }
    return GameCtrl;
}());
exports.GameCtrl = GameCtrl;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Player = (function () {
    function Player() {
        this.bullets = [];
        this.renderList = [];
        this.removeList = [];
        this.state = '';
        //创建一个显示对象
        var playerSheet = new createjs.SpriteSheet({
            framerate: 30,
            images: [__webpack_require__(23)],
            frames: { regX: 0, regY: 0, height: 250, width: 250, count: 3 },
            // define two animations, run (loops, 1.5x speed) and jump (returns to run):
            animations: {
                run: { frames: [1, 2], speed: .15 },
                stand: { frames: [0] }
            }
        });
        this.playerRun = new createjs.Sprite(playerSheet, "run");
        this.playerStand = new createjs.Sprite(playerSheet, "stand");
        // this.bulletTemp = new createjs.Bitmap(require('../../style/star.png'));
    }
    Player.prototype.clearState = function () {
        this.removeList.push(this.playerRun);
        this.removeList.push(this.playerStand);
    };
    Player.prototype.clearStateExpect = function (expectObject) {
        if (expectObject !== this.playerRun) {
            this.removeList.push(this.playerRun);
        }
        if (expectObject !== this.playerStand) {
            this.removeList.push(this.playerStand);
        }
    };
    Player.prototype.run = function () {
        this.state = 'run';
        this.clearStateExpect(this.playerRun);
        this.renderList.push(this.playerRun);
    };
    Player.prototype.stand = function () {
        this.state = 'stand';
        this.clearStateExpect(this.playerStand);
        this.renderList.push(this.playerStand);
    };
    Player.prototype.shoot = function () {
        var bullet = this.bulletTemp.clone();
        this.bullets.push(bullet);
        this.renderList.push(bullet);
        return this.bullets;
    };
    Player.prototype.getBullets = function () {
        return this.bullets;
    };
    Player.prototype.removeRenderCache = function (index) {
        this.renderList.splice(index, 1);
    };
    Player.prototype.clearRenderCache = function () {
        this.renderList = [];
    };
    Player.prototype.clearRemoveCache = function () {
        this.removeList = [];
    };
    return Player;
}());
exports.Player = Player;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(2);
__webpack_require__(7);
var Rem_1 = __webpack_require__(3);
var orientLayer_1 = __webpack_require__(6);
var app_1 = __webpack_require__(4);
var game_1 = __webpack_require__(5);
function appInit() {
    Rem_1.RemInit();
    new orientLayer_1.OrientationTip().hide();
    new app_1.App().hide();
    new game_1.Game().show();
}
appInit();


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var path = __webpack_require__(9);module.exports = path.resolve("hero.3b7755b718979ca5627814170827f3e2.png");

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = Zepto;

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = ndgmr;

/***/ })
/******/ ]);