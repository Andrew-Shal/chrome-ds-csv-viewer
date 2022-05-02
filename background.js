chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch(message.action){
        case "GET_URL": 
            console.log("[GET_URL]")
            chrome.tabs.query({active: true, currentWindow:true}, function(tabs){
                if(tabs[0]){
                    sendResponse({success: true, url: tabs[0].url})
                }else{
                    sendResponse({success: false, url: null})                
                }
            })
            return true
        default:
            return true
    }
})