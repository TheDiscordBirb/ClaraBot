const path = require('path');
const fs = require("fs");

module.exports = {
    name: 'managepermanent',
    description: 'Used for managing permanent data.',
    readPermanent(fileName)
    {
        let filePath;
        try
        {
            filePath = path.normalize(path.join(__dirname, "..", "..", "..", "mnt", fileName));
            var data = fs.readFileSync(filePath);
            return JSON.parse(data);
        }
        catch(err)
        {
            console.log("ReadPermanent: File not found. Path: ", filePath);
        }
    },
    writePermanent(fileName, data)
    {
        let filePath;
        try
        {
            filePath = path.normalize(path.join(__dirname, "..", "..", "..", "mnt", fileName));
            fs.writeFileSync(filePath, data);
        }
        catch(err)
        {
            console.log("WritePermanent: Path: ", filePath);    
        }
    },
    getRole(uid, fileName)
    {
        filePath = path.normalize(path.join(__dirname, "..", "..", "..", "mnt", fileName));
        var data = fs.readFileSync(filePath);
        return JSON.parse(data).roles.find((item) => item.uid === uid);
    }
}