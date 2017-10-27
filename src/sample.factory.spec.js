describe('sample.mod', function () {

	beforeEach(module('sample.mod'));

	// inject the rootScope and factory
	beforeEach(inject(function (_$rootScope_, _ItemsApi_) {
		// The injector unwraps the underscores (_) from around the parameter names when matching

		// Generate a new scope
		scope = _$rootScope_.$new();
		// Expose the factory to the tests
		ItemsApi = _ItemsApi_;
	}));

	describe('processResponse method', function () {

		it('should make numbers into numbers', function () {
			var inputs = {
				data: {
					d: [
						{ intprop: "10" },
						{ intprop: "20" },
						{ floatprop: "10.5" }
					]
				}
			};
			var outputs = ItemsApi.processResponse(inputs);
			expect(outputs[0].intprop + 1).toBe(11);
		});
		it('should not damage objects', function () {
			var inputs = {
				data: {
					d: {
						intprop: "10",
						floatprop: "10.5"
					}
				}
			};
			var outputs = ItemsApi.processResponse(inputs);
			expect(outputs.intprop + 1).toBe(11);
		});
		it('should handle array of literals', function () {
			var inputs = {
				data: {
					d: [
            "item1",
            "item2"
          ]
				}
			};
			var outputs = ItemsApi.processResponse(inputs);
			expect(outputs[0]).toBe("item1");
			expect(outputs[1]).toBe("item2");
		});

	});

});