<?php
/**
 * @param $app
 * @return string
 */
function ajax_pager($app){
    CSRFProtection::validate(false);
	$action = input('action');
	switch($action) {
		case 'send':
            $type = input('type');
            $type_id = input('type_id');
            $message = urldecode(input('message'));
            $send = livechat_send_message($type, $type_id, $message);
            $last_time = input('last_time');
            $limit = input('messages_limit');
            if($send) {
                $messages = livechat_get_new_messages($type, $type_id, $last_time, $limit);
                foreach ($messages as $index => $message) {
                    $messages[$index]['message'] = output_text($messages[$index]['message']);
                }
                return json_encode($messages);
            } else {
                return json_encode(false);
            }
		break;

		case 'check':
            $type = input('type');
            $type_id = input('type_id');
            $last_time = input('last_time');
            $limit = input('messages_limit');
            $messages = livechat_get_new_messages($type, $type_id, $last_time, $limit);
            foreach ($messages as $index => $message) {
                $messages[$index]['message'] = output_text($messages[$index]['message']);
            }
            return json_encode($messages);
        break;

		default:
		break;
	}
}