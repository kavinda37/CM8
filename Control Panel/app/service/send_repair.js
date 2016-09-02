biziApp.controller('send_repairController', function ($scope, datatables_service) {
// Item List From database
    //Defaults
    $scope.start_date = null;
    $scope.end_date = null;
    $scope.sub_label = 'All';
    $scope.data_set = {form_data: [], selected: {}};


    $scope.repair_id = 0;
    $scope.invoice_total_price = 0;
    $scope.invoice_discount_price = 0;
    $scope.invoice_cash_price = 0;
    $scope.invoice_card_price = 0;
    $scope.invoice_cheque_price = 0;
    $scope.invoice_credit_price = 0;
    $scope.hide_print_units=true;


    $scope.grid_display_data = 'In Progress';

    $scope.data_cus = {
        customers: [],
        select_customer: {}
    };

    //Date range as a button
    $('#daterange-btn').daterangepicker(
        {
            ranges: {
                'All': [moment().subtract(1, 'days'), moment()],
                'Today': [moment(), moment()],
                'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                'This Month': [moment().startOf('month'), moment().endOf('month')],
                'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
            },
            startDate: moment().subtract(1, 'days'),//Set Default Range
            endDate: moment()
        },
        function (start, end, label) {
            //$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
            //console.log(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));

            $scope.$apply(function () //to reset dropdown
            {
                if (label == "All") {
                    $scope.start_date = null;
                    $scope.end_date = null;
                } else {
                    $scope.start_date = start.format('YYYY-MM-DD');
                    $scope.end_date = end.format('YYYY-MM-DD');
                }

                $scope.sub_label = label;
                $scope.call_grid_refresh();
            });

        }
    );
    //======= add repair items =============================================
    $scope.add_repair_item = function () {
        $scope.modal_size='modal-sm';
        $scope.show_add_customer = false;
        $scope.add_item_repair_clear();
        $("#add_repair_item_modal").modal("show");
        $scope.load_customers();

    };

    $scope.load_customers = function () {
        $.ajax({
            url: base_url + "Inventory_load/add_button",
            type: "POST",
            dataType: 'json',
            data: {"button_location": 'Send_Repair'},
            success: function (response) {
                $scope.$apply(function () {
                    $scope.customers = response['customers'];

                })
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);
                alert(thrownError + " load  Failed");


            }

        });

    };

    $scope.add_repair_item_save = function () {


        $scope.data_set = {form_data: [], selected: {}};
        $scope.data_set.form_data.push({
            customer_id: $scope.data_cus.select_customer.person_id,
            item: $scope.item_name,
            serial: $scope.item_serial
        });

        $.ajax({
            url: base_url + "service/Post/add_repair_item_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
                if (response['code'] == 200) {
                    alert(response['message']);
                    $scope.$apply(function () //to reset dropdown
                    {
                        $scope.data_set = {form_data: [], selected: {}};
                        $("#add_repair_item_modal").modal("hide");
                        $scope.call_grid_refresh();

                    });
                    // console.log($scope.data_set);
                } else
                    alert("Save Faild");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Save  Failed");


            }
        });
    };

    $scope.add_item_repair_clear = function () {
        $scope.data_cus.select_customer = '';
        $scope.item_name = '';
        $scope.item_serial = '';

    };

    //============end add repair items ====================================

    $scope.index_data_to_scope = function (data) {
        //alert(data['status']);


        if (data['status'] == 1) {
            $scope.send_item_modal(data);
        }
        if (data['status'] == 2) {
            $scope.recive_item_modal(data);
        }
        if (data['status'] == 3 || data['status'] == 4) {
            $scope.payment_popup(data);
        }

        if (data['status'] == "info") {
            $scope.item_info_modal(data);
        }

    };

    $scope.item_info_modal=function(data){


        var data_set={};
        data_set['data_id']=data['repair_id'];


        $.ajax({
            url: base_url + "service/get/get_repair_note_info",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify(data_set),
            success: function (response) {
                console.log(response);
                if (response['code'] == 200) {
                    //alert(response['message']);
                    $scope.$apply(function () //to reset dropdown
                    {
                        $("#item_info_modal").modal("show");
                        $scope.info_data_from_btn=data;
                        $scope.info_data_from_server=response['data'];



                    });
                    // console.log($scope.data_set);
                } else
                    alert("Save Failed");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Save  Failed");


            }
        });

    };

    //======= Send repair items =============================================
    $scope.send_item_modal = function (data) {


        $("#send_item_modal").modal("show");
        $scope.repair_id = data['repair_id'];

        $.ajax({
            url: base_url + "Inventory_load/add_button",
            type: "POST",
            dataType: 'json',
            data: {"button_location": 'Send_Item'},
            success: function (response) {

                $scope.$apply(function () //to reset dropdown
                {
                    $scope.suppliers = response['suppliers'];

                });
                console.log(response);
            }

        });
    };

    $scope.send_item_save = function () {


        $scope.data_set = {form_data: [], selected: {}};
        $scope.data_set.form_data.push({
            supplier_id: $scope.supplier.person_id,
            date: $("#send_repair_date").text(),
            repair_id: $scope.repair_id
        });
        $.ajax({
            url: base_url + "service/Put/send_repair_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
                if (response['code'] == 200) {
                    alert(response['message']);
                    $scope.$apply(function () //to reset dropdown
                    {
                        $scope.data_set = {form_data: [], selected: {}};
                        $("#send_item_modal").modal("hide");
                        $scope.supplier = '';
                        $scope.repair_id = 0;
                        $scope.call_grid_refresh();

                    });
                    // console.log($scope.data_set);
                } else
                    alert("Save Failed");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Save  Failed");


            }
        });
    };

    //======= end send repair items =============================================
    //======= Receive repair items =============================================

    $scope.recive_item_modal = function (data) {
        $("#recive_item_modal").modal("show");
        $scope.repair_id = data['repair_id'];
    };



    $scope.receive_item_save = function (state) {


        $scope.data_set = {form_data: [], selected: {}};
        $scope.data_set.form_data.push({
            cost: $scope.repair_cost,
            service_charge: $scope.service_charge,
            date: $("#recive_item_date").text(),
            state: state,
            repair_id: $scope.repair_id
        });
        $.ajax({
            url: base_url + "service/Put/receive_repair_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
                if (response['code'] == 200) {
                    alert(response['message']);
                    $scope.$apply(function () //to reset dropdown
                    {
                        $scope.data_set = {form_data: [], selected: {}};
                        $("#recive_item_modal").modal("hide");
                        $scope.repair_cost = '';
                        $scope.service_charge = '';
                        $scope.repair_id = 0;
                        $scope.call_grid_refresh();

                    });
                    // console.log($scope.data_set);
                } else
                    alert("Save Failed");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Save  Failed");


            }
        });
    };
    //======= End Receive repair items =============================================

    //Payment Popup-----------------------------------------------------

    $scope.note_string = 'Person';
    $scope.card_type = 'visa';
    $scope.show_save_print=false;

    $scope.payment_clear = function () {
        $scope.invoice_total_price = 0;
        $scope.invoice_discount_price = 0;
        $scope.invoice_cash_price = 0;
        $scope.invoice_card_price = 0;
        $scope.invoice_cheque_price = 0;
        $scope.invoice_credit_price = 0;
        $scope.txt_cheque_number = '';
        $scope.txt_discount_amount = '';
        $scope.txt_cash_amount = '';
        $scope.txt_card_amount = '';
        $scope.txt_cheque_amount = '';
        $scope.txt_credit_amount = '';
        $scope.popup_note_type = '';
        $scope.popup_note_id = '';
        $scope.popup_note_no = '';
    };

    $scope.payment_popup = function (data) {

        $('#toggle-two').bootstrapToggle('on');
        $('#toggle-two').bootstrapToggle('disable');
        $scope.$apply(function () //to reset dropdown
        {

            $scope.invoice_total_price = data['total_value'];
            $scope.repair_id = data['repair_id'];
            $scope.job_number = data['job_number'];
            $scope.state = data['status'];

            $scope.txt_discount_amount = '';
            $scope.txt_cash_amount = '';
            $scope.txt_card_amount = '';
            $scope.txt_cheque_amount = '';
            $scope.txt_credit_amount = '';

            $scope.discount_view = false;
            $scope.card_view = false;
            $scope.cheque_view = false;
            $scope.credit_view = false;

            $scope.hide_discount = false;
            $scope.hide_credit = false;

            $scope.show_person_name = true;
            $scope.popup_person_id = data['person_id'];
            $scope.person_name_display = data['person_code'] + '-' + data['person_name'];
        });

        $('#payment_modal').modal('show');
    };

    $scope.save_data_grid = function (is_print, is_pending) {
        $scope.payments = {
            "Cash": $scope.invoice_cash_price,
            "Card": $scope.invoice_card_price,
            "Cheque": $scope.invoice_cheque_price,
            "Credit": $scope.invoice_credit_price
        };

        $scope.enable_loading = true;
        $scope.cheque_date = '2016-06-04';
        $scope.credit_date = '2016-06-04';

        $scope.data_set.form_data.push({
            repair_id: $scope.repair_id,
            job_number: $scope.job_number,
            Total_price: $scope.invoice_total_price,
            discount: $scope.invoice_discount_price,
            cheque_number: $scope.txt_cheque_number,
            cheque_date: $scope.cheque_date,
            credit_date: $scope.credit_date,
            card_type: $scope.card_type,
            payment_method: $scope.payments,
            state: $scope.state,
            customer_id: $scope.popup_person_id

        });

        console.log($scope.data_set);

        $.ajax({
            url: base_url + "service/Post/payment_repair_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
                if (response['code'] == 200) {
                    alert(response['message']);
                    $scope.$apply(function () {
                        if (is_print == true) {
                            //alert('print');
                            $scope.popup_grid_refresh(
                                response['note_id'],
                                response['invoice_no'] + '~' + $scope.invoice_discount_price,
                                current_users_name,
                                $scope.data_cus.select_customer.customer_name,
                                moment().format('YYYY-MM-DD'));

                            $("#toPrint").printThis();
                        }

                        $scope.data_set = {form_data: [], selected: {}};
                        $("#payment_modal").modal("hide");
                        $scope.payment_clear();
                        $scope.repair_id = 0;
                        $scope.sub_label = 'Delivered';
                        $scope.grid_display_data='Delivered';
                        $scope.call_grid_refresh();

                    });

                } else
                    alert("Save Faild");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Save Failed");

            }
        });
    };

    //END Payment Popup-----------------------------------------------------

    $scope.grid_refresh = function (start, end, init, filter) {

        var data_set = {};
        var is_succss = true;
        data_set['start_date'] = start;
        data_set['end_date'] = end;
        data_set['filter'] = filter;

        $.ajax({
            url: base_url + ajax_data_function,
            type: "POST",
            dataType: 'json',
            data: JSON.stringify(data_set),
            success: function (response) {
                //$scope.module_datatables_show=true;
                //console.log(response);
                if (response['logged_in'] == true) {
                    var res_data;
                    if (typeof response['data'] !== 'undefined') {
                        res_data = response['data'];
                    } else res_data = 0;

                    //console.log(response);
                    var no_sort_last = false;
                    if (typeof response['no_sort_last'] != 'undefined') {
                        no_sort_last = true;
                    }

                    if (init == true) {

                        //Initialize Datatables (In Custom Functions)
                        var array_column = [];
                        // array_column['class']=[];

                        array_column['title'] = response['title'];
                        //array_column['class'][4]='hidden';

                        oTable = datatables_service.init_data_table(data_grid_id, array_column, true, no_sort_last);
                        //End Initialize Datatables (In Custom Functions)

                    }


                    if (oTable != null)oTable.fnClearTable();


                    for (var i = 0; i < res_data.length; i++) {
                        oTable.fnAddData(res_data[i], false);
                    }
                    oTable.fnDraw();


                } else location.reload();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                alert("Load Error");
                is_succss = false;
            }

        });

        // table.row.add( [ '1', '2', '3', '4','5','600','700' ] ).draw();
        current_ajax_path = ajax_data_function;
        return is_succss;

    };

    $scope.call_grid_refresh = function () {
        $scope.load_complete = $scope.grid_refresh($scope.start_date, $scope.end_date, false, $scope.grid_display_data);
    };



    var tp_input_id='#masked_phone_no_sr';
    var masked_phone_number_customer="";
    $(tp_input_id).inputmask({"mask": "(999) 999-9999"}); //specifying options
    $(tp_input_id).inputmask("(999) 999-9999",{
        "oncomplete": function(){ masked_phone_number_customer=$(tp_input_id).val();},
        "onincomplete": function(){ masked_phone_number_customer=""; },
        "oncleared": function(){ masked_phone_number_customer="";  }
    });

    $scope.customer_save=function(){

        $scope.data_set = {form_data: [], selected: {}};
        $scope.data_set.form_data.push({
            name: $scope.customer_name_txt,
            customer_code: $scope.customer_code_txt,
            phone: masked_phone_number_customer,
            street1: $scope.street1,
            street2: $scope.street2,
            province: $scope.province,
            postal_code: $scope.postal_code,
            city: $scope.customer_city
        });
        $.ajax({
            url: base_url + "service/post/customer_save",
            type: "POST",
            dataType: 'json',
            data: JSON.stringify($scope.data_set),
            success: function (response) {
                console.log(response);
                if (response['code'] == 200) {
                    alert(response['message']);
                    $scope.$apply(function () //to reset dropdown
                    {
                        $(tp_input_id).val('');
                        $scope.data_set = {form_data: [], selected: {}};
                        $scope.show_add_customer = false;
                        $scope.load_customers();
                        $scope.customer_name_txt="";
                        $scope.street1="";
                        $scope.customer_city="";
                        $scope.show_add_customer = false;
                        $scope.province = '';
                        $scope.customer_code_txt = '';
                        $scope.street2 = '';
                        $scope.customer_email = '';
                        $scope.postal_code = '';
                    });
                    // console.log($scope.data_set);
                } else
                    alert("Save Failed");
            },
            error: function (xhr, ajaxOptions, thrownError) {
                //alert(xhr.responseText);

                alert(thrownError + " Save  Failed");


            }
        });

    };



    $scope.module_datatables_show = true;
    $scope.load_complete = $scope.grid_refresh($scope.start_date, $scope.end_date, true, $scope.grid_display_data);

    //Initialize Print
    $("#simplePrint").click(function () {

        $("#toPrint").printThis({
            debug: false,              // show the iframe for debugging
            importCSS: true,           // import page CSS
            printContainer: true,      // grab outer container as well as the contents of the selector
            //loadCSS: "path/to/my.css", // path to additional css file
            pageTitle: "<?php echo $company_name; ?> - <?php echo ucfirst(str_replace('_', ' ', $page_name)); ?>",             // add title to print page
            removeInline: false        // remove all inline styles from print elements
        });

    });

    //$(window).trigger('resize');
});