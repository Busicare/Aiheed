<?php
function poke_pager($app){
    $pokee =  input('poker_id');
    $poke_id = input('poke_id');
     if(!empty($poke_id) && $poke_id != '') {

         $old_poker = input('poker');
         $old_pokee = input('pokee');
         add_reply_poke($poke_id,$old_poker,$old_pokee);
     }
     else{
         $poker = get_userid();
         if($pokee == $poker){
             return false;
         }
         add_poke($pokee,$poker);
     }
}

function get_pokes_pager($app){
    $app->setTitle(lang('poke::poke'));
    $pokes = get_pokes();
   return $app->render(view('poke::poke_home',array('pokes'=>$pokes->results())));
}