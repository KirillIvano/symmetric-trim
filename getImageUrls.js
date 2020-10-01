require('dotenv').config();


const {Client} = require('pg');
const client = new Client();
client.connect();

const getImagesQuery = () => 'SELECT photo_file from app_productversion';

const getImagesUrls = async () => {
    const {rows} = await client.query(getImagesQuery());

    await client.end();

    return rows.map(row => row['photo_file']);
};

module.exports = {
    getImagesUrls,
};
