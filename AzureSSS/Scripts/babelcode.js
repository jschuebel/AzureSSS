/* Output of Babel object 
console.log('Babel =', Babel);

var users = { '123' : { name : 'Joe Montana'} };
const getMessage = () => "babel arrow getMessage function";
document.getElementById('output').innerHTML = getMessage();
*/
/*
var promise = new Promise(function (resolve, reject) {
resolve("first test");
});

promise.then(function(val) {
console.log("first then:", val); // 1
return val + "-added1";
});



*/


async function process(val) {
    console.log('in process funtion', val);
    var id = await getId();
    console.log("Return from getId() User ID: " + id);

    var name = await getUserName(id);
    console.log("Return from getUserName() User Name: " + name);
}

function getId() {
    return new Promise((resolve, reject) => {
        setTimeout(() => { console.log('getId resolving'); resolve("123"); }, 2000);
    });
}
function getUserName(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => { console.log('getUserName resolving; username: ' + id); resolve(users[id].name); }, 3000);
    });
}

var cnt = 1;
var log = '';
function doWork() {
    log += "" + cnt;
    cnt++;
    console.log("doWork resolve log=", log);
    return Promise.resolve();
}

function doError() {
    log += "E";
    console.log("doError throwing error log=", log);
    throw new Error("oops!");
}

function errorHandler(error) {
    log += "H";
    console.log("Errorhandler log=", log);
}

function verify(val) {
    console.log("verify log=", log);
    console.log("verify val=", val);

    //expect(log).toBe("WWEH");
    //done();
}
