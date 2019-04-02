/*---Sticky video scripts--*/


jQuery(function()
{
    var mywindow = $(window);
    var top="";
    var offset="";


    addToPlaylist();

     /*--Youtube video controller---*/
    window.onYouTubeIframeAPIReady=function() {


        jQuery('iframe').filter(function(){ return this.src.indexOf('https://www.youtube.com/') == 0}).each( function (k, v) {
            if (!this.id) { this.id='embeddedvideoiframe' + k }
            players.push(new YT.Player(this.id, {
                events: {

                    'onStateChange': onPlayerStateChange
                        }
                    }))
                });
        };

         function onPlayerStateChange( event ) {

            active=event.target.getIframe();
            //frameHolder = $(active);

            if (event.data == YT.PlayerState.PLAYING) {
                jQuery.each(players, function(k, v) {
                    if (this.getIframe().id != event.target.getIframe().id) {

                        try
                        {
                            this.pauseVideo();
                          }catch(e)
                          {

                          }

                    }
                });
            }

            var isPlay  = 1 === event.data;
            var isPause = 2 === event.data;
            var isEnd   = 0 === event.data;



            if ( isPause ) {

              frameHolder.removeClass( "is-sticky" );
           }

           if ( isEnd ) {
              frameHolder.removeClass( "is-sticky" );
           }
        }


    /*----Listen to click on iframe---*/

    $('.iframe iframe').iframeTracker({

       blurCallback: function(){

         this._holder.toggleClass('is-playing');
         featuredMedia=this._holder;
         frameHolder=jQuery(this._holder).find('.frame-holder');
         console.log(frameHolder);
         stickyclose=jQuery(this._holder).find('.sticky-close');
         featuredVideo=jQuery('#'+this._holderId+' iframe');
         top = featuredMedia.offset().top;
         offset = Math.floor( top + ( featuredMedia.outerHeight() / 2 ) );
         for(var x in allIframe)
         {
            var id=allIframe[x];
           if(id != this._holderId)
           {
              jQuery('#'+id).removeClass('is-playing');
              var iframeHolder=jQuery('#'+id+ ' .frame-holder');
              var iframe=jQuery('#'+id+ ' iframe');
              var cSticky=jQuery('#'+id+ ' .frame-holder .sticky-close');
              iframeHolder.removeClass('is-sticky');
              var src=iframe.attr('src');
              iframeHolder.find('sticky-close').addClass('hidden');
              console.log(cSticky);
              cSticky.addClass('hidden');

              try
              {
                iframe.attr('src',iframe.attr('src'));
              }
              catch(e)
              {

              }

           }
         }

        },
        overCallback: function(element){
          this._holderId = $(element).parents('.iframe').attr('id');
          this._holder=$(element).parents('.iframe');


        },
        outCallback: function(element){
          this._holderId = null;
          this._holderId = null;
        },
        _holderId: null,
        _holder:null

      });


        mywindow
        .on( "resize", function() {

          try
          {
            top = featuredMedia.offset().top;
            offset = Math.floor( top + ( featuredMedia.outerHeight() / 2 ) );
          }catch(Exception)
          {

          }

        })

          .on( "scroll", function() {

            try
            {
              var diff=parseInt(offset)-parseInt(mywindow.scrollTop());
              frameHolder.removeClass( "hidden",diff<315);
              frameHolder.toggleClass( "is-sticky",
              mywindow.scrollTop() >= offset || diff>=315  && featuredMedia.hasClass( "is-playing"));
              if (frameHolder.hasClass('is-sticky'))
              {

                stickyclose.removeClass('hidden');

              }
             else
             {
                stickyclose.addClass('hidden');
             }
             if(! featuredMedia.hasClass("is-playing"))
             {
              frameHolder.removeClass('is-sticky')
              stickyclose.addClass('hidden');
             }

            }catch(e)
            {
                console.log(e);
            }

          });
    });



/*---Add iframe to video playlist---*/
function addToPlaylist()
{

    allIframe=[];
    jQuery('.iframe iframe').each(function(v)
    {
        allIframe.push($(this).closest('.iframe').attr('id'));
    });
}


function removeSticky()
{

  featuredVideo.attr('src',featuredVideo.attr('src'));
  frameHolder.addClass('hidden');
  featuredMedia.removeClass("is-playing");
  stickyclose.addClass('hidden');


}

