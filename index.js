var ftp = require('./node_modules/ftp-client');
var fs = require('fs');

let config = {
    host: '192.168.43.107',
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
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    let second = date_ob.getSeconds();

    let timeString = year.toString().concat(month,date,hours,minutes);
    tss = random(1000, 10000);
    cod = random(1000, 10000);
    ph = random(1000, 1400);
    temp = random(2500, 4500);
    flowOut = random(1000, 10000);
    flowIn = random(1000, 10000);
    
    tssLine = 'TSS' + '\t' + tss.toString() + '\tmg/L\t' + timeString + '\n';
    codLine = 'COD' + '\t' + cod.toString() + '\tmg/L\t' + timeString + '\n';
    phLine = 'pH' + '\t' + ph.toString() + '\t-\t' + timeString + '\n';
    tempLine = 'Temp' + '\t' + temp + '\toC\t' + timeString + '\n';
    flowOutLine = 'FlowOut' + '\t' + flowOut + '\tm3/L\t' + timeString + '\n';
    flowInLine = 'FlowIn' + '\t' + flowIn + '\tm3/L\t' + timeString + '\n';

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
                    console.log('delted ', filepath);
                });
        });
    });
}

setInterval(function() {
    sendFile();
}, 180000)

