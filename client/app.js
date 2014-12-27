(function() {
    angular
        .module("app", [])
        .controller("SayingsController", ["sayingsFactory", SayingsController])
        .factory("sayingsFactory", ["$http", sayingsFactory]);

    function SayingsController(sayingsFactory) {
        var vm = this;

        sayingsFactory.getFiles().then(function(data) {
            vm.mp3Paths = data;
            vm.sayingGroupNames = Object.getOwnPropertyNames(data);
        });
    }

    function sayingsFactory($http) {
        return {
            getFiles: function() {
                var promise = $http.get('/sayings').then(function(response) {
                    return response.data;
                });

                return promise;
            }
        };
    }

})();