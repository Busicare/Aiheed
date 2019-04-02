<?php

function add_poke($pokee,$poker){
    //if poker has already sent a poke
    if(!check_existing_poke_for_new_record($pokee,$poker) ){
        //echo "i will insert new record";

        if(check_existing_poke_replied_or_not_replied($pokee,$poker)){
           //echo "I will delete old record and insert new row with 0";
            //DELETE THE OLD RECORD AND INSERT NEW ONE
            $sql = "DELETE FROM `poke` WHERE (`poker`='{$pokee}' AND `pokee`='{$poker}')";
            $result = db()->query($sql);
            $time = time();
            $sql = "INSERT INTO `poke` (poker,pokee,reply,time) VALUES ('{$poker}','{$pokee}',0,'{$time}')";
            $db = db()->query($sql);
            $pokeId = db()->insert_id;
            fire_hook('poke.added',null,array($pokeId));
            $name = get_user_name(find_user($pokee));
            echo lang('poke::have-successfully-poked',array('name'=>$name));

        }else{
            //echo "no row inside the db before, i will just insert new record.";
            $time = time();
            $sql = "INSERT INTO `poke` (poker,pokee,reply,time) VALUES ('{$poker}','{$pokee}',0,'{$time}')";
            $db = db()->query($sql);
            $pokeId = db()->insert_id;
            fire_hook('poke.added',null,array($pokeId));
            $name = get_user_name(find_user($pokee));
            echo lang('poke::have-successfully-poked',array('name'=>$name));
        }

    }
    else{
       $name = get_user_name(find_user($pokee));
       echo lang('poke::you-already-poked',array('name'=>$name));
    }

}

function check_existing_poke_for_new_record($pokee,$poker){
    $sql = "SELECT * FROM `poke` WHERE (`poker`='{$poker}' AND `pokee`='{$pokee}') AND `reply`=0";
    $result = db()->query($sql);
    $result = $result->fetch_assoc();
    return $result;
}

//check if the person has already sent a poke and pokee has not replied
function check_existing_poke($pokee,$poker){
   $sql = "SELECT * FROM `poke` WHERE (`poker`='{$pokee}' AND `pokee`='{$poker}') AND `reply`=0";
   $result = db()->query($sql);
    $result = $result->fetch_assoc();
    return $result;
}
//check if the person has already sent a poke and pokee replied or not
function check_existing_poke_replied_or_not_replied($pokee,$poker){
    $sql = "SELECT * FROM `poke` WHERE (`poker`='{$pokee}' AND `pokee`='{$poker}')";
    $result = db()->query($sql);
    $result = $result->fetch_assoc();
    return $result;
}

//check if the person has already sent a poke and pokee has not replied
function check_existing_replied_poke($pokee,$poker){
    $sql = "SELECT * FROM `poke` WHERE (`poker`='{$pokee}' AND `pokee`='{$poker}') AND `reply`=1";
    $result = db()->query($sql);
    $result = $result->fetch_assoc();
    return $result;
}
function add_reply_poke($poke_id,$old_poker,$old_pokee){
    if(!check_existing_replied_poke($old_pokee,$old_poker)){
        $time = time();
        $sql = "INSERT INTO `poke` (poker,pokee,reply,time) VALUES ('{$old_pokee}','{$old_poker}',1,'{$time}')";
        $db = db()->query($sql);
        $pokeId = db()->insert_id;
        fire_hook('poke.added',null,array($pokeId));
        //delete the started poke
        poke_delete($poke_id);
        $name = get_user_name(find_user($old_poker));
        echo lang('poke::you-poked-back',array('name'=>$name));
    }else{
        $name = get_user_name(find_user($old_poker));
        echo lang('poke::you-already_poked_back',array('name'=>$name));
    }


}
function poke_delete($poke_id){
    $sql = "DELETE FROM `poke` WHERE  `poke_id`={$poke_id} ";
    db()->query($sql);
}

function get_poke($poke_id){
    $sql = "SELECT * FROM `poke` WHERE `poke_id`='{$poke_id}'";
    $db = db()->query($sql);
    $result = $db->fetch_assoc();
    return $result;
}

function get_pokes($limit=6){
    $id = get_userid();
    $sql = "SELECT * FROM `poke` WHERE `pokee`='{$id}'";
    return paginate($sql, $limit);
}

function get_pokers_that_has_not_already_pokeed_this_current_user(){
    $id = get_userid();
    $sql = "SELECT `poker` FROM `poke` WHERE `pokee`=$id ";
    $result = db()->query($sql);
    $result_arr = [];
    while($fetch = $result->fetch_assoc()){
        $result_arr[] = $fetch;
    }
   return $result_arr;
}

function get_pokee_that_is_the_current_user(){
    $id = get_userid();
    $sql = "SELECT `pokee` FROM `poke` WHERE `poker`=$id ";
    $result = db()->query($sql);
    $result_arr = [];
    while($fetch = $result->fetch_assoc()){
        $result_arr[] = $fetch;
    }
    return $result_arr;
}
