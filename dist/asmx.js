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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

angular.module("jarom.asmx", [])
.provider("asmx", function () {
	var ApiUrl = null;
	this.setApiUrl = function (value) {
		ApiUrl = value;
		console.log("setApiUrl " + value);
	};
	function processPrimitiveTypes(input) {
		if (input === "True") { return true; }
		if (input === "False") { return false; }
		if (/^[0-9]+\.*[0-9]*$/.test(input)) { return input * 1; }
		if (/^\/Date\([0-9-]+\)\/$/.test(input)) {
			return new Date(input.replace(/[^0-9]/g, '') - 0);
		}
		return input;
	}
	function processObject(obj) {
		var newObj = {};
		for (var j in obj) { //get props
			if (angular.isString(obj[j])) {
				newObj[j] = processPrimitiveTypes(obj[j]);
			} else {
				newObj[j] = obj[j];
			}
		}
		return newObj;
	}
	function processRows(rows) {
		var retval = [];
		for (var i in rows) {
			if (angular.isObject(rows[i])) {
				var newObj = processObject(rows[i]);
				retval.push(newObj);
			}
		}
		return retval;
	}
	function processResponse(response) {
		//console.log("response.data.d", response.data.d);
		if (angular.isArray(response.data.d)) {
			return processRows(response.data.d);
		} else if (angular.isObject(response.data.d)) {
			return processObject(response.data.d);
		}
		return response.data.d;
	}

	this.$get = ["$q", "$http", function ($q, $http) {
		return {
			get: function (_path, _params) {
				var d = $q.defer();
				$http.post(
					ApiUrl + _path,
					_params,
					{ headers: { "Content-Type": "application/json" } }
				)
				.then(function (response) {
					console.log("get " + _path + " response", response);
					d.resolve(processResponse(response));
				})
				.catch(function (err) {
					console.log(_path + " err", err);
					d.reject(err);
				});
				return d.promise;
			},
		};
	}];
});


/***/ })
/******/ ]);