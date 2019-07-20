//using the infura.io node, otherwise ipfs requires you to run a //daemon on your own computer/server.
const IPFS = require('ipfs-api')

const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https'
});

const uploadFile = async (_content) => {
    console.log("UPLOADING TO IPFS")
    let bufferContent = Buffer.from(JSON.stringify(_content));
    console.log(bufferContent)
    const filesAdded = await ipfs.add(bufferContent)
    /*eslint no-console: ["error", { allow: ["warn", "error"] }] */
    console.log('Added file:', filesAdded[0].hash)
    return filesAdded[0].hash
}

const viewFile = async (c) => {
    const fileBuffer = await ipfs.cat(c)
    return JSON.parse(fileBuffer.toString());
}

export {
    uploadFile,
    viewFile
}