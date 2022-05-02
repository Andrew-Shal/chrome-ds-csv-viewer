document.addEventListener('DOMContentLoaded', function(){
    // get page url
    chrome.runtime.sendMessage({action:"GET_URL"}, function(res){
        if(res.success){
            console.log(res.url)
            // check if url is a valid feed url
            // all DS site for out feeds will have feeds.asp
            if(res.url.indexOf("feeds.asp") == -1){
            // if( 1 != 1){
                $('#parse_container').hide()
                $('#message_container').text("Nothing to Parse")
                $('#message_container').fadeIn()
                return
            }

            // show parse container, hide message container
            $('#message_container').hide()
            $('#parse_container').fadeIn()
        }else{
            $('#message_container').fadeIn()
            $('#message_container').html('<span style="font-size:20px;font-weight:700;color:#000;display:block;">:(</span><br/>Oops, unable to determine url')
            $('#parse_container').hide()
        }
    })
})

// add event handler for parse btn
$(document).on('submit','#aForm',function(e){
    e.preventDefault()
    
    var hasHeader = $('input[name=has_header]').prop('checked')
    var delimiter = $('input[name=delimiter]').val()
    var obj = {hasHeader, delimiter}


    chrome.tabs.query({active: true,currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "PARSE_DATA", data: obj }, (res) => {
            console.log(res)
            $('#message_container').text(res)
            $('#message_container').fadeIn().delay(4000).fadeOut()
        })
    })
})

