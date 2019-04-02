function poke_me(div,loc){
   // alert('poker_id='+div);
    var coming_from = loc;
    if(coming_from!="profile"){
        var p_id = loc;
        var container = '#poke-reply-'+p_id;
        $(container).fadeOut('slow');
    }
    if(coming_from == 'suggest'){
        var contain = '#suggest-'+div;
        $(contain).fadeOut('slow');
    }

    var poker = div;

    $.ajax({
        url: baseUrl + "pije_wwith_iasef?poker_id="+poker,
        type:"GET",
        success: function(data){
            notify(data,'success',8000 );
        }
    });

}

function poke_back(poke_id,poker,pokee){
    var p_id = poke_id;
    var container = '#poke-reply-'+p_id;
    $(container).fadeOut('slow');
    //  document.getElementById(container).style.cssText = "transition:400ms; opacity:0;";
    $.ajax({
        url: baseUrl + "pije_wwith_iasef?poke_id="+p_id+'&poker='+poker+'&pokee='+pokee,
        type:"GET",
        success: function(data){
            notify(data,'success',8000 );
        }
    });
}

function add_poke() {
    var elem = $('#pk_profiler');
    var profile_id = elem.data('profile_id_holder');
    var parameters = elem.data('parameters');
    if(parameters != '' && typeof parameters !="undefined" && parameters !=null){
        var array_param = parameters.split(',')
    }
    var poke_tranlate = elem.data('poke-translate');
    var poke_status = elem.data('poke_exist');
    var login_state = elem.data('user-state');
    var lang = elem.data('lang-type');
    var profile_owenr = elem.data('profile-owner');




    //check if the same user is the poker
    if(profile_owenr  != 'owner'){
        if(lang != null){
            if(poke_status){

                $('.profile-container .profile-actions .dropdown-menu').prepend("<li class='dropdown-item'><a href='#' onclick=\"poke_back("+array_param[0]+','+array_param[2]+','+array_param[1]+")\">"+lang+"</a></li>");

            }else{

                $('.profile-container .profile-actions .dropdown-menu').prepend("<li class='dropdown-item'><a href='#' onclick=\"poke_me("+profile_id+','+"'profile'"+")\">"+lang+"</a></li>");
            }
        }

    }


}
addPageHook('add_poke');
$(function(){
    add_poke();


});


