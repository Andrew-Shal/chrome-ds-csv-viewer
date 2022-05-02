chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    switch (req.action) {
        case "PARSE_DATA":
            try{
                console.log('[PARSE_STARTED]')

                // check if tabel doesnt already exist
                if($('#My_Table').length){
                    sendResponse("CSV already parsed")
                    return
                }

                // {hasHeader, delimiter}
                var flags = req.data
                console.log(flags)

                var dataObjs = []
                var headerNames = []

                var rawCSV = document.querySelector('body pre').innerHTML
                var records = rawCSV.split('\n')
                var delimiter = flags.delimiter
                //var hasHeader = true
                var hasHeader = flags.hasHeader
                var numRows = records.length
                //var firstColumn = hasHeader == true ?  records[0].split(',') : records[0].split(/","/)
                var firstColumn = hasHeader == true ?  records[0].split(delimiter) : records[0].split((new RegExp(`"${flags.delimiter}"`,'g')))
                var numCols = firstColumn.length

                if(hasHeader){
                    // build header
                    for(var i=0;i<numCols;i++){
                        headerNames.push({"data": firstColumn[i], "name": firstColumn[i], "autoWidth": true, "title": firstColumn[i]})
                    }
                }else{
                    // build generic header
                    for(var i=0;i<numCols;i++){
                        headerNames.push({"data": `Column_${i+1}`, "name": `Column_${i+1}`, "autoWidth": true, "title": `Column_${i+1}` })
                    }
                }
                console.log(headerNames)

                // go through rows
                for(var row= hasHeader?1:0;row<numRows;row++){
                    var currentRowCols = []
                    var obj =  {}
                    // split row by delimiter to get cols for current row
                    currentRowCols = records[row].split((new RegExp(`"${flags.delimiter}"`,'g')))

                    for(var col=0;col<currentRowCols.length;col++){
                        // build object
                        // TODO: fix the regex
                        obj[headerNames[col].data] = currentRowCols[col].replace(/^"|"$/,'')
                    }
                    // add built obj to obj list
                    dataObjs.push(obj)    
                }

                console.log(headerNames,dataObjs)

                // add jq data style link
                var link = document.createElement("link");
                link.href = "https://cdn.datatables.net/1.11.5/css/jquery.dataTables.css";
                link.type = "text/css";
                link.rel = "stylesheet";
                document.getElementsByTagName("head")[0].appendChild(link);

                var link = document.createElement("link");
                link.href = "https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css";
                link.type = "text/css";
                link.rel = "stylesheet";
                document.getElementsByTagName("head")[0].appendChild(link);

                var link = document.createElement("link");
                link.href = "https://cdn.datatables.net/1.11.5/css/dataTables.jqueryui.min.css";
                link.type = "text/css";
                link.rel = "stylesheet";
                document.getElementsByTagName("head")[0].appendChild(link);

                // add table
                $('body').html('<table id="My_Table" class=" display"></table>')

                // update wih jquery table
                $('#My_Table').DataTable({
                    data: dataObjs,
                    columns: headerNames,
                    scrollY: '80vh',
                    scrollX: true,
                    scrollCollapse: true,
                })

                sendResponse("Successfully parsed!")
                return true
            }catch(err){
                console.log(err)
                sendResponse(err)
                return true
            }
        default:
            return true
    }
})