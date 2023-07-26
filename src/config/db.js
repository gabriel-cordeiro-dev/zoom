const { DBSQLClient } = require('@databricks/sql');

const token = "dapi907add19a5c73eea2da77a2b7b07be66";
const server_hostname = "dbc-d7ab2071-0203.cloud.databricks.com";
const http_path = "/sql/1.0/warehouses/5b1d58dbc51978a4";

const client = new DBSQLClient();

const connectToDatabase = async () => {
  await client.connect({
    token: token,
    host: server_hostname,
    path: http_path
  });
  console.log('Connected to the database!');
  return client;
};

module.exports = { connectToDatabase };