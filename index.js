var ftp = require('./node_modules/ftp-client');
var fs = require('fs');

const drive = "D:/";
const ip = '192.168.0.104';
const port = 21;
let config1 = {
    host: ip,
    port: port,
    user: 'TestFTP1',
    password: '123456'
};

let config2 = {
    host: ip,
    port: port,
    user: 'TestFTP2',
    password: '123456'
};

let config3 = {
    host: ip,
    port: port,
    user: 'TestFTP3',
    password: '123456'
};

let config4 = {
    host: ip,
    port: port,
    user: 'TestFTP4',
    password: '123456'
};

let options = {
    logging: 'basic',
    overwrite: 'none'
}

random = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min) / 100;
}

generateNTFile = (prefix) => {
    
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

    let timeString = year.toString().concat(month,date,hours,minutes,second);
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
    flowOutLine = 'Flow_Out' + '\t' + flowOut + '\tm3/L\t' + timeString + "\t0" + Math.floor(Math.random() * 3, 0).toString() + '\n';
    flowInLine = 'Flow_In' + '\t' + flowIn + '\tm3/L\t' + timeString + "\t0" + Math.floor(Math.random() * 3, 0).toString() + '\n';

    data = [tssLine, codLine, phLine, tempLine, flowOutLine, flowInLine];

    filename = prefix + timeString + ".txt";
    
    data.map(value => {
        fs.appendFileSync(filename, value, err => {
            console.log('aa', value);
        });
    });

    return filename;
}

generateNNFile = (prefix) => {
    
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

    let timeString = year.toString().concat(month,date,hours,minutes,second);
    level = random(1000, 10000);
    flow = random(1000, 10000);

    
    levelLine = 'level' + '\t' + level.toString() + '\tmg/L\t' + timeString + "\t0" + Math.floor(Math.random() * 3, 0).toString() + '\n';
    flowLine = 'flow' + '\t' + flow.toString() + '\tmg/L\t' + timeString + "\t0" + Math.floor(Math.random() * 3, 0).toString() + '\n';

    data = [ levelLine, flowLine ];

    filename = prefix + timeString + ".txt";
    
    data.map(value => {
        fs.appendFileSync(filename, value, err => {
            console.log('aa', value);
        });
    });

    return filename;
}

sendAction = (client, dir, filePath) => {
    client.upload(filePath, dir, {
        overwrite: 'none' },
        function (result) {
            console.log(result);
            fs.unlink(filePath, () => {
                console.log('deleted ', filePath);
        });
    });
}

sendFile = async () => {
    
    client1 = new ftp(config1, options);
    await client1.connect(() => {
        
        var dir2 = drive + 'FTPFolder/NUOC_THAI/NT_KhachHang2';
        let filePath2 = generateNTFile('BL_TT02_NT_');
        sendAction(client1, dir2, filePath2);
    });

    client2 = new ftp(config2, options);
    await client2.connect(() => {
        
        var dir4 = drive + 'FTPFolder/NUOC_THAI/NT_KhachHang4';
        let filePath4 = generateNTFile('BL_TT04_NT_');
        sendAction(client2, dir4, filePath4);
    });

    client3 = new ftp(config3, options);
    await client3.connect(() => {
        var dir6 = drive + 'FTPFolder/NUOC_NGAM/NN_KhachHang6';
        let filePath6 = generateNNFile('BL_TT06_NN_');
        sendAction(client3, dir6, filePath6);
    });  

    client4 = new ftp(config4, options);
    await client4.connect(() => {
        var dir8 = drive + 'FTPFolder/NUOC_NGAM/NN_KhachHang8';
        let filePath8 = generateNNFile('BL_TT08_NN_');
        sendAction(client4, dir8, filePath8);
    });
}

let startTime = new Date().getMinutes();

while(startTime % 5 !== 0) {
    startTime = new Date().getMinutes();
}

console.log('starting...');
setInterval(function() {
    sendFile();
}, 300000);


