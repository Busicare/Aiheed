<?php
load_functions('livechat::livechat');

register_asset('livechat::css/livechat.css');

register_asset('livechat::js/livechat.js');

register_pager("livechat/ajax", array(
    'filter'=> 'auth',
    'as' => 'livechat-ajax',
    'use' => 'livechat::ajax@ajax_pager')
);