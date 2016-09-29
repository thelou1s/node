//http://blog.csdn.net/mdl206/article/details/50439463

//console.log("sqlite test");
//var fs = require("fs");
//var file = "/" + "test.db";
//var exists = fs.existsSync(file);
//
//if(!exists) {
//    console.log("Creating DB file.");
//    fs.openSync(file, "w");
//}
//
//var sqlite3 = require("sqlite3").verbose();
//var db = new sqlite3.Database(file);
//
//db.serialize(function() {
//    if(!exists) {
//        db.run("CREATE TABLE Stuff (thing TEXT)");
//    }
//
//    var stmt = db.prepare("INSERT INTO Stuff VALUES (?)");
//
//    //Insert random data
//    var rnd;
//    for (var i = 0; i < 10; i++) {
//        rnd = Math.floor(Math.random() * 10000000);
//        stmt.run("Thing #" + rnd);
//    }
//
//    stmt.finalize();
//    db.each("SELECT rowid AS id, thing FROM Stuff", function(err, row) {
//        console.log(row.id + ": " + row.thing);
//    });
//});
//
//db.close();

var fs = require("fs");
var sql = require("sqlite3").verbose();

var CUR_DIR = ".";
var DIVIDER = "/";
var CRLF = "\r\n";
var FILEPATH_DB = CUR_DIR + DIVIDER + "filepath.db";
var FILEPATH_TXT = CUR_DIR + DIVIDER + "filepath.txt";
var TABLE_NAME = "aio_del_path";

function serializeCallback() {
    var exists = fs.existsSync(FILEPATH_DB);
    if(exists) {
        console.log("DB::db.serialize");
        fs.open(FILEPATH_TXT, "w", 0644, openCallback);
    }
}

function openCallback(e, fd) {
    if(e) {
        throw e;
    }

    var selectSql = "SELECT _id, filePath, pkgName FROM filepath_tb";
    db.each(selectSql, function eachCallback(err, row) {
          var insertSql = "insert into " + TABLE_NAME + "(path) values('" + row.filePath + "');" + CRLF;
          fs.write(fd, insertSql, "a", 0644, function writeCallback(e){
                if(e) {
                    console.log("DB::fs.write " + e);
                    fs.closeSync(fd);
                    throw e;
                }

                console.log("DB::fs.write " + insertSql);
           })
     });
}

var db = new sql.Database(FILEPATH_DB);
db.serialize(serializeCallback);