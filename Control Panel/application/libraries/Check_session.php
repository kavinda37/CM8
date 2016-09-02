<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Check_session {

	function check_sess()
	{
		$CI =& get_instance();
		if($CI->session->userdata('logged_in'))
		{
			$session_data = $CI->session->userdata('logged_in');
			if($session_data['remember_sess']==FALSE){
				if($session_data['logon_date']!=date("Y/m/d")){
					$this->logout();
				}
			}
			return TRUE; 
		}
		else
		{
			//If no session, redirect to login page
			redirect('login', 'refresh');
			return FALSE;
		} 
	 
	}

	function is_logged_in()
	{
		$CI =& get_instance();
		if($CI->session->userdata('logged_in'))
		{
			return true;
		}
		else
		{
			//If no session, redirect to login page
			return false;
		}

	}
	
	function logout()
	{

		$CI =& get_instance();
		$logout_url='login';

		$CI->session->unset_userdata('logged_in');
		session_destroy();
		redirect($logout_url, 'refresh');
	}
}

?>