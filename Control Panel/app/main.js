biziApp.controller('mainController', function ($scope, $location, pass_data_service) {

    //$(window).trigger('resize');
    $scope.isCurrentPath = function (path) {
        return $location.path() == path;
    };

    //Refresh Search page (Must## Without This search won't work)
    if(typeof pass_data_service.get_data()!=='undefined'){
        $location.path('/search');
    }

    //Move to Dashboard
    if ($location.path() == '/') {
            $location.path('/dashboard');
    }



});

biziApp.controller('dashController', function ($scope) {

    $scope.widget_load = function () {
        $.ajax({
            url: base_url+"reports_load/dashboard",
            type: "POST",
            dataType: 'json',
            //data: {"modelID": modelID},
            success: function (response) {


                //console.log(response);
                $scope.$apply(function () //to reset dropdown
                {
                    //product_variety
                    if(response['product_variety']>0)$scope.product_variety=response['product_variety'];
                    else $scope.product_variety=0;

                    //Sales Amount
                    if(response['sales_this_month']>0)$scope.sales_this_month=response['sales_this_month'];
                    else $scope.sales_this_month=0;

                    //current_stock
                    if(response['current_stock']>0)$scope.current_stock=response['current_stock'];
                    else $scope.current_stock=0;

                    //total_customers
                    if(response['total_customers']>0)$scope.total_customers=response['total_customers'];
                    else $scope.total_customers=0;


                    $scope.stock_data=response['stock_data'];
                    $scope.sales_data=response['sales_data'];
                    $scope.no_of_days=response['no_of_days'];
                    $scope.top_sales=response['top_sales_data'];

                    $scope.business_overview( $scope.no_of_days,$scope.stock_data,$scope.sales_data);
                    $scope.top_sales_data($scope.top_sales);

                });
                console.log($scope.top_sales);
            },
            error: function (xhr, ajaxOptions, thrownError) {

                //location.reload();

            }
        });


    };

    $scope.business_overview = function (days,stock,sales) {

        $(function () {
            $('#business_overview').highcharts({
                chart: {
                    type: 'areaspline'
                },
                title: {
                    text: 'Business Overview'
                },
                subtitle: {
                    text: 'Past 7 days of data.'
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
                        text: 'Units'
                    }
                },
                tooltip: {
                    shared: true,
                    valueSuffix: ' units'
                },
                credits: {
                    enabled: false
                },
                plotOptions: {
                    areaspline: {
                        fillOpacity: 0.5
                    }
                },
                series: [{
                    name: 'Stock',
                    data: stock
                }, {
                    name: 'Sales',
                    data: sales
                }]
            });
        });

    };

    $scope.top_sales_data = function (data_set) {
        $(function () {
            // Create the chart
            $('#container2').highcharts({
                chart: {
                    type: 'pie'
                },
                title: {
                    text: 'Top Sales'
                },
                subtitle: {
                    text: 'Last 30 Days.'
                },
                plotOptions: {
                    series: {
                        dataLabels: {
                            enabled: true,
                            format: '{point.name}: {point.y:.0f}'
                        }
                    }
                },
                credits: {
                    enabled: false
                },

                tooltip: {
                    headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                    pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.0f}</b> Units<br/>'
                },
                series: [{
                    name: 'Products',
                    colorByPoint: true,
                    data: data_set
                }]
            });
        });
    };

    $scope.memory_status = function (data_set) {

        $(document).ready(function () {
            Highcharts.setOptions({
                global: {
                    useUTC: false
                }
            });

            $('#memory_status').highcharts({
                chart: {
                    type: 'spline',
                    animation: Highcharts.svg, // don't animate in old IE
                    marginRight: 10,
                    events: {
                        load: function () {

                            // set up the updating of the chart each second
                            var series = this.series[0];
                            setInterval(function () {

                                memory_usage(function(output){

                                    var x = (new Date()).getTime(), // current time
                                        y =parseFloat(output);
                                    series.addPoint([x, y], true, true);

                                });

                            }, 1000);
                        }
                    }
                },
                title: {
                    text: 'Live random data'
                },
                xAxis: {
                    type: 'datetime',
                    tickPixelInterval: 150
                },
                yAxis: {
                    title: {
                        text: 'Value'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    formatter: function () {
                        return '<b>' + this.series.name + '</b><br/>' +
                            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                            Highcharts.numberFormat(this.y, 2);
                    }
                },
                legend: {
                    enabled: false
                },
                exporting: {
                    enabled: false
                },
                series: [{
                    name: 'Random data',
                    data: (function () {
                        // generate an array of random data
                        var data = [],
                            time = (new Date()).getTime(),
                            i;


                        for (i = -19; i <= 0; i += 1) {
                            data.push({
                                x: time + i * 1000,
                                y:0
                            });
                        }
                        return data;



                    }())
                }]
            });
        });
    };


    function memory_usage(handleData) {
        $.ajax({
            url: base_url+"reports_load/memory_usage",
            success:function(data) {
                handleData(data);
            }
        });
    }





    //$scope.memory_status();
    $scope.widget_load();
});