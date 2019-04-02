<?php
return array(
    'title' => 'Test Plugin',
    'description' => lang("social::social-setting-description"),
    'settings' => array(
        'enable-facebook' => array(
            'type' => 'boolean',
            'title' => lang('social::enable-facebook'),
            'description' => '',
            'value' => 0
        ),

    )
);
 