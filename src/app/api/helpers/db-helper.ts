import mysql, { PoolConnection } from "mysql2/promise";

const dbPool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  waitForConnections: true,
  connectionLimit: Number(process.env.CONNECTION_LIMIT),
  queueLimit: Number(process.env.QUEUE_LIMIT),
});

const transactionHelper = async (
  dbConnection: PoolConnection,
  callback: () => Promise<void>
) => {
  try {
    await dbConnection.beginTransaction();
    await callback();
    await dbConnection.commit();
  } catch (e) {
    await dbConnection.rollback();
    throw e;
  } finally {
    await dbConnection.release();
  }
};

export { dbPool, transactionHelper };
