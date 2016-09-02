<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class Admin extends CI_Controller
{

	function __construct()
	{
		parent::__construct();
	}

	public function index()
	{

		//$this->session->userdata('logged_in')
		#Check If the user is logged in
		$is_logged_in = true;
		if ($is_logged_in == true) {
			#Go to Private Dashboard
			$this->dashboard();
		} else {
			#Go to login page if not logged in
			$this->login();
		}

	}

	#Login View Load Function : Private
	private function login()
	{
		$this->load->helper(array('form'));

		$data['image_name'] = '1.jpg';
		$data['system_name'] = 'Plantation';

		$this->load->view('login/login_view', $data);
	}

	#User Logout Function : Public url :[base_url]/admin/logout
	public function logout() {
		$this->load->library('check_session');
		$this->check_session->logout();
	}

	#Admin Dashboard Assets loader (AngularJs) : Private
	private function dashboard() {
		$data['active'] = 'dashboard'; //class_name_in_simple/function_name, if the function is index just the class name
		$data['page_location'] = 'dashboard';
		$data['page_name'] = 'Dashboard';
        $data['company_name'] = 'CM8';

		$this->load->view('include/page', $data);
	}

}

?>