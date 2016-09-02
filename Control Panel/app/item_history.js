biziApp.controller('item_historyController', function ($scope,datatables_service) {
    // Item List From database
    //Defaults
    $scope.start_date=moment().subtract(29, 'days'), moment();
    $scope.end_date=moment().format('YYYY-MM-DD');
    $scope.sub_label='Last 30 Days';

    //Date range as a button
    $('#daterange-btn').daterangepicker(
        {
            ranges: {
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            startDate: moment().subtract(29, 'days'),//Set Default Range
            endDate: moment()
        },
        function (start, end,label) {
            //$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            //console.log(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
            $scope.$apply(function () //to reset dropdown
            {
                $scope.start_date=start.format('YYYY-MM-DD');
                $scope.end_date=end.format('YYYY-MM-DD');
                $scope.sub_label=label;
                $scope.load_complete=datatables_service.grid_refresh($scope.start_date,$scope.end_date,false);
            });

        }
    );

    $scope.module_datatables_show=true;
    $scope.load_complete=datatables_service.grid_refresh($scope.start_date,$scope.end_date,true);

//    $(window).trigger('resize');
});