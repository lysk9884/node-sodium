var exec = require("child_process").exec;
var os = require("os");

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
    console.log("No tests are defined for Windows.");
    process.exit(0);
}