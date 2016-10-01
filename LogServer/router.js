
function router(req) {
        console.log("router() http://localhost:" + SERVER_PORT + req.url);
        var isFavIcon = req.url == "/favicon.ico";
        console.log("router() " + isFavIcon);
            if (isFavIcon) {
                return;
            }
            
            var pathname = url.parse(req.url).pathname;
            console.log("router() " + pathname);
                
            if(pathname == "/insert") {
                    var query = url.parse(req.url).query;
                    var qs = require('querystring');
                    var q = qs.parse(query);
                    var table = q["table"];
                    var time = q["time"];
                    var tag = q["tag"];
                    var log = q["log"];
                    console.log("router() " + table + ", " + time + ", " + tag + ", " + log);
                    
                    insert(time, tag, log);
                    queryAll();
                }
            }
