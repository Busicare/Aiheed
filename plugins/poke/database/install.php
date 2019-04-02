<?php
function poke_install_database() {
    $db = db();
    $db->query("CREATE TABLE IF NOT EXISTS `poke` (
	`poke_id` INT(11) NOT NULL AUTO_INCREMENT,
	`poker` INT(11) NOT NULL,
	`pokee` INT(11) NOT NULL,
	`reply` INT(11) NOT NULL,
	`time` INT(11) NOT NULL,
	PRIMARY KEY (`poke_id`)
)
COLLATE=utf8_unicode_ci ENGINE=InnoDB AUTO_INCREMENT=1;");
}

