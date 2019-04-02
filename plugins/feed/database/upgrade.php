<?php
function feed_upgrade_database() {
    $db = db();
    $db->query("ALTER TABLE  `feeds` ADD  `background` VARCHAR( 255 ) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL AFTER `feed_content`");
}