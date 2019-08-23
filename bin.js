const index = require('./index');
const fs = require('fs');

const configFile = process.argv[2];

if (!configFile) {
    console.log('To start the application pass the config file as parameter');
} else {
    fs.readFile(configFile, (err, data) => {
        if (err) {
            console.log(`Error reading the configuration file ${configFile}`, err);
            return;
        }
        let configs = {};
        try {
            configs = JSON.parse(data);
        } catch (err) {
            console.log(`Error in the configuration file ${configFile}`, err);
            return;
        }
        index.sendInfo(configs)
        setInterval(() => index.sendInfo(configs), configs.interval);
    });
}