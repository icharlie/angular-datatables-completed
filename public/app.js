(function(window) {
	'use strict';
	angular.module('showCase', ['datatables', 'ngResource', ])
	.controller('DataReloadWithPromiseCtrl', DataReloadWithPromiseCtrl);

	function DataReloadWithPromiseCtrl($scope, $q, $http, $compile, DTOptionsBuilder, DTColumnBuilder, $resource, DTInstances) {
		var vm = this;
		vm.dtOptions = DTOptionsBuilder.fromFnPromise(localPromise)
		.withPaginationType('full_numbers')
		.withOption('createdRow', createdRow);

		vm.dtColumns = [
			DTColumnBuilder.newColumn('id').withTitle('ID').notVisible(),
			DTColumnBuilder.newColumn('firstName').withTitle('First name'),
			DTColumnBuilder.newColumn('lastName').withTitle('Last name'),
			DTColumnBuilder.newColumn(null).withTitle('Actions').notSortable().renderWith(actionsHtml)
		];
		vm.localPromise = localPromise;

		vm.add = add;
		vm.deleteUser = deleteUser;

		vm.user = getNewUser();

		DTInstances.getLast().then(function (dtInstance) {
			vm.dtInstance = dtInstance;
		});

		function getNewUser() {
			return {
				id: null,
				firstName: '',
				lastName: ''
			};
		}

		function add() {
			var newUser = angular.copy(vm.user);

			var succssFn = function(data) {
				vm.users.push(data);
				vm.dtInstance.reloadData();
				vm.user = getNewUser();
			};

			var errorFn = function(data,status) {
				// handle the error
				console.log(status);
				console.log(data);
			};

			$http
				.post('/users/new', newUser)
				.success(succssFn)
				.error(errorFn);
		}


		function deleteUser(id) {
			var deleteUrl = ['/users/', id, '/delete'].join('');

			var _users = [];

			var cacheUser;

			var succssFn = function(data, status) {
				vm.users = _users;
				vm.dtInstance.reloadData();
			};

			var errorFn = function(data, status) {
				console.log(status);
				console.log(data);
			};

			vm.users.forEach(function(user){
				if (user.id !== id) {
					_users.push(user)
				} else {
					cacheUser = user;
				}
			});



			$http
				.delete(deleteUrl)
				.success(succssFn)
				.error(errorFn);
		}

		function localPromise() {
			var dfd = $q.defer();
			if (vm.users) {
				dfd.resolve(vm.users);
			} else {
				var remotePromise = $resource('/users').query().$promise;
				remotePromise.then(function (users) {
					vm.users = users;
					dfd.resolve(vm.users);
				});
			}
			return dfd.promise;
		}

		function createdRow(row, data, dataIndex) {
			// Recompiling so we can bind Angular directive to the DT
			$compile(angular.element(row).contents())($scope);
		}

		function actionsHtml(data, type, full, meta) {
			return [
				'<button class="btn btn-danger" ng-click="datatableCtrl.deleteUser(',
				data.id,
				');">',
				'Delete',
				'</button>'
			].join('')
		}
	}
})(window);
