var https = require('https');
const fs = require('fs');
const disk = require('diskusage');
const shell = require('node-powershell');
const axios = require('axios');
let caCrt = '';

try {
    caCrt = fs.readFileSync('./ca.crt')
} catch(err) {
    console.log('Make sure that the CA cert file must be named ca.crt', err);
}
const httpsAgent = new https.Agent({ ca: caCrt, keepAlive: false });

const valvontaGetReq = (valvontaUrl, params) => {
    axios.get(valvontaUrl, { 
        params: params,
        httpsAgent: httpsAgent
    })
    .then( res => {
        console.log(Date());
        console.log('statusCode', res.status);
        console.log('Response', res.data);
    }).catch( error => console.log(`${Date()} fail: ${valvontaUrl}: ${error}`)); 
};

const executePowerShell = (command) => {
    let ps = new shell({
        executionPolicy: 'Bypass',
        noProfile: true
    });
    ps.addCommand(command);
    const shellOutput = ps.invoke()
    .then( output =>  {
        ps.dispose();
        return output;
    })
    .catch(err => {
        console.log('Powershell error', err);     
        ps.dispose();
        return err;
    })
    return shellOutput;
};

const readDisk = (volume) => {
    let response = {};
    disk.check(volume, (err, info) => {
        if (err) {
            console.log('Error reading volume', err);
            response = {
                'volume': volume,
                'disk-free': JSON.stringify(err)
            };
        } else {
            response = {
                'volume': volume,
                'disk-free': info.free
            };
        }
    })
    return response;
}

module.exports = { valvontaGetReq, executePowerShell, readDisk }
