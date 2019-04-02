<?php
function clear_page($app) {
    clear_temp_data();
    return redirect_back(array('id' => 'admin-message', 'message' => lang('temp-cleared-message')));
}
 