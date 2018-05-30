var exec = require("child_process").exec;
var os = require("os");
var fs = require("fs");

function run(cmdLine, expectedExitCode) {
    return new Promise(function(resolve, reject) {
        console.log("=>> " + cmdLine);
        var child = exec(cmdLine);

        if (typeof expectedExitCode === "undefined") {
            expectedExitCode = 0;
        }

        child.stdout.on("data", function(data) {
            process.stdout.write(data.toString());
        });
        child.stderr.on("data", function(data) {
            process.stdout.write(data.toString());
        });
        child.on("exit", function(code) {
            if (code !== expectedExitCode) {
                reject(new Error(cmdLine + " exited with code " + code));
            }

            resolve();
        });
    });
}

function exists(path) {
    try {
        fs.accessSync(path, fs.F_OK);
        return true;
    } catch (e) {
        return false;
    }
}

function handleErr(err) {
    console.error("!! Error encountered while building:");
    console.error(err);
    process.exit(1);
}

if (os.platform() !== "win32") {
    run("make test")
        .then(() => process.exit(0))
        .catch(handleErr);
} else {
    console.log("There are no tests defined for Windows. Checking if build is successful...");
    console.log("Checking for `build/Release/sodium.node`...");
    if (exists("./build/Release/sodium.node")) {
        console.log("`build/Release/sodium.node` is found, exiting...");
        process.exit(0);
    }
    console.error("`build/Release/sodium.node` is NOT found, exiting...");
    process.exit(1);
}