<?php
function livechat_send_message($type, $type_id, $message) {
	$db = db();
	$sql = "INSERT INTO `livechats`(`type`, `type_id`, `user_id`, `message`, `timestamp`) VALUES('".$type."', '".$type_id."', ".get_userid().", '".$message."', NOW())";
	$result = $db->query($sql);
    return $result ? true : false;
}

function livechat_get_new_messages($type, $type_id, $last_time, $limit = 20) {
	$db = db();
	$sql = "SELECT `livechats`.`id`, `livechats`.`type`, `livechats`.`type_id`, `livechats`.`user_id`, `livechats`.`message`, `livechats`.`timestamp`, `users`.username FROM `livechats` LEFT JOIN `users` ON `users`.`id` = `livechats`.`user_id` WHERE `livechats`.`type` = '".$type."' AND `livechats`.`type_id` = '".$type_id."' AND UNIX_TIMESTAMP(`livechats`.`timestamp`) > ".$last_time." ORDER BY `livechats`.`timestamp` DESC LIMIT ".$limit;
	$result = $db->query($sql);
	return array_reverse(fetch_all($result));
}