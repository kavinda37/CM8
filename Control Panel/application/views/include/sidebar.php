<aside class="main-sidebar">
    <!-- sidebar: style can be found in sidebar.less -->
    <section class="sidebar">
        <!-- Sidebar user panel -->
        <!--<div class="user-panel">
            <div class="pull-left image">
                <img src="<?php echo base_url(); ?>assets/admin/dist/img/user.png" class="img-circle" alt="User Image">
            </div>
            <div class="pull-left info">
                <p><?php// echo $first_name; ?> <?php //echo $last_name; ?></p>
                <a href="#"><i class="fa fa-circle text-success"></i> Online</a>
            </div>
        </div>-->


        <!-- search form -->
        <form ng-submit="submit(search_text)" ng-controller="searchController" class="sidebar-form">
            <div class="input-group">
                <input type="text"   name="search_text" ng-model="search_text" class="form-control" placeholder="Search...">
            <span class="input-group-btn">
              <button type="submit"  id="search-btn" class="btn btn-flat"><i class="fa fa-search"></i></button>
            </span>
            </div>
        </form>
        <!-- /.search form -->
        <!-- sidebar menu: : style can be found in sidebar.less -->
        <ul class="sidebar-menu">
            <li class="header">MAIN NAVIGATION</li>



                <li ng-class="{ active: isCurrentPath('/dashboard') }"><a href="#dashboard"><i class="fa fa-dashboard"></i> <span>Dashboard</span></a></li>


                <li ng-class="{ active: isCurrentPath('/sales') }"><a href="#sales"><i class="fa fa-shopping-cart"></i> <span>Sales</span></a></li>


                <li ng-class="{ active: isCurrentPath('/stock') }"><a href="#stock"><i class="fa fa-archive"></i> <span>Stock</span></a></li>


                <li ng-class="{ active: isCurrentPath('/send_repair') }"><a href="#send_repair"><i class="fa fa fa-wrench"></i> <span>Service</span></a></li>


            <li class="header hidden">OTHER</li>

            <!--<li><a href="#"><i class="fa fa-circle-o text-red"></i> <span>Important</span></a></li>-->
            <li class="hidden"><a href="#"><i class="fa fa-question text-yellow"></i> <span>Help</span></a></li>
            <li class="hidden"><a href="#"><i class="fa fa-info text-aqua"></i> <span>Information</span></a></li>
        </ul>
    </section>
    <!-- /.sidebar -->
</aside>