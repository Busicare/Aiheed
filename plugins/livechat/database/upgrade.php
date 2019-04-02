<?php
function livechat_upgrade_database() {
    register_site_page('livechat-ajax', array('title' => lang('livechat::livechat'), 'column_type' => ONE_COLUMN_LAYOUT), function() {
        Widget::add(null, 'page-profile', 'plugin::livechat|livechat', 'right');
        Widget::add(null, 'event-profile', 'plugin::livechat|livechat', 'right');
        Widget::add(null, 'group-profile', 'plugin::livechat|livechat', 'right');
        Widget::add(null, 'game-profile', 'plugin::livechat|livechat', 'right');
    });
}