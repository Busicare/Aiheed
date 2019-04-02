<?php
return array(
    'title' => lang('livechat::livechat'),
    'description' => lang('livechat::livechat-desc'),
    'settings' => array('livechat_messages_limit' => array(
        'type' => 'text',
        'title' => lang('livechat::livechat-messages-limit'),
        'description' => lang('livechat::livechat-messages-limit-desc'),
        'value' => 20
        )
    )
);