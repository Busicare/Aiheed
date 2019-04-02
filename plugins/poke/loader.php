<?php
load_functions("poke::poke");
register_asset("poke::css/poke.css");
register_asset("poke::js/poke.js");

register_hook('system.started', function($app) {
    if ($app->themeType == 'frontend' or $app->themeType == 'mobile') {
        register_asset("help::css/help.css");
        register_asset("help::js/help.js");
    }
});

register_pager('pokes',array("use"=>'poke::poke@get_pokes_pager','as'=>'pokes','filter'=>'auth'));
register_get_pager("pije_wwith_iasef", array('use' => 'poke::poke@poke_pager', 'filter' => 'auth'));
register_hook('user.profile.buttons',function($user){
    $profiler_id =  $user['id'];
  return view('poke::button-view',array('id'=>$profiler_id));
});

register_hook("poke.added", function($type_id) {
        $poke = get_poke($type_id);
        if ($poke['reply'] == 0) {
            send_notification_privacy('notify-site-poke', $poke['pokee'], 'poke', $type_id);
    }else{
            send_notification_privacy('notify-site-poke', $poke['pokee'], 'poke_reply', $type_id);
        }
});

register_hook("display.notification", function($notification) {
    if ($notification['type'] == 'poke') {
        $notification['reply'] = 0;
        return view("poke::notifications/poke", array('notification' => $notification, 'type' => 'poke'));
    }
    if ($notification['type'] == 'poke_reply') {
        $notification['reply'] = 1;
        return view("poke::notifications/poke", array('notification' => $notification, 'type' => 'poke'));
    }
});

if (is_loggedIn()) {
   // add_menu("dashboard-menu", array("icon" => "<i class='ion-thumbsup'></i>", "id" => "poke", "title" => lang("poke::pokes"), "link" => url("pokes")));
    add_available_menu('poke::pokes','pokes','ion-thumbsup');
}

register_hook('site-notifications-settings',function(){
    return view('poke::account_setting_notification');
});




