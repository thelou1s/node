var fs = require("fs");
var program = require("commander");

function copyStream(file1, file2) {
    console.log("copyStream() " + file1 + ", " + file2);
    var rs = fs.createReadStream(file1);
    var ws = fs.createWriteStream(file2);
    rs.pipe(ws);
}

//copyStream("./CopyStream.js", "./copy");

program
    .version("1.0")
    .option("-f, --file <string>", "a string argument")
    .parse(process.argv);


if(program.file) {
    console.log("program " + program.file);
    var file = program.file + "";
    copyStream(file, file + "2");
}
