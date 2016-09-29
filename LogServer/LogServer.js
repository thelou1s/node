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
		insert("time 1", "tag 1", "log 1");
		queryAll();
	}

	console.log("onSerialize ok");
}

function create() {

	db.run(SQL_CREATE_TABLE);
	console.log("create ok");

}

function insert(time, tag, log) {
	
	var SQL_INSERT_INTO = db.prepare("insert into log_table(_time, _tag, _log) values(?, ?, ?)");
	SQL_INSERT_INTO.run(time, tag, log);
	SQL_INSERT_INTO.finalize();
	console.log("insert ok");

}

function queryAll() {
	db.each(SQL_SELECT_ALL, function(err, row) {
		console.log("queryAll " + row._time + ", " + row._tag + ", " + row._log);
	});
}


db.serialize(onSerialize);


var server = http.createServer(function (req, res){
	res.writeHead(200, {"Content-Type": "text/plain"});
	res.end("Hello World");
	console.log("createServer ok");
});

server.listen(8080);

console.log("server listenning on 8080");
