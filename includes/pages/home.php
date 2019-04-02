<?php

 function home_pager($app) {
     $design = config('home-design', 'splash');
     if (is_loggedIn()) redirect_to_pager('feed');
     $app->onHeader = (config('hide-homepage-header', false)) ? false : true;
     $app->setTitle(lang('welcome-to-social'));
     return $app->render();
 }

function translate_pager($app) {
    CSRFProtection::validate(false);
    $content = $_POST['text'];

   /* try {
        require_once(path('includes/libraries/bingtranslator.php'));
        $bing_translator = new BingTranslator(config('bing-id'), config('bing-secret'));
        $translation = $bing_translator->getTranslation('', 'en', $content);
        echo format_output_text($translation);
    } catch(Exception $e) {}
*/
    try {
        require_once(path('includes/libraries/azuretranslator.php'));
        $azure_translator = new AzureTranslator(config('azure-key'));
        $translation = $azure_translator->getTranslation($content, 'en');
        return format_output_text($translation);
    } catch(Exception $e) {}
}