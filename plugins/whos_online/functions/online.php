<?php

function get_online_members()
{
    $time = time() - 50;
    $q = db()->query("SELECT * FROM users WHERE online_time > {$time}");
    $result = array();
    if($q->num_rows > 0){
        while($r = $q->fetch_assoc()){
            $result[] = $r['id'];
        }
    };
    return $result;
}