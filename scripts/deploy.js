var Rsync = require('rsync');
var chalk = require('chalk');
var fs = require('fs');
var path = require('path');

console.log();
if (!fs.existsSync(path.resolve(__dirname,'../build/admin/'))) {
  fs.mkdirSync(path.resolve(__dirname,'../build/admin/'), 0755);
}

if (!fs.existsSync(path.resolve(__dirname,'../build/admin/index.html'))) {
  fs.createReadStream(path.resolve(__dirname,'../build/index.html')).pipe(fs.createWriteStream(path.resolve(__dirname,'../build/admin/index.html')));
}

// Build the command
var rsync = new Rsync()
  .exclude('.DS_Store')
  .flags('av')
  .set("delete")
  .source('./build/')
  .destination(`swingkd@vergil.u.washington.edu:~/public_html/team-food/`)

console.log("");
console.log("");
console.log("Deploying to Server: " + chalk.green("http://students.washington.edu/swingkd/team-food/"));
console.log("You will need to input your " + chalk.blue("password"));
console.log("");
console.log("");

// Execute the command
rsync.execute(function(error, code, cmd) {
  // we're done
  if (error) {
    console.log(cmd);
    console.log("");
    console.error(error);
  } else {
    console.log("");
    console.log("");
    console.log("Deployed!! visit it at: " + chalk.green("http://students.washington.edu/swingkd/team-food/"));
  }
  console.log("");
  console.log("");
}, function(data){
  process.stdout.write(data);
});
