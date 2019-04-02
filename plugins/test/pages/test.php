<?php
function index_pager($app){
    $app->setTitle(lang("test::test"));
    $message = null;
    return $app->render(view('test::test', array('message' => $message)));
}
