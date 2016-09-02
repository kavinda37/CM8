biziApp.controller('searchController', function ($scope, $location, $sce,pass_data_service) {
// Item List From database
    //Defaults
    $scope.search_query="";

    $scope.serial_search_display=[];
    $scope.person_search_display=[];



    //Submit Function
    $scope.submit = function (field) {
        pass_data_service.set_data(field);
        if($location.path()!='/search'){
            $location.path('/search');
        }else {
            $location.path('/');
        }

    };


    $scope.get_search_result = function (search) {

        var data_set={};
        data_set['search_query']=search;


        $.ajax({
            url: base_url + "accounts_load/get_search_data",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify(data_set),
            success: function (response) {
                console.log(response);
                $scope.$apply(function () //to reset dropdown
                {
                    $scope.serial_search_display=response['serial'];
                    $scope.person_search_display=response['person'];

                });
                //console.log($scope.db_data);
                pass_data_service.unset_data()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                //alert(thrownError + " Get GRN NO Failed");


            }

        });

    };

    if(typeof pass_data_service.get_data()!=='undefined'){
        $scope.search_query=pass_data_service.get_data();
        $scope.get_search_result( $scope.search_query);
    }

});