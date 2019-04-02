<?php 
function livechat_install_database() {
    $db = db();
    $db->query("CREATE TABLE IF NOT EXISTS `livechats` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `type` varchar(32) COLLATE utf8_unicode_ci NOT NULL,
        `type_id` int(11) COLLATE utf8_unicode_ci NOT NULL,
        `user_id` int(11) COLLATE utf8_unicode_ci NOT NULL,
        `message` text COLLATE utf8_unicode_ci NOT NULL,
        `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;");
}