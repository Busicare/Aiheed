<?php
/**
 * Created by PhpStorm.
 * User: Deji
 * Date: 7/18/16
 * Time: 10:00 PM
 */

function poke_upgrade_database(){
    register_site_page("pokes", array('title' => lang('poke::poke'), 'column_type' => TWO_COLUMN_LEFT_LAYOUT), function() {
        Widget::add(null,'pokes','content', 'middle');
    });
}