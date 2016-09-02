biziApp.controller('general_reportController', ['$scope', '$location', function ($scope, $location) {
   // $(window).trigger('resize');
    $scope.isCurrentPath = function (path) {
        return $location.path() == path;
    };
}]);

biziApp.controller('sales_reportController', ['$scope', '$location', function ($scope, $location) {



    $("#toggle-button").click(
        function() {
            console.log("clicked...waiting...");

            setTimeout(
                function() {
                    //alert("Called after delay.");
                    $scope.widget_load($scope.start_date,$scope.end_date,$scope.chart_selected);
                },
                155);
        });

    //Defaults
    $scope.chart_selected="Sales Overview";
    $scope.start_date=moment().subtract(6, 'days').format('YYYY-MM-DD');
    $scope.end_date=moment().format('YYYY-MM-DD');
    $scope.sub_label='Last 7 Days';
    $scope.data_units='LKR';



    //Date range as a button
    $('#daterange-btn').daterangepicker(
        {
            ranges: {
                //'Today': [moment(), moment()],
                //'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            startDate: moment().subtract(6, 'days'),//Set Default Range
            endDate: moment()
        },
        function (start, end,label) {
            //$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            //console.log(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
            $scope.start_date=start.format('YYYY-MM-DD');
            $scope.end_date=end.format('YYYY-MM-DD');
            $scope.sub_label=label;

            $scope.widget_load($scope.start_date,$scope.end_date,$scope.chart_selected);

        }
    );




    //$(window).trigger('resize');
    $scope.isCurrentPath = function (path) {
        return $location.path() == path;
    };
    

    $scope.chart_type_select = function (stat,unit) {

        $scope.chart_selected = stat;
        $scope.data_units=unit;
        $scope.widget_load($scope.start_date,$scope.end_date,$scope.chart_selected);

    };


    $scope.widget_load = function (start,end,chart) {
        var data_set={};
        data_set['start_date']=start;
        data_set['end_date']=end;
        data_set['chart']=chart;

        //console.log( JSON.stringify(data_set));
        $.ajax({
            url: base_url+"reports_load/sales_report",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify(data_set),
            success: function (response) {


                console.log(response);
                $scope.$apply(function () //to reset dropdown
                {

                    $scope.chart_data=response['chart_data'];
                    $scope.no_of_days=response['no_of_days'];

                    $scope.line_chart($scope.no_of_days,$scope.chart_data);

                    $scope.widgets=(response['widgets_data']);

                    //console.log($scope.widgets);
                });

            },
            error: function (xhr, ajaxOptions, thrownError) {

                //location.reload();

            }
        });

        /*$scope.widget_cards = function (widget_data) {

            $scope.widgets=widget_data['sales_today'];

        }*/

    };






    $scope.line_chart = function (days,data_arr) {
        $(function () {
            $('#container').highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: $scope.chart_selected
                },
                subtitle: {
                    text: $scope.sub_label+' ('+ $scope.start_date+' To '+$scope.end_date+')'
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    x: 150,
                    y: 100,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                xAxis: {
                    categories: days

                },
                yAxis: {
                    title: {
                        text: $scope.data_units
                    }
                },
                tooltip: {
                    shared: true,
                    valueSuffix: ' '+$scope.data_units
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    areaspline: {
                        fillOpacity: 0.5
                    }
                },
                series: data_arr
            });
        });
    };

    $scope.widget_load($scope.start_date,$scope.end_date,$scope.chart_selected);

}]);

biziApp.controller('stock_reportController', ['$scope', '$location', function ($scope, $location) {

    //$(window).trigger('resize');
    $scope.isCurrentPath = function (path) {
        return $location.path() == path;
    };



    $("#toggle-button").click(
        function() {
            console.log("clicked...waiting...");

            setTimeout(
                function() {
                    //alert("Called after delay.");
                    $scope.widget_load($scope.start_date,$scope.end_date,$scope.chart_selected);
                },
                155);
        });

    //Defaults
    $scope.chart_selected="Current Stock";
    $scope.start_date=moment().subtract(6, 'days').format('YYYY-MM-DD');
    $scope.end_date=moment().format('YYYY-MM-DD');
    $scope.sub_label='Last 7 Days';
    $scope.data_units='Units';



    //Date range as a button
    $('#daterange-btn').daterangepicker(
        {
            ranges: {
                //'Today': [moment(), moment()],
                //'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            startDate: moment().subtract(6, 'days'),//Set Default Range
            endDate: moment()
        },
        function (start, end,label) {
            //$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            //console.log(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
            $scope.start_date=start.format('YYYY-MM-DD');
            $scope.end_date=end.format('YYYY-MM-DD');
            $scope.sub_label=label;

            $scope.widget_load($scope.start_date,$scope.end_date,$scope.chart_selected);

        }
    );




    $(window).trigger('resize');
    $scope.isCurrentPath = function (path) {
        return $location.path() == path;
    };


    $scope.chart_type_select = function (stat,unit) {

        $scope.chart_selected = stat;
        $scope.data_units=unit;
        $scope.widget_load($scope.start_date,$scope.end_date,$scope.chart_selected);

    };


    $scope.widget_load = function (start,end,chart) {
        var data_set={};
        data_set['start_date']=start;
        data_set['end_date']=end;
        data_set['chart']=chart;

        //console.log( JSON.stringify(data_set));
        $.ajax({
            url: base_url+"reports_load/stock_report",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify(data_set),
            success: function (response) {


                console.log(response);
                $scope.$apply(function () //to reset dropdown
                {

                    $scope.chart_data=response['chart_data'];
                    $scope.no_of_days=response['no_of_days'];

                    $scope.line_chart($scope.no_of_days,$scope.chart_data);

                    $scope.widgets=(response['widgets_data']);

                    //console.log($scope.widgets);
                });

            },
            error: function (xhr, ajaxOptions, thrownError) {

                //location.reload();

            }
        });

        /*$scope.widget_cards = function (widget_data) {

         $scope.widgets=widget_data['sales_today'];

         }*/

    };






    $scope.line_chart = function (days,data_arr) {
        $(function () {
            $('#container').highcharts({
                chart: {
                    type: 'line'
                },
                title: {
                    text: $scope.chart_selected
                },
                subtitle: {
                    text: $scope.sub_label+' ('+ $scope.start_date+' To '+$scope.end_date+')'
                },
                legend: {
                    layout: 'vertical',
                    align: 'left',
                    verticalAlign: 'top',
                    x: 150,
                    y: 100,
                    floating: true,
                    borderWidth: 1,
                    backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
                },
                xAxis: {
                    categories: days

                },
                yAxis: {
                    title: {
                        text: $scope.data_units
                    }
                },
                tooltip: {
                    shared: true,
                    valueSuffix: ' '+$scope.data_units
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    areaspline: {
                        fillOpacity: 0.5
                    }
                },
                series: data_arr
            });
        });
    };

    $scope.widget_load($scope.start_date,$scope.end_date,$scope.chart_selected);

}]);