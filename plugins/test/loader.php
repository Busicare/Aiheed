<?php
load_functions("social::social");
register_hook('system.started', function($app) {
    if ($app->themeType == 'frontend' or $app->themeType == 'mobile') {
        //register assets
        register_asset("social::css/social.css");
        register_asset("social::js/social.js");
    }
});

