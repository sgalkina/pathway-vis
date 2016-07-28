// Never remove this import of `angular` from here.
// NOTE: the import form angular also makes the `angular` namespace available globally
import 'angular';

import 'angular-material';
import 'angular-ui-router';
// Turn of WS TS inspection for the 'decaf-common' import.
// noinspection TypeScriptCheckImport
import {sharing, config, core, Config} from 'decaf-common';
import {API_HOST, API_PREFIX} from './bootstrap.config';
import main from 'src';


const app = angular.module('app', [
	// Angular
	'ngAnimate',
	'ngAria',
	'ngMaterial',
	// 3rd Party
	'ui.router',
	// Common
	config.name,
	sharing.name,
	core.name,
	// Component
	main.name
]);


// Production config
app.config(function ($httpProvider) {
	// http://blog.thoughtram.io/angularjs/2015/01/14/exploring-angular-1.3-speed-up-with-applyAsync.html
	$httpProvider.useApplyAsync(true);
});


// AM theme config
app.config(function ($mdThemingProvider) {
	$mdThemingProvider
		.theme('default')
		.primaryPalette('blue-grey')
		.accentPalette('grey');
});

// Router config
app.config(function ($urlMatcherFactoryProvider, $urlRouterProvider, $stateProvider) {
	// Optional slash
	$urlMatcherFactoryProvider.strictMode(false);

	// TODO: perhaps this should not happen
	// Always go to the component state when visiting the root
	$urlRouterProvider.when('', `${main.name}`);

	// Root state
	$stateProvider.state('root', {
		url: '',
		abstract: true
	});
});


// Main component
class AppController {
	isSidebarVisible = true;

	constructor($window, $scope, private config: Config) {
		$window.document.title = `Platform – Component({name: ${main.name}})`;
		// noinspection TypeScriptUnresolvedFunction
		config.set('componentConfig', {});

		// Hide sidebar if there is no navigation set from the component.
		$scope.$on('$stateChangeStart', (toState, toParams) => {
			if (!toParams || !toParams.hasOwnProperty('views') || !toParams.views.hasOwnProperty('navigation@')) {
				this.isSidebarVisible = false;
			}
		});
	}

	// Update color from config
	get color() {
		// Turn off WS inspection for this
		// noinspection TypeScriptUnresolvedFunction
		return this.config.get('color');
	}

	$onInit() {
		console.info('App is running.');
	}
}

app.component('app', {
	bindings: {},
	controller: AppController,
	controllerAs: 'app',
	transclude: {
		'navigation': '?appNavigation',
		'toolbar': '?appToolbar'
	},
	template: `
		<div layout="row" flex ui-view="root">
			<md-sidenav ng-if="app.isSidebarVisible" layout="column" class="md-sidenav-left md-whiteframe-z2" md-component-id="left" md-is-locked-open="$mdMedia('gt-sm')">
				<div ng-transclude="navigation"></div>
				<div ui-view="navigation"></div>
			</md-sidenav>
			<div layout="column" flex id="content">
				<md-toolbar class="component-color" ng-style="{'background-color': app.color || app.component.color}">
					<div class="md-toolbar-tools" ui-view="toolbar">
						<h1 flex>
							{{app.component.navigation.label}}
						</h1>
						<div ng-transclude="toolbar"></div>
					</div>
				</md-toolbar>
				<md-content layout="column"
							ui-view="content"
							flex>
				</md-content>
			</div>
		</div>
	`
});


// Bootstrap
angular.element(document).ready(() => {
	angular.bootstrap(document.documentElement, [app.name], {
		// Do not enable strict DI.
		// NOTE: If we use `{strictDi: true}` we will not be able to use DI with ES6 classes
		strictDi: false
	});
});
