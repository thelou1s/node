var fs = require("fs");
var http = require("http");
var sql = require("sqlite3").verbose()

var DB_FILE = "log.db";
var DB_VERSION = 1;
var SQL_CREATE_TABLE = "create table if not exists log_table(_id integer primary key autoincrement, _user text, _time text, _tag text, _log text)";
var SQL_SELECT_ALL = "select _id, _user, _time, _tag, _log from log_table";
var CRLF = "\n";

var dbExists = fs.existsSync(DB_FILE);
var db = new sql.Database(DB_FILE);

var onSerialize = function() {
	if(dbExists) {
		create();
		queryAll();
	}

	console.log("onSerialize ok");
}

function create() {

	db.run(SQL_CREATE_TABLE);
	console.log("create ok");

}

function insert(user, time, tag, log) {
	
	console.log("insert() " + time + ", " + tag + ", " + log);
	var SQL_INSERT_INTO = db.prepare("insert into log_table(_user, _time, _tag, _log) values(?, ?, ?, ?)");
	SQL_INSERT_INTO.run(user, time, tag, log);
	SQL_INSERT_INTO.finalize();

}

function deleteFrom(id) {

   console.log("deleteFrom() " + id);
   var SQL_DELETE_FROM = db.prepare("delete from log_table where _id = ?");
   SQL_DELETE_FROM.run(id);
   SQL_DELETE_FROM.finalize();
   
}

function update(id, user, time, tag, log) {
   
   console.log("update() " + id + ", " + user + ", " + time + ", " + tag + ", " + log);
   var SQL_UPDATE = db.prepare("update log_table set _user = ?, _time = ?, _tag = ?, _log = ? where _id = ?");
   SQL_UPDATE.run(user, time, tag, log, id);
   SQL_UPDATE.finalize();

}

function queryAll() {
	db.each(SQL_SELECT_ALL, function(err, row) {
		console.log("queryAll() " + row._id + ", " + row._user + ", " + row._time + ", " + row._tag + ", " + row._log);
	});
}

function run(sql) {

      console.log("run() " + sql);
      db.run(sql);

}


db.serialize(onSerialize);


var url = require("url");
var SERVER_PORT = 8080;

function onEnd(res) {
    console.log("onEnd() ");
    res.write("onEnd() Hello World2 \n");
    res.end();
}

function onComplete(res) {
    console.log("onComplete() ");
    onEnd(res);
}

var server = http.createServer(function onRequest(req, res) {
	//console.log("onRequest " + toString.call(req));
	console.log(".");
	console.log(".");
	
    router(req);
	
    db.each(
        SQL_SELECT_ALL, 
        function onEach(err, row) {
		    if(err) {
                throw err;
            }
            
            var text = "onEach() " + row._id + ", " + row._time + ", " + row._tag + ", " + row._log;
            console.log(text);
            res.write(text + CRLF);
        }, 
        function onComplete() {
		console.log("onComplete() ");
		res.write("onComplete()  ");
		res.end();
	}
    );

});
	

function router(req) {
	console.log("router() http://localhost:" + SERVER_PORT + req.url);
	var isFavIcon = req.url == "/favicon.ico";
	console.log("router() " + isFavIcon);
        if (isFavIcon) {
		return;
	}

	var pathname = url.parse(req.url).pathname;
	console.log("router() " + pathname);

        var query = url.parse(req.url).query;
	var qs = require('querystring');
	var q = qs.parse(query);
	if(pathname == "/insert") {
		var table = q["table"];
		var user = q["user"];
		var time = q["time"];
		var tag = q["tag"];
		var log = q["log"];
		insert(user, time, tag, log);
	} 
	else if(pathname == "/delete") {
	       var id = q["id"];
	       deleteFrom(id);
	}
        else if(pathname == "/update") {
               var table = q["table"];
               var id = q["id"];
               var user = q["user"];
               var time = q["time"];
               var tag = q["tag"];
               var log = q["log"];
               update(id, user, time, tag, log);
        }
        else if(pathname == "/query") {
               queryAll();
        }
        else if(pathname == "/run") {
               var sql = q["sql"];
               run(sql);
        }
}

server.listen(SERVER_PORT);

console.log("server listenning on " + SERVER_PORT);
console.log("======================================================");
