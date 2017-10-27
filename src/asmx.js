angular.module("jarom.asmx", [])
.provider("asmx", function () {
	var ApiUrl = null;
	this.setApiUrl = function (value) {
		ApiUrl = value;
		//console.log("setApiUrl " + value);
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
			} else {
				retval.push(rows[i]);
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
					//console.log("get " + _path + " response", response);
					d.resolve(processResponse(response));
				})
				.catch(function (err) {
					//console.log(_path + " err", err);
					d.reject(err);
				});
				return d.promise;
			},
			processResponse: processResponse
		};
	}];
});
