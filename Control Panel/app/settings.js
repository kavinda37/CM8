biziApp.controller('settingsController', ['$scope', '$location','datatables_service', function ($scope, $location,datatables_service) {

    $(window).trigger('resize');
    $scope.isCurrentPath = function (path) {
        return $location.path() == path;
    };
    $scope.data_set = {form_data: [], selected: {}};

    $scope.update = function () {


        $scope.data_set.form_data.push({
            company_name: $scope.company_name,
            opening_time: $scope.opening_time,
            closing_time: $scope.closing_time,
            owner_name: $scope.owner_name,
            service_name: $scope.service_name,
            default_monthly_target:$scope.default_monthly_target
        });

        $.ajax({
            url: base_url + "inventory_update/settings_update",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
                if (response.res == 1) {
                    alert("Data Updated Successfully");


                }
                else {
                    alert("Save Failed");
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);
                location.reload();
               // alert(thrownError + ", Save Failed!");
            }
        });


    };

    $scope.form_load = function () {


        $.ajax({
            url: base_url + "inventory_load/settings_load",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
                $scope.$apply(function () //to reset popup
                {
                    $scope.company_name = response[0]['company_name'];
                    $scope.owner_name = response[0]['company_owner'];
                    $scope.opening_time = response[0]['opening_time'];
                    $scope.closing_time = response[0]['closing_time'];
                    $scope.default_monthly_target = parseFloat(response[0]['default_monthly_target']);
                    $scope.service_name = service_name_text;
                });

            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);
                alert(thrownError + ", Save Failed!");
            }
        });


    };
    $scope.form_load();

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
            startDate: moment().subtract(6, 'days'),//Set Default Range
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

    $scope.add_bank_account = function () {
        $scope.module_datatables_show=false;
        $scope.show_add_bank_account=true;
    };

    $scope.save_bank_account = function () {
        //on Success

        $scope.data_set.form_data.push({
            account_name: $scope.account_name,
            init_amount: $scope.init_amount
        });
        $.ajax({
            url: base_url + "inventory_save/bank_account_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {

                if (response == 1) {
                    alert(" Inserted Successfully");
                    $scope.$apply(function () //to reset dropdown
                    {
                        $scope.module_datatables_show=true;
                        $scope.show_add_bank_account=false;
                    });
                } else
                    alert("Save Faild");
            },
            error: function (xhr, ajaxOptions, thrownError) {

                alert(thrownError + " Save  Failed");

            }
        });

    };

    //alert(module_datatables_show);
    if(typeof module_datatables_show!= 'undefined') {
        $scope.module_datatables_show = true;
        $scope.load_complete = datatables_service.grid_refresh($scope.start_date, $scope.end_date, true);
    }

}]);