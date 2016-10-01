var fs = require("fs");
var http = require("http");
var sql = require("sqlite3").verbose()

var DB_FILE = "log.db";
var SQL_CREATE_TABLE = "create table if not exists log_table(_id integer primary key autoincrement, _time text, _tag text, _log text)";
var SQL_SELECT_ALL = "select _id, _time, _tag, _log from log_table";

var dbExists = fs.existsSync(DB_FILE);
var db = new sql.Database(DB_FILE);

var onSerialize = function() {
	if(dbExists) {
		create();
		//insert("time 1", "tag 1", "log 1");
		queryAll();
	}

	console.log("onSerialize ok");
}

function create() {

	db.run(SQL_CREATE_TABLE);
	console.log("create ok");

}

function insert(time, tag, log) {
	
	console.log("insert() " + time + ", " + tag + ", " + log);
	var SQL_INSERT_INTO = db.prepare("insert into log_table(_time, _tag, _log) values(?, ?, ?)");
	SQL_INSERT_INTO.run(time, tag, log);
	SQL_INSERT_INTO.finalize();

}

function queryAll() {
	db.each(SQL_SELECT_ALL, function(err, row) {
		console.log("queryAll " + row._id + ", " + row._time + ", " + row._tag + ", " + row._log);
	});
}


db.serialize(onSerialize);


var url = require("url");
var SERVER_PORT = 8080;

var server = http.createServer(function onRequest(req, res) {
	//console.log("onRequest " + toString.call(req));
	console.log(".");
	console.log(".");
	
	res.write("Hello World2");
	res.end();

	router(req);
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

server.listen(SERVER_PORT);

console.log("server listenning on 8080");
console.log("======================================================");
