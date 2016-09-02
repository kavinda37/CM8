<?php
/**
 * Created by IntelliJ IDEA.
 * User: Hawk
 * Date: 8/21/2016
 * Time: 8:34 PM
 */
?>
<section class="content-header">
    <h1>
        Auction
        <small>Marketing</small>
    </h1>
    <ol class="breadcrumb">
        <li><a href="#"><i class="fa fa-dashboard"></i> Home</a></li>
        <li><a href="#">Marketing</a></li>
        <li class="active">Auction</li>
    </ol>
</section>

<section class="content">
    <div class="row">
        <div class="col-md-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Catalog</h3>
                </div><!-- /.box-header -->
                <div class="box-body">
                    <table class="table table-bordered">
                        <tbody><tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Reason</th>
                        </tr>
                        <tr>
                            <td>183</td>
                            <td>John Doe</td>
                            <td>11-7-2014</td>
                            <td><span class="label label-success">Approved</span></td>
                            <td>Bacon ipsum dolor sit amet salami venison chicken flank fatback doner.</td>
                        </tr>
                        <tr>
                            <td>219</td>
                            <td>Alexander Pierce</td>
                            <td>11-7-2014</td>
                            <td><span class="label label-warning">Pending</span></td>
                            <td>Bacon ipsum dolor sit amet salami venison chicken flank fatback doner.</td>
                        </tr>
                        <tr>
                            <td>657</td>
                            <td>Bob Doe</td>
                            <td>11-7-2014</td>
                            <td><span class="label label-primary">Approved</span></td>
                            <td>Bacon ipsum dolor sit amet salami venison chicken flank fatback doner.</td>
                        </tr>
                        <tr>
                            <td>175</td>
                            <td>Mike Doe</td>
                            <td>11-7-2014</td>
                            <td><span class="label label-danger">Denied</span></td>
                            <td>Bacon ipsum dolor sit amet salami venison chicken flank fatback doner.</td>
                        </tr>
                        </tbody></table>
                </div><!-- /.box-body -->
                <div class="box-footer clearfix">
                    <ul class="pagination pagination-sm no-margin pull-right">
                        <li><a href="#">«</a></li>
                        <li><a href="#">1</a></li>
                        <li><a href="#">2</a></li>
                        <li><a href="#">3</a></li>
                        <li><a href="#">»</a></li>
                    </ul>
                </div>
            </div><!-- /.box -->

        </div><!-- /.col -->

    </div>
</section>

<section class="content">
    <div class="row">
        <div class="col-md-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Add Auction</h3>
                </div><!-- /.box-header -->
                <div class="box-body">
                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">Lot No</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno"   ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->
                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">Pick No</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno"   ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->
                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">Pick Date</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno" placeholder="dd/mm/yyy"  ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->
                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">Location</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno"  ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->
                    <div class="col-lg-4 col-xs-12"><!-- Category Column -->
                        <div class="form-group">
                            <label class="control-label" for="dropdown_type"> Estate</label>
                            <select id="dropdown_type" name="dropdown_type"  class="form-control" ng-model="data_Types.select_Type"  ng-change="get_custom_fields(data_Types.select_Type.item_type_id)" ng-options="type.item_type_name for type in set_types_array track by type.item_type_id">
                                <option  value="" disabled selected>-- Select Estate --</option>

                            </select>
                        </div>
                    </div><!-- /.Category Column -->
                    <div class="col-lg-4 col-xs-12"><!-- Category Column -->
                        <div class="form-group">
                            <label class="control-label" for="dropdown_type"> Division</label>
                            <select id="dropdown_type" name="dropdown_type"  class="form-control" ng-model="data_Types.select_Type"  ng-change="get_custom_fields(data_Types.select_Type.item_type_id)" ng-options="type.item_type_name for type in set_types_array track by type.item_type_id">
                                <option  value="" disabled selected>-- Select Division --</option>

                            </select>
                        </div>
                    </div><!-- /.Category Column -->

                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">Total QTY</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno"  ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->

                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">Fallen QTY</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno"  ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->

                </div><!-- /.box-body -->
                <div class="box-footer">

                    <button class="btn btn-primary " id="add_model" ng-click="add_to_grid()"><i class="fa fa-plus"></i> Add</button>

                    <!--/.Change this line-->
                    <button class="btn btn-warning" ng-click="click_cancel();"><i class="fa fa-remove"></i> Cancel</button>

                </div>
            </div><!-- /.box -->

        </div><!-- /.col -->

    </div>
</section>

<section class="content">
    <div class="row">
        <div class="col-md-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Add Sales</h3>
                </div><!-- /.box-header -->
                <div class="box-body">
                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">Pick</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno"   ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->
                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">QTY</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno"   ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->
                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">Price (Per 1000 units)</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno"   ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->
                    <div class="col-lg-4 col-xs-12"><!-- Category Column -->
                        <div class="form-group">
                            <label class="control-label" for="dropdown_type"> Broker</label>
                            <select id="dropdown_type" name="dropdown_type"  class="form-control" ng-model="data_Types.select_Type"  ng-change="get_custom_fields(data_Types.select_Type.item_type_id)" ng-options="type.item_type_name for type in set_types_array track by type.item_type_id">
                                <option  value="" disabled selected>-- Select Broker --</option>

                            </select>
                        </div>
                    </div><!-- /.Category Column -->
                    <div class="col-lg-4 col-xs-12"><!-- Category Column -->
                        <div class="form-group">
                            <label class="control-label" for="dropdown_type"> Estate</label>
                            <select id="dropdown_type" name="dropdown_type"  class="form-control" ng-model="data_Types.select_Type"  ng-change="get_custom_fields(data_Types.select_Type.item_type_id)" ng-options="type.item_type_name for type in set_types_array track by type.item_type_id">
                                <option  value="" disabled selected>-- Select Estate --</option>

                            </select>
                        </div>
                    </div><!-- /.Category Column -->
                    <div class="col-lg-4 col-xs-12"><!-- Category Column -->
                        <div class="form-group">
                            <label class="control-label" for="dropdown_type"> Division</label>
                            <select id="dropdown_type" name="dropdown_type"  class="form-control" ng-model="data_Types.select_Type"  ng-change="get_custom_fields(data_Types.select_Type.item_type_id)" ng-options="type.item_type_name for type in set_types_array track by type.item_type_id">
                                <option  value="" disabled selected>-- Select Division --</option>

                            </select>
                        </div>
                    </div><!-- /.Category Column -->



                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">Payment 25%</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno"  ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->

                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">Payment 75%</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno"  ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->

                </div><!-- /.box-body -->
                <div class="box-footer">

                    <button class="btn btn-primary " id="add_model" ng-click="add_to_grid()"><i class="fa fa-plus"></i> Add</button>

                    <!--/.Change this line-->
                    <button class="btn btn-warning" ng-click="click_cancel();"><i class="fa fa-remove"></i> Cancel</button>

                </div>
            </div><!-- /.box -->

        </div><!-- /.col -->

    </div>
</section>

<section class="content">
    <div class="row">
        <div class="col-md-12">
            <div class="box">
                <div class="box-header with-border">
                    <h3 class="box-title">Add Local Sales</h3>
                </div><!-- /.box-header -->
                <div class="box-body">
                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">Pick</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno"   ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->
                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">QTY</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno"   ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->
                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">Price</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno"  ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->

                    <div class="col-lg-4 col-xs-12"><!-- Model Barcode -->
                        <div class="form-group">
                            <label class="control-label" for="inputError">Picking Date</label>
                            <input
                                title="stock keeping unit (SKU) is a store's or catalog's product and service identification code, often portrayed as a machine-readable bar code that helps the item to be tracked for inventory"
                                type="text" class="form-control" id="M_serialno" placeholder="dd/mm/yyy"  ng-model="M_serialno">
                        </div>
                    </div><!-- /.Model Barcode -->

                    <div class="col-lg-4 col-xs-12"><!-- Category Column -->
                        <div class="form-group">
                            <label class="control-label" for="dropdown_type"> Estate</label>
                            <select id="dropdown_type" name="dropdown_type"  class="form-control" ng-model="data_Types.select_Type"  ng-change="get_custom_fields(data_Types.select_Type.item_type_id)" ng-options="type.item_type_name for type in set_types_array track by type.item_type_id">
                                <option  value="" disabled selected>-- Select Estate --</option>

                            </select>
                        </div>
                    </div><!-- /.Category Column -->
                    <div class="col-lg-4 col-xs-12"><!-- Category Column -->
                        <div class="form-group">
                            <label class="control-label" for="dropdown_type"> Division</label>
                            <select id="dropdown_type" name="dropdown_type"  class="form-control" ng-model="data_Types.select_Type"  ng-change="get_custom_fields(data_Types.select_Type.item_type_id)" ng-options="type.item_type_name for type in set_types_array track by type.item_type_id">
                                <option  value="" disabled selected>-- Select Division --</option>

                            </select>
                        </div>
                    </div><!-- /.Category Column -->




                </div><!-- /.box-body -->
                <div class="box-footer">

                    <button class="btn btn-primary " id="add_model" ng-click="add_to_grid()"><i class="fa fa-plus"></i> Add</button>

                    <!--/.Change this line-->
                    <button class="btn btn-warning" ng-click="click_cancel();"><i class="fa fa-remove"></i> Cancel</button>

                </div>
            </div><!-- /.box -->

        </div><!-- /.col -->

    </div>
</section>

