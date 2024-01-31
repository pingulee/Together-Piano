import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = 'mongodb+srv://admin:admin@together-piano.gi6goiw.mongodb.net/';
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export async function connectAndPing() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
  } finally {
    await client.close();
  }
}
