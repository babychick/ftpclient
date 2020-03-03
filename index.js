var ftp = require('./node_modules/ftp-client');
var fs = require('fs');

let config = {
    host: '172.16.2.113',
    port: 21,
    user: 'TestFTP1',
    password: '123456'
};

let options = {
    logging: 'basic',
    overwrite: 'none'
}

random = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min) / 100;
}

generateFile = () => {
    
    let data = [];
    var filename = '';
    var tss, cod, ph, temp, flowOut, flowIn = 0;
    let tssLine, codLine, phLine, tempLine, flowOutLine, flowInLine = ''
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = ("0" + (date_ob.getHours())).slice(-2);
    // current minutes
    let minutes = ("0" + (date_ob.getMinutes())).slice(-2);
    let second = ("0" + (date_ob.getSeconds())).slice(-2);

    let timeString = year.toString().concat(month,date,hours,minutes);
    tss = random(1000, 10000);
    cod = random(1000, 10000);
    ph = random(1000, 1400);
    temp = random(2500, 4500);
    flowOut = random(1000, 10000);
    flowIn = random(1000, 10000);

    
    tssLine = 'TSS' + '\t' + tss.toString() + '\tmg/L\t' + timeString + "\t0" + Math.floor(Math.random() * 3, 0).toString() + '\n';
    codLine = 'COD' + '\t' + cod.toString() + '\tmg/L\t' + timeString + "\t0" + Math.floor(Math.random() * 3, 0).toString() + '\n';
    phLine = 'pH' + '\t' + ph.toString() + '\t-\t' + timeString + "\t0" + Math.floor(Math.random() * 3, 0).toString() + '\n';
    tempLine = 'Temp' + '\t' + temp + '\toC\t' + timeString + "\t0" + Math.floor(Math.random() * 3, 0).toString() + '\n';
    flowOutLine = 'FlowOut' + '\t' + flowOut + '\tm3/L\t' + timeString + "\t0" + Math.floor(Math.random() * 3, 0).toString() + '\n';
    flowInLine = 'FlowIn' + '\t' + flowIn + '\tm3/L\t' + timeString + "\t0" + Math.floor(Math.random() * 3, 0).toString() + '\n';

    data = [tssLine, codLine, phLine, tempLine, flowOutLine, flowInLine];

    filename = 'BL_TT47_NN_' + timeString + ".txt";
    
    data.map(value => {
        fs.appendFileSync(filename, value, err => {
            console.log('aa', value);
        });
    });

    return filename;
}

sendFile = () => {
    client = new ftp(config, options);
    client.connect(() => {
        console.log('connected to ftp');
        var dir = 'C:/FolderFTP1';

        let filepath = generateFile();
        client.upload(filepath, dir, {
            overwrite: 'none' },
            function (result) {
                console.log(result);
                fs.unlink(filepath, () => {
                    console.log('deleted ', filepath);
                });
        });
    });
}

setInterval(function() {
    sendFile();
}, 60000)

