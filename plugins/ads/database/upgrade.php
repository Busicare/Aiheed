<?php
function ads_upgrade_database() {
    try{db()->query("ALTER TABLE `ads_plans` ADD `banner_width` INT(11) UNSIGNED NOT NULL AFTER `price`, ADD `banner_height` INT(11) UNSIGNED NOT NULL AFTER `banner_width`;");}catch(Exception $e){$error = $e;}
    register_site_page('ads-manage', array('title' => lang('ads::manage-ads'), 'column_type' => ONE_COLUMN_LAYOUT), function() {
        Widget::add(null,'ads-manage', 'content', 'middle');
        Menu::saveMenu('header-account-menu', 'ads::create-ads', 'ads/create');
        Menu::saveMenu('header-account-menu', 'ads::manage-ads', 'ads');
        Widget::add(null,'feed','plugin::ads|ads', 'right');
    });
    register_site_page('ads-create', array('title' => lang('ads::ads-create'), 'column_type' => ONE_COLUMN_LAYOUT), function() {
        Widget::add(null,'ads-create', 'content', 'middle');
    });
    register_site_page('ads-edit', array('title' => lang('ads::ads-edit'), 'column_type' => ONE_COLUMN_LAYOUT), function() {
        Widget::add(null, 'ads-edit', 'content', 'middle');
    });
}