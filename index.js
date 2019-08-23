const taskList = require('tasklist');
const os = require('os');
const services = require('./services');

const getUserCount = async () => {
    const output = await services.executePowerShell('query user');
    return output.split('\n').length -2;
};

const getVolumes = async () => {
    const volumesArray = await services.executePowerShell('gdr -PSProvider \'FileSystem\'')
    .then( string => string.split('\n'))
    .then( array => array.slice(3,array.length-3))
    .then( volumesArray => {
        let result = [];
        volumesArray.forEach( (volume, i) => {
            result[i] = `${volume.charAt(0)}:`
        })
        return result;
    })
    return volumesArray;
 }

 const getVolumesSpace = async (volumesArray) => {
    let volumesDiskSpace = [];
    volumesArray.forEach( volume => {
        const diskSpace = services.readDisk(volume);
        volumesDiskSpace.push(diskSpace);
    });
    return volumesDiskSpace;
 }

 const getProcesses = (processesNames) => {
    const processes = taskList({verbose: true}).then(tasks => {
        const  filteredProcesses = tasks.filter(task => {       
            let filter = false;
            processesNames.forEach(name => {
                if (task.imageName === name) {
                    filter = true;
                }
            })
            return filter;
        });
        return filteredProcesses;
    })
    return processes;
 }

exports.sendInfo = async (configs) => {
    const valvontaUrl = configs.url
    const data= {
        'group': configs.group,
        'mg': configs.mg,
        's': configs.session,
        'sg': configs.sg,
        'tag': '',
        'dat': ''
    }
    
    const osUptime = os.uptime();
    services.valvontaGetReq( valvontaUrl, { ...data, 'tag': 'osUptime', 'dat': osUptime } );

    const volumesArray = await getVolumes();
    const volumesDiskSpace = await getVolumesSpace(volumesArray);
    volumesDiskSpace.forEach( volume => {
        services.valvontaGetReq( valvontaUrl, { ...data, 'tag': 'diskSpace', 'dat': volume } );
    })

    const osLoadAvg = os.loadavg();
    services.valvontaGetReq( valvontaUrl, { ...data, 'tag': 'osLoadAvg', 'dat': osLoadAvg.toString() } );

    const osTotMem = os.totalmem();
    services.valvontaGetReq( valvontaUrl, { ...data, 'tag': 'osTotMem', 'dat': osTotMem } );

    const osFreeMem = os.freemem();
    services.valvontaGetReq( valvontaUrl, { ...data, 'tag': 'osFreeMem', 'dat': osFreeMem } );

    const userCount = await getUserCount();
    services.valvontaGetReq( valvontaUrl, { ...data, 'tag': 'userCount', 'dat': userCount } );

    const processes = await getProcesses(configs.processesNames);
    processes.forEach( process => {
        services.valvontaGetReq( valvontaUrl, { ...data, 'tag': `process-${process.imageName}`, 'dat': process } );
    })
}


