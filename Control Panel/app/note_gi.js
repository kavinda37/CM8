biziApp.controller('note_giController', function ($scope) {
    // create a message to display in our view
    //$(window).trigger('resize');
    var save_data = [];
    var DM = document.getElementById("dropdown_manifacture");//


    var begin, end;
    $scope.filteredTodos = [],
        $scope.currentPage = 1,
        $scope.numPerPage = 10,
        $scope.maxSize = 5,
        $scope.itemNumber = 0;
    $scope.data_set = {form_data: [], common: [], selected: {}};
    $scope.models_old = [];
    $scope.unit_price_span_gl = 0;
    $scope.TOT_qty_span_gl = 0;
    $scope.GIN_total_price = 0;
    $scope.GIN_total_price_gl = 0;
    $scope.GIN_qty = 0;
    $scope.available_qty = 0;
    $scope.TOT_qty_span = 0;
    //$scope.gi_discount=0;


    $scope.$watch('currentPage + numPerPage', function () {
        $scope.paging();
        $scope.indexStartNo = begin;
        save_data = $scope.data_set;
    });
    $scope.delete_total_val = 0;
    $scope.removeItem = function (index) {

        if (confirm("Delete This Item?") == true) {
            $scope.delete_total_val = $scope.data_set.form_data[index + $scope.indexStartNo]['price'];
            $scope.GIN_qty = $scope.GIN_qty - parseInt($scope.data_set.form_data[index + $scope.indexStartNo]['qty'])


            $scope.clear_form();

            console.log($scope.data_set.form_data[index + $scope.indexStartNo]);

            $scope.GIN_total_price = parseInt($scope.GIN_total_price) - parseInt($scope.delete_total_val);
            $scope.GIN_total_price_gl = parseInt($scope.GIN_total_price_gl) - parseInt($scope.delete_total_val);

            $scope.data_set.form_data.splice(index + $scope.indexStartNo, 1);
            $scope.paging();
        } else {

        }
    };

    //clear save Data Grid (clear button function)
    $scope.clearItems = function (index) {

        if (confirm("Clear Current Data Set?") == true) {
            $scope.data_set.form_data = [];
            $scope.paging();
        } else {

        }
    };

    // gets the template to ng-include for a table row / item
    $scope.getTemplate = function (index) {
        if (index.id === $scope.data_set.selected.id)
            return 'edit';
        else
            return 'display';
    };
    $scope.editItem = function (index) {
        $scope.data_set.selected = angular.copy(index);
        document.getElementById("save_data_grid").disabled = true;
    };
    $scope.saveItem = function (index) {
        console.log("Saving contact");
        $scope.data_set.form_data[index + $scope.indexStartNo] = angular.copy($scope.data_set.selected);
        $scope.reset();
        $scope.paging();
    };
    $scope.reset = function () {
        $scope.data_set.selected = {};
        document.getElementById("save_data_grid").disabled = false;
    };
    $scope.paging = function () {
        begin = (($scope.currentPage - 1) * $scope.numPerPage), end = begin + $scope.numPerPage;
        $scope.grid_show = $scope.data_set.form_data.slice(begin, end);
    };
    //Disable Reload if data is present
    window.onbeforeunload = function () {
        if ($scope.data_set.form_data.length > 0) {
            return "Are you sure you want to leave?";
        }
    };

    //----------------------------------------- dropdown load ---------------------------------------------------------


    // Item List From database

    //--------------------------------------------------------------------------------------------------
    //============================ Button Event ================================

    $scope.add_to_grid = function () {
        //Change this array according to the page
        if ($scope.req_qty != "") {
//
            if (typeof ($scope.array_search($scope.data_set.form_data, 'item_code', $scope.item_code)) != 'undefined') {


                $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', $scope.item_code)].qty += $scope.req_qty;
                $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', $scope.item_code)].price += parseFloat($scope.total_price);
            } else {


                $scope.data_set.form_data.push({
                    id: $scope.itemNumber++,
                    qty: $scope.req_qty,
                    item_code: $scope.item_code,
                    manufacture: $scope.manufacture.manufacture_name,
                    M_ID: $scope.manufacture.manufacture_id,
                    model: $scope.model.model_name,
                    MO_ID: $scope.model.model_id,
                    price: parseFloat($scope.total_price),
                    retail_price: $scope.unit_price_span,
                    cost_price: $scope.unit_cost
                });
            }

            $scope.GIN_total_price = parseInt($scope.GIN_total_price) + parseInt($scope.total_price);
            $scope.GIN_total_price_gl = parseInt($scope.GIN_total_price_gl) + parseInt($scope.total_price);
            $scope.GIN_qty = parseInt($scope.GIN_qty) + parseInt($scope.req_qty);
            $scope.paging();
            $scope.currentPage = Math.ceil($scope.data_set.form_data.length / $scope.numPerPage);
            console.log($scope.data_set);

            $scope.clear_form();
        }
    };

    $scope.add_button_click = function () {
        $scope.enable_loading = false;
        $scope.showme = true;

        $.ajax({
            url: base_url+"Inventory_load/add_button",
            type: "POST",
            dataType: 'json',
            data: {"button_location": 'GIN'},
            success: function (response) {
                //console.log(response['manufactures']);
                $scope.$apply(function () //to reset dropdown
                {

                    $scope.manufactures = response['manufactures'];
                    $scope.models = response['models'];
                    $scope.models_old = response['models'];
                    $scope.customers = response['customers'];
                });
                // console.log($scope.set_types_array);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Loading Dropdown Failed");
                $scope.load_complete = true;

            }

        });



        //$scope.edit_mode_enabled = false;
        //  $scope.show_fields = false;
        //$scope.show_bulk = true;
        //Clear txt Boxes
        $scope.GI_invoice_no = '';

        // this.bigMessage = grn_no;
        $scope.data_widget = "collapsed-box";
        $scope.GIN_invoice_span = "";
        // document.getElementById("GI_invoice_no").className = "form-control input-sm";
        $scope.GIN_invoice_date_span = "";
        $scope.GI_invoice_date = "";
        // document.getElementById("GI_invoice_date").className = "form-control input-sm";

    };

    $scope.click_cancel = function () {

        location.reload();

        /* $scope.grid_refresh();
         $scope.showme = false;

         if ($scope.data_set.form_data.length <= 0)
         {

         $scope.data_widget = false;
         $scope.clear_form();
         $scope.unit_price_span_gl = 0;
         $scope.TOT_qty_span_gl = 0;
         $scope.GIN_total_price = 0;
         $scope.GIN_total_price_gl = 0;
         $scope.GIN_qty = 0;
         $scope.available_qty = 0;
         $scope.TOT_qty_span = 0;
         $scope.delete_total_val = 0;


         }*/

    };

    $scope.save_data_grid = function () {
        $scope.enable_loading = true;

        $scope.data_set.common.push({
            invoice_no: $scope.GI_invoice_no,
            Total_price: $scope.GIN_total_price,
            GIN_qty: $scope.GIN_qty,
            discount: $scope.gi_discount,
            invoice_date: $scope.GI_invoice_date,
            gin_no: $scope.GIN_no_span,
            company_id: company_id,
            customer: $scope.customer.person_id,
            user_id: user_id
        });

        $.ajax({
            url: base_url+"inventory_save/gi_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
                if (response == 1) {
                    alert("GIN Inserted Successfully");
                    $scope.$apply(function () //to reset dropdown
                    {
                        $scope.data_set = [];
                        $scope.data_set = {form_data: [], common: [], selected: {}};
                        $scope.grid_refresh();
                        $scope.showme = false;
                        $scope.customer = "";
                    });

                    //console.log($scope.data_set);
                } else
                    alert("Save Faild");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Save Failed");
                $scope.load_complete = true;

            }
        });
    };
    //============================ End Button Event ============================
    $scope.db_data = [];
    $scope.grid_refresh = function () {
        $.ajax({
            url: base_url+"Inventory_load/get_gin_grid",
            type: "POST",
            dataType: 'json',
            //data: {"modelID": modelID},
            success: function (response) {
                var res_data;
                if(typeof response['data'] !== 'undefined'){
                    res_data=response['data'];
                }else res_data=0;

                console.log(response);
                $scope.$apply(function () //to reset dropdown
                {

                    oTable.fnClearTable();

                    for (var i = 0; i < res_data.length; i++) {
                        oTable.fnAddData([
                            i + 1,
                            res_data[i][1],
                            res_data[i][2],
                            res_data[i][3],
                            //'serial no',
                            //response[i]['model_cost_price'],
                            res_data[i][4],
                            res_data[i][5],
                            res_data[i][6]
                            //response[i]['supplier_name'],

                        ],false);

                    }
                    oTable.fnDraw();

                    $scope.load_complete = true;
                });
                //console.log($scope.db_data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);
                //alert(thrownError + " Loading Failed");
                //$scope.load_complete = true;
                location.reload();

            }
        });
    };

    //Popup Grid Load Function
    $scope.popup_grid_refresh = function (data_id, item_no, reference_number, person_name, ref_date) {
        //alert(id);
        //alert(item_no);


        $.ajax({
            url:base_url+"Inventory_load/popup_data",
            type: "POST",
            dataType: 'json',
            data: //"data_id=" +data_id+""
            '{"data_id":' + data_id + ', "note_type_id":6}'
            ,
            success: function (response) {
                //console.log(response);
                $scope.total_note_price = 0;
                $scope.total_note_qty = 0;
                $scope.$apply(function () //to reset popup
                {
                    $scope.print_array = response;

                    $scope.popup_note_no = item_no;
                    $scope.popup_note_ref = reference_number;
                    $scope.popup_note_person = person_name;
                    $scope.popup_note_date = ref_date;

                    infoTable.fnClearTable();
                    for (var i = 0; i < response.length; i++) {
                        //Test Sample ONLY
                        infoTable.fnAddData([i + 1,
                            response[i]['manufacture_name'] + ' ' + response[i]['model_name'],
                            response[i]['model_code'],
                            response[i]['selling_price'],
                            response[i]['inventory_item_qty'],
                            response[i]['item_prices']
                        ]);
                        $scope.total_note_qty += parseFloat(response[i]['inventory_item_qty']);
                        $scope.total_note_price += parseFloat(response[i]['item_prices']);
                    }

                    Math.abs($scope.total_note_price).toFixed(2);
                    //$scope.load_complete = true;
                });
                //console.log($scope.db_data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Popup Loading  Failed");
                $scope.load_complete = true;

            }

        });
        //console.log(pop_up_data_array);
    };

    $scope.grid_refresh();

    $scope.is_set_invoce_no = function () {
        var is_call = $scope.GI_invoice_no;
        // alert($scope.GI_invoice_date);
        if ($scope.GI_invoice_date != '') {
            $.ajax({
                url: base_url+"Inventory_load/get_gin_invoice_no",
                type: "POST",
                dataType: 'json',
                data: {"Invoice_no": is_call},
                success: function (response) {
                    console.log(response);

                    $scope.$apply(function () //to reset dropdown
                    {
                        check_invoice = response;
                        //  alert(check_invoice[0]['check_invoice']);
                        if (check_invoice[0]['check_invoice'] != 0) {
                            $scope.data_widget = true;
                            alert('This Invoice Already Added ');
                        } else {
                            $scope.data_widget = false;
                            $scope.GIN_invoice_span = is_call;
                            // document.getElementById("GI_invoice_no").className = "hidden";
                            $scope.GIN_invoice_date_span = $scope.GI_invoice_date;
                            // document.getElementById("GI_invoice_date").className = "hidden";
                        }
                        // $scope.GIN_no_span = gin_no;
                    });
                    //console.log($scope.db_data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    //alert(xhr.responseText);

                    alert(thrownError + " Invoice No  Loading  Failed");
                    $scope.load_complete = true;

                }

            });
        } else {

            alert('Invalid date');
        }

        //alert(is_call);

    };
    // item search ----------------------
    $scope.get_item_code_search = function () {
        var item_code = $scope.item_code;
        var data_count = 0;

        // $scope.models=$scope.models_old;
        //alert($scope.model.model_id) ;
        $.ajax({
            url:base_url+"Inventory_load/get_item_code_search",
            type: "POST",
            dataType: 'json',
            data: {"Item_code": item_code},
            success: function (response) {
                console.log(response);
                // alert(response.item_typeID[0]['manufacture_id']);
                data_count = response.item_typeID.length;

                $scope.$apply(function () //to reset dropdown
                {
                    if (data_count == 1) {


                        $scope.item_code = response.item_typeID[0]['model_code'];
                        $scope.unit_cost = response.item_typeID[0]['model_cost_price'];
                        //q = $scope.array_search($scope.manufactures,'manufacture_id', response.item_typeID[0]['model_id']);
                        // alert($scope.array_search($scope.models, 'model_id', response.item_typeID[0]['model_id']));
                        $scope.manufacture = $scope.manufactures[$scope.array_search($scope.manufactures, 'manufacture_id', response.item_typeID[0]['manufacture_id'])];
                        $scope.model = $scope.models[$scope.array_search($scope.models, 'model_id', response.item_typeID[0]['model_id'])];
                        //  manufacture_element.value = response.item_typeID[0]['manufacture_id'];
                        // $scope.manufacture = response.item_typeID[0]['manufacture_id'];
                        //  model_element.value = response.item_typeID[0]['model_id'];

                    } else {

                        $scope.item_code = '';
                        $scope.manufac = $scope.manufactures[''];
                        $scope.model = $scope.models[''];
                    }
                    if (response.price_qty.length > 0) {

                        if (response.price_qty[0]['total_qty'] != null) {
                            if (typeof ($scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])) != 'undefined') {

                                $scope.TOT_qty_span = (response.price_qty[0]['total_qty']) - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])].qty;
                                $scope.TOT_qty_span_gl = (response.price_qty[0]['total_qty']) - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])].qty;
                                $scope.available_qty = (response.price_qty[0]['total_qty']) - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])].qty;
                            } else {

                                $scope.TOT_qty_span = response.price_qty[0]['total_qty'];
                                $scope.TOT_qty_span_gl = response.price_qty[0]['total_qty'];
                                $scope.available_qty = response.price_qty[0]['total_qty'];
                            }
                        } else {
                            $scope.TOT_qty_span = 0;
                            $scope.TOT_qty_span_gl = 0;
                            $scope.available_qty = 0;
                        }
                        if (response.price_qty[0]['model_price'] != '') {
                            $scope.unit_price_span = response.price_qty[0]['model_price'];
                            $scope.unit_price_span_gl = response.price_qty[0]['model_price'];
                        } else {
                            $scope.unit_price_span = 0;
                            $scope.unit_price_span_gl = 0;
                        }

                    } else {
                        $scope.TOT_qty_span = 0;
                        $scope.unit_price_span = 0;
                    }
                });
                //console.log($scope.db_data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + "Code search Loading  Failed");
                $scope.load_complete = true;

            }

        });
    };

    $scope.get_item_manufacture_search = function () {

        var manufacture = $scope.manufacture;

        var data_count = 0;
        // $scope.models=$scope.models_old;
        //alert($scope.manufacture.manufacture_id) ;
        $.ajax({
            url: base_url+"Inventory_load/get_item_manufacture_search",
            type: "POST",
            dataType: 'json',
            data: {"manufacture": manufacture},
            success: function (response) {
                console.log(response);
                // alert(response.item_typeID[0]['model_id']-1);
                data_count = response.item_typeID.length;
                $scope.$apply(function () //to reset dropdown
                {

                    if (data_count >= 1) {

                        $scope.item_code = '';
                        // $scope.manufac = $scope.manufactures[response.item_typeID[0]['manufacture_id'] - 1];
                        $scope.models = response.item_typeID;

                    } else {

                        $scope.item_code = '';
                        $scope.manufacture = $scope.manufactures[''];
                        $scope.model = $scope.models[''];
                    }
                    if (response.price_qty.length > 0) {
                        $scope.TOT_qty_span = response.price_qty[0]['total_qty'];
                        $scope.unit_price_span = response.price_qty[0]['model_retail_price'];
                        $scope.unit_price_span_gl = response.price_qty[0]['model_retail_price'];
                        $scope.TOT_qty_span_gl = response.price_qty[0]['total_qty'];
                        $scope.available_qty = response.price_qty[0]['total_qty'];
                    } else {
                        $scope.TOT_qty_span = 0;
                        $scope.unit_price_span = 0;
                        $scope.available_qty = 0;
                    }
                });
                //console.log($scope.db_data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Manufacture Search Failed");
                $scope.load_complete = true;

            }

        });
    };

    $scope.get_item_model_search = function () {

        //var model = $scope.model;
        var data_count = 0;
        // $scope.models=$scope.models_old;
        // alert($scope.model.model_id) ;
        $.ajax({
            url: base_url+"Inventory_load/get_item_model_search",
            type: "POST",
            dataType: 'json',
            data: {"model": $scope.model.model_id},
            success: function (response) {
                console.log(response);
                // alert(response.item_typeID[0]['model_id']-1);
                data_count = response.item_typeID.length;
                $scope.$apply(function () //to reset dropdown
                {
                    var model_element = document.getElementById('dropdown_model');
                    var manufacture_element = document.getElementById('dropdown_manifacture');
                    if (data_count == 1) {
                        //$scope.manufacture = response.item_typeID[0]['manufacture_id'];

                        $scope.item_code = response.item_typeID[0]['model_code'];
                        // manufacture_element.value = response.item_typeID[0]['manufacture_id'];
                        // model_element.value = response.item_typeID[0]['model_id'];
                        $scope.unit_cost = response.item_typeID[0]['model_cost_price'];
                        //$scope.manufacture = $scope.manufactures.[3];
                        $scope.manufacture = $scope.manufactures[$scope.array_search($scope.manufactures, 'manufacture_id', response.item_typeID[0]['manufacture_id'])];
                        $scope.model = $scope.models[$scope.array_search($scope.models, 'model_id', response.item_typeID[0]['model_id'])];

                    } else {

                        $scope.item_code = '';
                        manufacture_element.value = " ";
                        $("#dropdown_model").val($("#dropdown_model").data("default-value"));
                        $scope.req_qty = '';
                        $scope.total_price = '';
                    }
                    if (response.price_qty.length > 0) {
                        if (response.price_qty[0]['total_qty'] != null) {
                            if (typeof ($scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])) != 'undefined') {

                                $scope.TOT_qty_span = (response.price_qty[0]['total_qty']) - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])].qty;
                                $scope.TOT_qty_span_gl = (response.price_qty[0]['total_qty']) - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])].qty;
                                $scope.available_qty = (response.price_qty[0]['total_qty']) - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'item_code', response.item_typeID[0]['model_code'])].qty;
                            } else {

                                $scope.TOT_qty_span = response.price_qty[0]['total_qty'];
                                $scope.TOT_qty_span_gl = response.price_qty[0]['total_qty'];
                                $scope.available_qty = response.price_qty[0]['total_qty'];
                            }
                        } else {
                            $scope.TOT_qty_span = 0;
                            $scope.TOT_qty_span_gl = 0;
                            $scope.available_qty = 0;
                        }
                        if (response.price_qty[0]['model_price'] != '') {
                            $scope.unit_price_span = response.price_qty[0]['model_price'];
                            $scope.unit_price_span_gl = response.price_qty[0]['model_price'];
                        } else {
                            $scope.unit_price_span = 0;
                            $scope.unit_price_span_gl = 0;
                        }

                        $scope.req_qty = '';
                        $scope.total_price = '';
                    } else {
                        $scope.TOT_qty_span = 0;
                        $scope.unit_price_span = 0;
                    }
                });
                //console.log($scope.db_data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Model Search Loading  Failed");
                $scope.load_complete = true;

            }

        });
    };

    //----------------------------------------------------------

    $scope.calculate_price = function () {

        if ($scope.req_qty != "") {
            $scope.total_price = ($scope.req_qty * $scope.unit_price_span).toFixed(2);
            $scope.TOT_qty_span = parseInt($scope.TOT_qty_span_gl) - parseInt($scope.req_qty);

        } else {
            $scope.total_price = "";
            $scope.TOT_qty_span = parseInt($scope.TOT_qty_span_gl) - 0;

        }
    };
    $scope.set_setoff_value = function () {

        if ($scope.set_off.length > 0) {

            $scope.unit_price_span = $scope.set_off;
            $scope.calculate_price();
        } else {

            $scope.unit_price_span = $scope.unit_price_span_gl;
            $scope.calculate_price();
        }

    };

    $scope.calculate_discount = function () {

        if ($scope.gi_discount.length > 0) {
            $scope.GIN_total_price = parseInt($scope.GIN_total_price_gl) - parseInt($scope.gi_discount);

        } else {

            $scope.GIN_total_price = $scope.GIN_total_price_gl;

        }
    };

    $scope.clear_form = function (index) {
        $scope.manufacture = "";
        $scope.model = "";
        $scope.item_code = "";
        $scope.req_qty = "";
        $scope.total_price = "";
        $scope.TOT_qty_span = 0;
        $scope.TOT_qty_span_gl = 0;
        $scope.available_qty = 0;
        $scope.unit_price_span = 0;
    };

    $scope.array_search = function (array, index, string) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][index] === string) {
                return i;
            }

        }
    };

    $scope.load_complete = true;

});
