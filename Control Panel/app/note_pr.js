biziApp.controller('note_prController', function ($scope, $route,$templateCache,datatables_service) {
    // create a message to display in our view
    //$(window).trigger('resize');

    var save_data = [];
    var DM = document.getElementById("dropdown_manifacture");//
    var DS = document.getElementById("dropdown_supplier");


    var prn_qty = 0;
    var stock_on_hand = 0;
    var grn_id = null;
    var supplier_id = null;
    var serial_array = {};
    var invoice_serials = [];
    $scope.bulk_type = '';
    var begin, end;
    $scope.filteredTodos = [],
        $scope.currentPage = 1,
        $scope.numPerPage = 10,
        $scope.maxSize = 5,
        $scope.itemNumber = 0;
    $scope.data_set = {form_data: [], common: [], selected: {}, serial: []};


    $scope.$watch('currentPage + numPerPage', function () {
        $scope.paging();
        $scope.indexStartNo = begin;
        save_data = $scope.data_set;
    });
    $scope.removeItem = function (index) {

        if (confirm("Delete This Item?") == true) {
            prn_qty = prn_qty - parseInt($scope.data_set.form_data[index + $scope.indexStartNo]['quantity']);
            $scope.data_set.form_data.splice(index + $scope.indexStartNo, 1);
            $scope.paging();
            $scope.clear_form();
        } else {

        }
    };
    //clear save Data Grid (clear button function)
    $scope.clearItems = function (index) {

        if (confirm("Clear Current Data Set?") == true) {
            $scope.data_set.form_data = [];
             prn_qty = 0;
             stock_on_hand = 0;
             serial_array = {};
            $scope.paging();
            $scope.clear_form();
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
        prn_qty = prn_qty - parseInt($scope.data_set.form_data[index + $scope.indexStartNo]['quantity']);
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
    $scope.click_cancel = function () {

        if ($scope.data_set.form_data.length > 0) {
            var r = confirm("Discard Current PRN?");
            if (r == true) {
                var currentPageTemplate = $route.current.templateUrl;
                $templateCache.remove(currentPageTemplate);
                $route.reload();
            } else {
                //txt = "You pressed Cancel!";
            }

        }else {
            var currentPageTemplate = $route.current.templateUrl;
            $templateCache.remove(currentPageTemplate);
            $route.reload();
        }
    };

    //Serial Number Load()
    $scope.serial_popup = function (data_index, serial_item_name, model_id) {
        //console.log( serial_array);
        $scope.serial_display = [];
        $scope.view_serial_model_name = serial_item_name;
        $scope.view_serial_data_index = data_index;
        $scope.view_serial_data_model_id = model_id;
        $scope.serial_display = serial_array[model_id];
    };

    //Serial Number Remove()
    $scope.serial_remove = function (model_id, index) {
        if (confirm("Delete This Serial?") == true) {

            //alert(index);
            if (index > -1) {
                serial_array[model_id].splice(index, 1);

            }

            console.log(serial_array);

            if (serial_array[model_id].length > 0) {
                $scope.data_set.form_data[$scope.view_serial_data_index]['quantity'] = serial_array[model_id].length;
               // grn_qty = grn_qty - 1;
            } else {
                //$scope.removeItem($scope.view_serial_data_index);
                delete serial_array[model_id];
                $scope.data_set.form_data.splice($scope.view_serial_data_index, 1);
                $scope.paging();
               // grn_qty = grn_qty - 1;

                $('#serialModal').modal('toggle');
            }
            $scope.serial_display = [];
            $scope.serial_display = serial_array[model_id];
        }
    };

    //----------------------------------------- dropdown load ---------------------------------------------------------

    // ======================== button click event ========================================================
    $scope.save_data_grid = function () {
        $scope.data_set.serial = serial_array;
        $scope.data_set.common.push({
            PRN_qty: prn_qty,
            PRN_No: $scope.PRN_no_span,
            company_id: company_id,
            user_id: user_id,
            GRN_no: $scope.GRN_Receipt_no,
            grn_id: grn_id,
            supplier_id: supplier_id

        });

//alert(grn_id);
        $.ajax({
            url: base_url + "inventory_save/prn_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
                if (response == 1) {
                    alert("PRN Inserted Successfully");
                   /* $scope.$apply(function () //to reset dropdown
                    {

                        $scope.data_set = {form_data: [], common: [], selected: {}, serial: []};
                        $scope.grid_refresh();
                        $scope.showme = false;
                        $scope.module_datatables_show=true;
                        serial_array=[];
                    });
                    */
                    var currentPageTemplate = $route.current.templateUrl;
                    $templateCache.remove(currentPageTemplate);
                    $route.reload();


                   // console.log($scope.data_set);
                } else {
                    alert("Save Failed");
                    var currentPageTemplate = $route.current.templateUrl;
                    $templateCache.remove(currentPageTemplate);
                    $route.reload();
                }
                $scope.load_complete = true;
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Save Failed");
                $scope.load_complete = true;
                var currentPageTemplate = $route.current.templateUrl;
                $templateCache.remove(currentPageTemplate);
                $route.reload();

            }
        });
    };
    $scope.add_button_click = function () {
        $scope.showme = true;
        //$scope.edit_mode_enabled = false;
        //  $scope.show_fields = false;
        //$scope.show_bulk = true;
        //Clear txt Boxes
        $scope.module_datatables_show=false;
        $scope.hide_ref = false;
        $scope.model = "";
        $scope.Model_ID = "";
        $scope.M_serialno = "";
        $scope.GRN_Receipt_no = "";
        grn_id = null;
        $.ajax({
            url: base_url + "Inventory_load/get_prn_no",
            type: "POST",
            dataType: 'json',
            //data: {"modelID": modelID},
            success: function (response) {
                //console.log(response);
                $scope.$apply(function () //to reset dropdown
                {
                    prn_no = response;
                    $scope.PRN_no_span = prn_no;
                });
                //console.log($scope.db_data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Get PRN NO Failed");
                $scope.load_complete = true;

            }

        });

        // this.bigMessage = grn_no;

    };
    $scope.add_to_grid = function () {
        //Change this array according to the page

        // grn_qty = parseInt(grn_qty) + parseInt($scope.qty);
       // alert(" bulk type "+$scope.bulk_type);

        if ($scope.bulk_type == 1 || $scope.bulk_type == 2) {
            var is_serial_get = $scope.search_array($scope.item.model_id, $scope.serial);


        }
        else {
            is_serial_get = 1;
        }

       // alert("id"+$scope.item.model_id+"   val "+ $scope.serial);
       // alert($scope.serial_array_search($scope.item.model_id, $scope.serial));

        if ($scope.serial_array_search($scope.item.model_id, $scope.serial) == 'notfound') {

            if (is_serial_get != 0) {
                if (typeof($scope.array_search($scope.data_set.form_data, 'model_code', $scope.serialno)) != 'undefined') {
                    if (stock_on_hand >= ($scope.qty + $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'model_code', $scope.serialno)].quantity)) {
                        prn_qty = parseInt(prn_qty) + parseInt($scope.qty);
                        ($scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'model_code', $scope.serialno)].quantity) += parseInt($scope.qty);
                        stock_on_hand = 0;
                    }
                    else {
                        alert("Stock Not Available1");
                    }
                }

                else {
                    if (stock_on_hand >= $scope.qty) {
                        prn_qty = parseInt(prn_qty) + parseInt($scope.qty);
                        grn_id = $scope.item.note_id;
                        $scope.data_set.form_data.push({
                            id: $scope.itemNumber++,
                            model: $scope.item.model_name,
                            MO_ID: $scope.item.model_id,
                            M_ID: $scope.item.manufacture_id,
                            manufacture: $scope.item.manufacture_name,
                            model_code: $scope.serialno,
                            quantity: parseInt($scope.qty),
                            bulk_type: $scope.bulk_type,
                            cost: $scope.item.model_cost_price,
                            retail_price: $scope.item.model_retail_price
                        });

                        stock_on_hand = 0;
                    }
                    else {
                        alert("Stock Not Available");
                    }
                }

                if ($scope.bulk_type == 1 || $scope.bulk_type == 2) {

                    //   $scope.qty = 1;
                    //  alert($scope.item_serialno);
                    serial_array_add($scope.item.model_id, $scope.serial);

                }

            } else {

                alert('Invalid Serial');
            }


       }
       else {
           alert('Already in Grid');
        }
        console.log($scope.data_set);
        console.log(serial_array);

        $scope.clear_form();
        $scope.paging();
        $scope.currentPage = Math.ceil($scope.data_set.form_data.length / $scope.numPerPage);
    };

    //========================= End Button click event =================================================


    $scope.get_item_code_search = function () {
        var item_code = $scope.serialno;
        var data_count = 0;
        // $scope.models=$scope.models_old;
        //alert($scope.model.model_id) ;
        $.ajax({
            url: base_url + "Inventory_load/get_item_search_prn",
            type: "POST",
            dataType: 'json',
            data: {"Item_code": item_code, "grn_id": grn_id},
            success: function (response) {
                console.log(response);
                // alert(response.item_typeID[0]['model_id']-1);
                data_count = response.item_typeID.length;
                $scope.$apply(function () //to reset dropdown
                {
                    if (data_count == 1) {
                        $scope.item = $scope.items[$scope.array_search($scope.items, 'model_id', response.item_typeID[0]['model_id'])];

                        if (typeof ($scope.array_search($scope.data_set.form_data, 'model_code', response.item_typeID[0]['model_code'])) != 'undefined') {
                            $scope.PRN_qty_span = response.qty[0]['quntity'] - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'model_code', response.item_typeID[0]['model_code'])].quantity;
                        } else {
                            $scope.PRN_qty_span = response.qty[0]['quntity'];
                        }
                    }
                    else {

                        $scope.item = '';
                        $scope.PRN_qty_span = 0;

                    }


                });
                //console.log($scope.db_data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Item code search Failed");
                $scope.load_complete = true;

            }

        });
    };

    $scope.get_code = function () {

        // ajax call
        // alert($scope.item.model_id);
        $.ajax({
            url: base_url + "Inventory_load/get_code_prn",
            type: "POST",
            dataType: 'json',
            data: {"model": $scope.item.model_id, "grn_id": grn_id},
            success: function (response) {

                $scope.$apply(function () //to reset dropdown
                {
                    // alert(response.model_code[0]['model_current_stock_qty']);

                    if (response.model_code[0]['model_qty_type'] != 1) {
                        $scope.hide_qty = true;
                        $scope.hide_serial = false;

                        $scope.qty = '';
                    }
                    else {
                        $scope.hide_qty = false;
                        $scope.hide_serial = true;

                        $scope.qty = 1;
                    }

                    $scope.bulk_type = response.model_code[0]['model_qty_type'];

                    stock_on_hand = response.model_code[0]['model_current_stock_qty'];
                    console.log(response);
                    $scope.serialno = response.model_code[0]['model_code'];

                    if (typeof ($scope.array_search($scope.data_set.form_data, 'model_code', response.model_code[0]['model_code'])) != 'undefined') {
                        $scope.PRN_qty_span = response.qty[0]['quntity'] - $scope.data_set.form_data[$scope.array_search($scope.data_set.form_data, 'model_code', response.model_code[0]['model_code'])].quantity;
                    } else {
                        $scope.PRN_qty_span = response.qty[0]['quntity'];
                    }

                })
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Get code Failed");
                $scope.load_complete = true;

            }

        });

    };

    $scope.get_grn_no = function () {


        var GRN_no = $scope.GRN_Receipt_no;

        $.ajax({
            url: base_url + "Inventory_load/get_grn_invoice_details",
            type: "POST",
            dataType: 'json',
            data: {"Invoice_no": GRN_no},
            success: function (response) {
                console.log(response);
                $scope.$apply(function () //to reset dropdown
                {
                    check_invoice = response['supplier_id'];
                    supplier_id = response['supplier_id'];
                    invoice_serials = response['serial_nos'];
                    //alert(response.check_invoice[0]['customer_id']);customer_name
                    console.log(invoice_serials);
                    if (check_invoice != null) {
                        $scope.items = response['grn_items'];
                        // alert(response['grn_items'][0]['note_id']);
                        grn_id = response['grn_items'][0]['note_id'];
                        $scope.hide_ref = true;

                    } else {

                        alert('Invalid Invoice No ');
                    }
                    // $scope.GIN_no_span = gin_no;
                });
                //console.log($scope.db_data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Get GRN NO Failed");
                $scope.load_complete = true;

            }

        });

    };

    // Item List From database
    $scope.db_data = [];
    $scope.grid_refresh_nulled = function () {
        $.ajax({
            url: base_url + "Inventory_load/get_prn_grid",
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

    //$scope.load_complete = true;

    //Popup Grid Load Function
    $scope.popup_grid_refresh = function (data_id, item_no, reference_number, person_name, ref_date) {
        //alert(data_id);
        //alert(item_no);
        $.ajax({
            url: base_url + "Inventory_load/popup_data",
            type: "POST",
            dataType: 'json',
            data: //"data_id=" +data_id+""
            '{"data_id":' + data_id + ', "note_type_id":8}'
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
                            response[i]['buying_price'],
                            response[i]['inventory_item_qty'],
                            response[i]['item_costs']

                        ]);

                        $scope.total_note_qty += parseFloat(response[i]['inventory_item_qty']);
                        $scope.total_note_price += parseFloat(response[i]['item_costs']);

                    }

                    Math.abs($scope.total_note_price).toFixed(2);
                    //$scope.load_complete = true;
                });
                //console.log($scope.db_data);
            }

        });
        //console.log(pop_up_data_array);
    };


    $scope.array_search = function (array, index, string) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][index] === string) {
                return i;
            }

        }
    };




    function serial_array_add(model_id, serial_no) {

        if (typeof serial_array[model_id] != "undefined") {
            serial_array[model_id].push(serial_no);
        }
        else {
            serial_array[model_id] = [];
            serial_array[model_id].push(serial_no);
        }
    }

    $scope.search_array = function (model_id, string) {
        //alert(model_id+'  '+string);
        var result;
        if (typeof invoice_serials[model_id] != "undefined") {

            for (var i = 0; i < invoice_serials[model_id].length; i++) {
                //alert(invoice_serials[model_id][i]);
                if (invoice_serials[model_id][i] === string) {

                    result = 1;
                }

            }
            if (typeof result != "undefined") {
                return result;
            }
            else return 0;
        } else {
            return 0;
        }
    };

    $scope.serial_array_search = function (model_id, string) {
        if (typeof serial_array[model_id] != "undefined") {

            for (var i = 0; i < serial_array[model_id].length; i++) {

                if (typeof serial_array[model_id][i] != "undefined") {
                    if (serial_array[model_id][i] === string) {
                        return i;
                    }
                    else {

                        if (serial_array[model_id].length - 1 === i) {

                            if (serial_array[model_id][i] === string) {
                                return i;
                            }
                            else {
                                return 'notfound';
                            }
                        }
                    }

                }else {
                    return 'notfound';
                }
            }

        } else {
            return 'notfound';
        }
    };

    $scope.clear_form = function () {

        $scope.qty = "";
        $scope.PRN_qty_span = 0;
        $scope.serialno = "";
        $scope.item = "";

        $scope.serial="";//TXT Serial
        $scope.hide_serial=false;
    };

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

    $scope.grid_refresh = function (init) {
        $scope.module_datatables_show=true;
        $scope.load_complete=datatables_service.grid_refresh($scope.start_date,$scope.end_date,init);


    };
    $scope.grid_refresh(true);

});
