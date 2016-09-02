// to pass to angular function
function get_popup_index(data_id, item_no, reference_number, person_name, ref_date) {
    angular.element(document.getElementById('inventoryApp')).scope().popup_grid_refresh(data_id, item_no, reference_number, person_name, ref_date);
}

function index_to_scope(data_id) {
    angular.element(document.getElementById('inventoryApp')).scope().popup_grid_refresh(data_id);
}

//new test Dynamic Func
function index_to_scope_func(data,func) {
    if(func=='default')angular.element(document.getElementById('inventoryApp')).scope().index_data_to_scope(data);
    if(func=='payment_popup')angular.element(document.getElementById('inventoryApp')).scope().payment_popup(data);
}




/*

 // Angular Directive to remove HTML Classes after DOM
 angular.module("biziApp").directive('removeClass', function(){
 return {
 restrict: 'A',
 link: function(scope,element, attrs){
 element.removeClass(attrs.removeClass);
 }
 };
 });*/


angular.module("biziApp").directive('dlKeyCode', dlKeyCode);
function dlKeyCode() {
    return {
        restrict: 'A',
        link: function ($scope, $element, $attrs) {
            $element.bind("keypress", function (event) {
                var keyCode = event.which || event.keyCode;
                if (keyCode == $attrs.code) {
                    $scope.$apply(function () {
                        $scope.$eval($attrs.dlKeyCode, {$event: event});
                    });
                } else {
                    $scope.$apply(function () {
                        $scope.model = '';
                        $scope.manufacture = '';
                    });
                }
            });
        }
    };
}

// Angular Directive to remove HTML Classes after DOM
angular.module("biziApp").directive('removeClass', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.removeClass(attrs.removeClass);
        }
    };
});

angular.module("biziApp").factory('pass_data_service', function() {
    //var global_data_variable = {};
    var global_data_variable;
    function set_data(data) {
        global_data_variable = data;
    }
    function get_data() {
        return global_data_variable;
    }

    function unset_data() {
        var unset_variable;
        global_data_variable=unset_variable;
    }

    return {
        set_data: set_data,
        get_data: get_data,
        unset_data : unset_data
    }

});

angular.module("biziApp").service('datatables_service', function() {

    /*
     //Initialize Datatables (In Custom Functions)
     var array_column=[];
     array_column['class']=[];

     array_column['title'] =["#", "column01", "column02","column03","column04","column05", "column06"];
     array_column['class'][4]='hidden';

     var oTable=datatables_service.init_data_table('#db_data_grid',array_column,true);
     */

    var self = this;
    var oTable=null;
    var current_ajax_path=null;

    self.init_data_table= function(table_id,columns,number_col,no_sort_last) {


            //create JSON array for aoColumnDefs
            var array_column_names =columns['title'];

            var aryJSONColTable = [];
            var print_columns=[];
            var sClass, sWidth,bSortable;

            for (var i=0; i < array_column_names.length; i++ ) {
                sClass='';
                sWidth='';
                print_columns.push(i);
                if(typeof columns['class']!= 'undefined') {
                    if (typeof columns['class'][i] != 'undefined') {
                        sClass = columns['class'][i];
                    }
                }

                sWidth="auto";
                bSortable=true;

                if(no_sort_last==true && (array_column_names.length-1)==i){
                    sWidth="35px";
                    bSortable=false;
                }
                if(number_col==true && i==0){
                    sWidth="15px";
                }

                aryJSONColTable.push({
                    "sTitle": array_column_names[i],
                    "aTargets": [i],
                    "bSortable": bSortable,
                    "sWidth": sWidth,
                    "sClass": sClass
                });
            }


            var last_sort_hide;
                if(no_sort_last==true) {
                    /*last_sort_hide = [
                        {'bSortable': false, 'aTargets': [-1], "sWidth": "35px", "sClass": "hidden-xs"}
                    ];*/


                }else last_sort_hide='';



        var print_button='';
        var print_button_dom='';


            var oDatatable = $(table_id).dataTable({

                /*dom: '<"row"<"col-md-6"<"row"<"col-sm-2"B><"col-sm-10"l>>><"col-md-6"f>>rt<"row"<"col-md-6"i><"col-md-6"p>>',
                buttons: [
                    {
                        extend: 'print',
                        text: '<button  class="btn btn-md btn-flat btn-default pull-left" style="height:30px;"><i style="position:relative;top:-2px;" class="fa fa-print"></i></button>',
                        exportOptions: {
                            columns: print_columns
                        },
                        autoPrint: true
                    }
                ],*/
                "bServerSide": false,
                "aoColumnDefs":aryJSONColTable,

                /*"columns": [
                    { "title": "#" },
                    { "title": "Note" },
                    { "title": "Model Code" },
                    { "title": "Model Code" },
                    { "title": "Model Code" },
                    { "title": "Image" }
                ],*/

                /*"ajax": {
                 "url": '<?php echo base_url(); ?>Inventory_load/get_item_history_grid',
                 "type": 'POST',
                 "data":'nothing_yet'
                 },*/

                //Edit Coloumn set


                "fnDrawCallback": function (oSettings) {
                    if (oSettings._iDisplayLength >= oSettings.fnRecordsDisplay()) {
                        $(oSettings.nTableWrapper).find('.dataTables_paginate').hide();
                    } else
                        $(oSettings.nTableWrapper).find('.dataTables_paginate').show();
                },
                "fnFooterCallback": function (nRow, aaData, iStart, iEnd, aiDisplay) {
                    /*
                     *
                     * aaData =Data loaded
                     * aiDisplay = Data currently displayed incliding pages
                     * iStart = Start Row index in page
                     * 1End = End row index in page
                     */
                   /* var TotalQty = 0;
                    var TotalRetail = 0;
                    for (var i = 0; i < aiDisplay.length; i++) {
                        var colQty = parseFloat(aaData[aiDisplay[i]][5].replace(',', '.'));
                        var colRetail = parseFloat(aaData[aiDisplay[i]][6].replace(',', '.'));
                        var cell;

                        var string = aaData[aiDisplay[i]][1].replace(',', '.');
                        //var substring = "oo";
                        if (string.indexOf('GRN') > -1) {
                            //console.log(aaData[ aiDisplay[i] ][1].replace(',', '.'));
                            TotalQty += colQty;
                            TotalRetail += colRetail;


                        }
                        if (string.indexOf('GIN') > -1) {
                            //console.log(aaData[ aiDisplay[i] ][1].replace(',', '.'));
                            TotalQty -= colQty;
                            TotalRetail -= colRetail;

                            cell = table.cell({ row: i, column: 6 }).node();
                            $(cell).addClass('text-danger');

                        }
                        if (string.indexOf('SRN') > -1) {
                            //console.log(aaData[ aiDisplay[i] ][1].replace(',', '.'));
                            TotalQty += colQty;
                            TotalRetail += colRetail;
                        }
                        if (string.indexOf('PRN') > -1) {
                            //console.log(aaData[ aiDisplay[i] ][1].replace(',', '.'));
                            TotalQty -= colQty;
                            TotalRetail -= colRetail;

                            cell = table.cell({ row: i, column: 6 }).node();
                            $(cell).addClass('text-danger');
                        }
                        if (string.indexOf('INV') > -1) {
                            //console.log(aaData[ aiDisplay[i] ][1].replace(',', '.'));
                            TotalQty -= colQty;
                            TotalRetail -= colRetail;

                            cell = table.cell({ row: i, column: 6 }).node();
                            $(cell).addClass('text-danger');
                        }
                    }
                    var nCells = nRow.getElementsByTagName('th');

                    nCells[5].innerHTML = "" + Math.abs(TotalQty) + "";
                    nCells[6].innerHTML = "" + Math.abs(TotalRetail).toFixed(2) + "";*/
                },
                "paging": true,
                "bAutoWidth": false,
                "lengthChange": true,
                "searching": true,
                "ordering": true,
                "info": true,
                "autoWidth": true
                /*,
                 */

            });

            return oDatatable;
        };

    self.grid_refresh = function (start,end,init) {

        var data_set={};
        var is_succss=true;
        data_set['start_date']=start;
        data_set['end_date']=end;


        $.ajax({
            url: base_url+ajax_data_function,
            type: "POST",
            dataType: 'json',
            data: JSON.stringify(data_set),
            success: function (response) {
                //$scope.module_datatables_show=true;
                //console.log(response);
                if(response['logged_in']==true) {
                    var res_data;
                    if (typeof response['data'] !== 'undefined') {
                        res_data = response['data'];
                    } else res_data = 0;

                    //console.log(response);
                    var no_sort_last=false;
                    if(typeof response['no_sort_last']!= 'undefined') {
                        no_sort_last=true;
                    }

                       if (init == true) {

                               //Initialize Datatables (In Custom Functions)
                               var array_column = [];
                               // array_column['class']=[];

                               array_column['title'] = response['title'];
                               //array_column['class'][4]='hidden';

                               oTable = self.init_data_table(data_grid_id, array_column, true, no_sort_last);
                               //End Initialize Datatables (In Custom Functions)

                       }



                        if (oTable != null)oTable.fnClearTable();


                        for (var i = 0; i < res_data.length; i++) {
                            oTable.fnAddData(res_data[i], false);
                        }
                        oTable.fnDraw();



                } else location.reload();
            },
            error: function(XMLHttpRequest, textStatus, errorThrown) {
                alert("Load Error");
                is_succss=false;
            }

        });

        // table.row.add( [ '1', '2', '3', '4','5','600','700' ] ).draw();
        current_ajax_path=ajax_data_function;
        return is_succss;

    };


});

//javascript
function get_index(data_id, array_index, button) {
    //alert(button+"first");
    var permission = "N";
    if (button === "edit") {
        // alert("Edit Error");
        angular.element(document.getElementById('inventoryApp')).scope().load_main_data_for_edit(data_id, array_index);

    }
    else if (button === "delete") {

            angular.element(document.getElementById('inventoryApp')).scope().Delete_main_data_user(data_id, array_index);


    }
}
