import { MongoClient, Db } from 'mongodb';

export default (() => {
  let instance: Db;
  const uri = process.env.MONGODB_URL ?? 'mongodb://root:rootpassword@localhost:27017/';
  const createInstance = async () => {
    instance = new MongoClient(uri).db(process.env.MONGODB_NAME);
    console.log('Connected to Native MongoDB');

    return instance;
  };
  return {
    getInstance: async () => {
      if (!instance) {
        instance = await createInstance();
      }
      return instance;
    },
  };
})();
