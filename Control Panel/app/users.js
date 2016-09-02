biziApp.controller('usersController', function ($scope) {
    // create a message to display in our view
    //$(window).trigger('resize');

    var save_data = [];
    var load_data = [];


    var begin, end;

    $scope.filteredTodos = [],
        $scope.currentPage = 1,
        $scope.numPerPage = 10,
        $scope.maxSize = 5,
        $scope.itemNumber = 0;

    $scope.data_set = {form_data: [], selected: {}};
    $scope.update_data = {update_data: [], selected: {}};
    $scope.delete_data = {delete_data: [], selected: {}};

    $scope.Users_role = {
        Users_role_array: [],
        select_Users_role: {} //This sets the default value of the select in the uiID: '', name: 'Option C'
    };

   // $scope.db_data = [];
    $scope.grid_refrash = function () {

        $.ajax({
            url: base_url + "Inventory_load/get_users_grid",
            type: "POST",
            dataType: 'json',
            //data: {"modelID": modelID},
            success: function (response) {
                load_data = response;
                console.log(response);
                $scope.$apply(function () //to reset dropdown
                {

                    oTable.fnClearTable();
                    for (var i = 0; i < response.length; i++) {
                        var street = "";
                        var city = "";
                        var phone = "";
                        var web = "";
                        if (response[i]['street1'] == "" || response[i]['street1'] == null) {
                            street = "n/a"
                        } else {
                            street = response[i]['street1'];
                        }
                        if (response[i]['city'] == "" || response[i]['city'] == null) {
                            city = "n/a"
                        } else {
                            city = response[i]['city'];
                        }
                        if (response[i]['phone_number'] == "" || response[i]['phone_number'] == 0) {
                            phone = "n/a"
                        } else {
                            phone = response[i]['phone_number'];
                        }
                        if (response[i]['web_address'] == "") {
                            web = "n/a"
                        } else {
                            web = response[i]['web_address'];
                        }
                        oTable.fnAddData([i + 1, response[i]['first_name'] +' '+ response[i]['last_name'],
                            response[i]['username'],
                            street,
                            city,
                            phone,
                            web

                            , '<div class="tools" >' +
                            '<span onclick="get_index(' + response[i]['user_id'] + ',' + i + ',\'edit\')" class="btn-link hidden-xs" style="cursor: pointer;"> <i class="fa fa-edit"></i></span>' +
                            '&nbsp;&nbsp;' +
                            '<span onclick="get_index(' + response[i]['user_id'] + ',' + i + ',\'delete\')" class="btn-link" style="cursor: pointer;"><i class="fa fa-trash-o"></i></span>' +
                            '</div>'
                        ]);

                    }
                    $scope.load_complete = true;


                });
                //console.log($scope.db_data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Loading  Failed");
                $scope.load_complete = true;

            }

        });

    };

    $scope.grid_refrash();

    //==================================================================================

    $scope.get_user_role = function () {
        $.ajax({
            url: base_url + "Inventory_load/get_user_role",
            type: "POST",
            dataType: 'json',
            //data: {"LENGTH": invoice_char_length},
            success: function (response) {


                $scope.$apply(function () //to reset dropdown
                {

                    $scope.Users_role_array = response;
                });
                console.log($scope.Users_role);
            }

        });


    };


    //======================== Buttons Click Event ======================================

    $scope.add_button_click = function () {
        $scope.showme = true;
        $scope.edit_mode_enabled = false;
        $scope.get_user_role();
        $scope.clear_form_data();
        // check Customer code is exist
    };

    $scope.clear_form_data = function () {
        $scope.first_name = '';
        $scope.last_name = '';
        $scope.username = '';
        $scope.users_password = '';
        $scope.users_password_retype = '';
        $scope.contact_id = '';
        $scope.Users_TP = '';
        $scope.Users_address = '';
        $scope.Users_city = '';
        $scope.Users_email = '';
       // $scope.Users_role = '';
      //  $scope.customer_city = '';
    };

    $scope.click_cancel = function () {

        //  $scope.grid_refrash();
        $scope.showme = false;

    };

    $scope.save_data_grid = function () {

        $scope.data_set = {form_data: [], selected: {}};
        $scope.data_set.form_data.push({
            id: $scope.itemNumber++,
            username: $scope.username,
            users_password: $scope.users_password,
            first_name: $scope.first_name,
            last_name: $scope.last_name,
            address: $scope.Users_address,
            phone: $scope.Users_TP,
            email: $scope.Users_email,
            city: $scope.Users_city,
            users_role: $scope.Users_role.select_Users_role.user_role_id,
            company_id: company_id,
           // user_id:  $scope.user_ID
        });

        $.ajax({
            url: base_url + "inventory_save/user_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
               // alert(response['code']);
                if (response['has_error'] === false) {
                    alert(response['message']);
                    $scope.$apply(function () //to reset dropdown
                    {
                        if(response['code']==200) {

                            $scope.grid_refrash();
                            $scope.showme = false;
                        }

                    });
                   // console.log($scope.data_set);
                }
                else {
                    alert("Save Failed");
                    //$scope.data_set = [];
                   // $scope.data_set = {form_data: [], selected: {}};
                  //  $scope.grid_refrash();
                  //  $scope.showme = false;
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);
                alert(thrownError + ", Save Failed!");
            }
        });


    };
    //======================== END Buttons Click Event ======================================

    // ----------------------------------Edit part--------------------------------------------
    $scope.load_main_data_for_edit = function (data_id, array_index) {


       //  alert(data_id);
       // console.log(load_data[array_index]);

        if (confirm("Edit " + load_data[array_index]['first_name'] + "?") === true) {
            $scope.get_user_role();
            //load text box and dropdowns
            $scope.$apply(function () //to reset dropdown
            {
               // console.log(load_data);
                $scope.first_name = load_data[array_index]['first_name'];
                $scope.last_name = load_data[array_index]['last_name'];
                $scope.username = load_data[array_index]['username'];
                $scope.user_ID = data_id;
                $scope.contact_id = load_data[array_index]['contact_id'];
                $scope.Users_address = load_data[array_index]['street1'];
                $scope.Users_TP = load_data[array_index]['phone_number'];
               // $scope.Users_email = load_data[array_index]['web_address'];
               // $scope.user_code = load_data[array_index]['customer_code'];
                $scope.Users_city = load_data[array_index]['city'];

                var Users_role = load_data[array_index]['role_name'];
                $scope.Users_role.select_Users_role = {
                    'user_role_id': load_data[array_index]['user_role_id'],
                    'role_name': Users_role
                };

                if (load_data[array_index]['web_address'] === null) {
                    $scope.Users_email = '';
                }
                else {
                    $scope.Users_email = load_data[array_index]['web_address'];
                }

                $scope.edit_mode_enabled = true;
                $scope.showme = true;
            });
        }


    };

    //Save The edited data NEED TO BE FIXED
    $scope.update_main_data = function () {

        $scope.update_data = {update_data: [], selected: {}};
        $scope.update_data.update_data.push({
            id: $scope.user_ID,
            contact_id: $scope.contact_id,
            first_name: $scope.first_name,
            last_name: $scope.last_name,
            Users_address: $scope.Users_address,
            username: $scope.username,
            Users_TP: $scope.Users_TP,
            Users_email: $scope.Users_email,
            Users_city: $scope.Users_city,
            users_role: $scope.Users_role.select_Users_role.user_role_id
          //  customer_code: $scope.customer_code

        });

        $.ajax({
            url: base_url + "Inventory_update/users_update",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.update_data),
            success: function (response) {
                // console.log(response);

                if (response['has_error'] === false) {
                    alert(response['message']);
                    $scope.$apply(function () //to reset dropdown
                    {
                        if(response['code']==200) {

                            $scope.grid_refrash();
                            $scope.showme = false;
                        }

                    });
                    // console.log($scope.data_set);
                }
                else {
                    alert("Save Failed");
                    $scope.update_data = {update_data: [], selected: {}};
                    //$scope.data_set = [];
                    // $scope.data_set = {form_data: [], selected: {}};
                    //  $scope.grid_refrash();
                    //  $scope.showme = false;
                }


            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);
                alert(thrownError + " Update Failed");

            }
        });


    };
    // ----------------------------------END Edit part--------------------------------------------

    //--------------------------------- Delete  Part -------------------

    $scope.Delete_main_data_user = function (data_id, array_index) {

        if (confirm("Delete " + load_data[array_index]['first_name'] + "?") === true) {
            $scope.delete_data.delete_data.push({
                user_id: $scope.user_ID,
                contact_id: load_data[array_index]['contact_id']
            });

            console.log($scope.delete_data);
            $.ajax({
                url: base_url + "Inventory_delete/user_delete_user",
                type: "POST",
                dataType: 'json',
                data: JSON.stringify($scope.delete_data),
                success: function (response) {
                    console.log($scope.delete_data);
                    if (response.res === 1) {
                        alert("Data Delete Successfully");
                        $scope.$apply(function () //to reset dropdown
                        {
                            // $scope.update_data = [];
                            $scope.delete_data = {delete_data: [], selected: {}};
                            $scope.grid_refrash();

                            $scope.showme = false;

                        });
                        // console.log($scope.data_set);
                    } else {
                        alert("Delete Failed");
                        $scope.delete_data = {delete_data: [], selected: {}};
                        $scope.grid_refrash();

                        $scope.showme = false;
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(xhr.responseText);

                    alert(thrownError + " Delete Failed");


                }
            });
        }
    };

    $scope.array_search = function (array, index, string) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][index] === string) {
                return i;
            }

        }
    };


});
