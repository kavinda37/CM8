
// create the module and name it biziApp
var biziApp = angular.module('biziApp', ['ngRoute', 'ui.bootstrap','ngSanitize']);



// configure our routes
biziApp.config(function ($routeProvider) {
    $routeProvider

    // route for the home page
        .when('/', {
            templateUrl: 'login',
            controller: 'mainController',
            title: 'Home'
        })

        .when('/dashboard', {
            templateUrl: 'dashboard',
            controller: 'dashController',
            title: 'Dashboard'
        })

        // route for the stock page
        .when('/stock', {
            templateUrl: 'inventory/stock',
            controller: 'stockController',
            title: 'Stock'
        })

        // route for the item_history page
        .when('/item_history', {
            templateUrl: 'inventory/item_history',
            controller: 'item_historyController',
            title: 'Inventory Log'
        })

        // route for the note_gr page
        .when('/note_gr', {
            templateUrl: 'inventory/note_gr',
            controller: 'note_grController',
            title: 'GRN'
        })

        // route for the note_gi page
        .when('/note_gi', {
            templateUrl: 'inventory/note_gi',
            controller: 'note_giController',
            title: 'GIN'
        })

        // route for the note_sr page
        .when('/note_sr', {
            templateUrl: 'inventory/note_sr',
            controller: 'note_srController',
            title: 'SRN'
        })

        // route for the note_pr page
        .when('/note_pr', {
            templateUrl: 'inventory/note_pr',
            controller: 'note_prController',
            title: 'PRN'
        })

        // route for the customers page
        .when('/customers', {
            templateUrl: 'master_data/customers',
            controller: 'customersController',
            title: 'Customers'
        })

        // route for the models page
        .when('/models', {
            templateUrl: 'master_data/models',
            controller: 'modelsController',
            title: 'Products'
        })

        // route for the models page
        .when('/manufactures', {
            templateUrl: 'master_data/manufactures',
            controller: 'manufacturesController',
            title: 'Manufactures'
        })

        // route for the suppliers page
        .when('/suppliers', {
            templateUrl: 'master_data/suppliers',
            controller: 'suppliersController',
            title: 'Suppliers'
        })

        // route for the item_types page
        .when('/item_types', {
            templateUrl: 'master_data/item_types',
            controller: 'item_typesController',
            title: 'Category'
        })

        // route for the sales page
        .when('/sales', {
            templateUrl: 'pos/sales',
            controller: 'salesController',
            title: 'Sales'
        })

        // route for the users page
        .when('/users', {
            templateUrl: 'organization/users',
            controller: 'usersController',
            title: 'Users'
        })

        // route for the branches page
        .when('/branches', {
            templateUrl: 'organization/branches',
            controller: 'branchesController',
            title: 'Branches'
        })

        // route for the clients page
        .when('/clients', {
            templateUrl: 'organization/clients',
            controller: 'clientsController',
            title: 'Clients'
        })

        // route for the settings page
        .when('/settings', {
            templateUrl: 'organization/settings',
            controller: 'settingsController',
            title: 'Settings'
        })

        // route for the general_report page
        .when('/general_report', {
            templateUrl: 'reports/general_report',
            controller: 'general_reportController',
            title: 'General Report'
        })

        // route for the sales_report page
        .when('/sales_report', {
            templateUrl: 'reports/sales_report',
            controller: 'sales_reportController',
            title: 'Sales Report'
        })

        // route for the stock_report page
        .when('/stock_report', {
            templateUrl: 'reports/stock_report',
            controller: 'stock_reportController',
            title: 'Stock Report'
        })

        .when('/accounts_overview', {
            templateUrl: 'accounts/accounts_overview',
            controller: 'accounts_overviewController',
            title: 'Accounts Overview'
        })

        .when('/cash', {
            templateUrl: 'accounts/cash',
            controller: 'cashController',
            title: 'Cash'
        })

        .when('/bank', {
            templateUrl: 'accounts/bank',
            controller: 'bankController',
            title: 'Bank'
        })

        .when('/cheque', {
            templateUrl: 'accounts/cheque',
            controller: 'chequeController',
            title: 'Cheque'
        })

        .when('/card', {
            templateUrl: 'accounts/card',
            controller: 'cardController',
            title: 'Card'
        })

        .when('/credit_debt', {
            templateUrl: 'accounts/credit_debt',
            controller: 'credit_debtController',
            title: 'Credit'
        })

        .when('/debtors', {
            templateUrl: 'accounts/debtors',
            controller: 'debtorsController',
            title: 'Debtors'
        })

        .when('/search', {
            templateUrl: 'accounts/global_search',
            controller: 'searchController',
            title: 'Search'
        })

        .when('/send_repair', {
            templateUrl: 'service/load/send_repair',
            controller: 'send_repairController',
            title: 'Send Repair'
        })

    ;


});

biziApp.run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
}]);