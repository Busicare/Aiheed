<?php
/**
 * Signup welcome steps pager
 */
function welcome_pager($app) {
    $step = input('step', 'info');
    $content = "";
    $message = null;
    session_put('welcome-page-visited', 'visited');
    //get_menu("dashboard-menu", 'user-welcome')->setActive();
    $app->onHeaderContent = false;
    $app->setTitle(lang('welcome'));
    fire_hook('collect.get.started',$step,array());
    switch($step) {
        case 'import':
            $content = view("getstarted::import", array('message' => $message));
            break;
        case 'add-people':
            $content = view("getstarted::add-people", array('message' => $message));
            break;
        case 'finish':
            update_user(array('welcome_passed' => 1), null, true);
            return go_to_user_home();
            break;
        default:
            $val = input('val');
            $message = null;
            $avatar = get_user_data('avatar');
            if ($avatar) {
                $path = explode('/', $avatar);
                if($path[1] != 'avatar') {
                    if (plugin_loaded('social')) {
                        return redirect((url_to_pager('signup-welcome').'?step=import'));
                    } else {
                        return redirect((url_to_pager('signup-welcome').'?step=add-people'));
                    }
                }
            }
            if ($val) {
                CSRFProtection::validate();
                if (input('avatar')) {
                    $user_id = get_userid();
                    $avatar = input('avatar');
                    list($header, $data) = explode(',', $avatar);
                    preg_match('/data\:image\/(.*?);base64/i', $header, $matches);
                    $extension = $matches[1];
                    $data = base64_decode($data);
                    $dir = config('temp-dir', path('storage/tmp')).'/awesome_cropper';
                    if(!is_dir($dir)) {
                        mkdir($dir, 0777, true);
                    }
                    $path = $dir.'/avatar.'.$extension;
                    file_put_contents($path, $data);
                    $uploader = new Uploader($path, 'image', false, true);
                    $uploader->setPath($user_id.'/'.date('Y').'/photos/profile/');
                    if ($uploader->passed()) {
                        $avatar = $uploader->resize()->toDB("profile-avatar", get_userid(), 1)->result();
                        update_user_avatar($avatar, null, $uploader->insertedId, false);
                    } else {
                        $message = $uploader->getError();
                    }
                }
                if (!$message) {
                    update_user(array('bio' => input('val.bio')));
                    return redirect((plugin_loaded('social') ? url_to_pager('signup-welcome').'?step=import' : url_to_pager('signup-welcome').'?step=add-people'));
                }
    }
    $content = view("getstarted::info", array('message' => $message));
    break;
}
//$content = $app->view("getstarted::welcome/layout");
return $app->render($content);
}

