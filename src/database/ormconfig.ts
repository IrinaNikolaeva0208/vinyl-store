import { DataSourceOptions, DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { POSTGRES_DATABASE_TYPE } from 'src/utils/constants';

dotenv.config();

const options: DataSourceOptions = {
  type: POSTGRES_DATABASE_TYPE,
  host: process.env.PG_HOST,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  migrationsRun: true,
  ssl: true,
  synchronize: false,
};

const dataSource = new DataSource(options);
export { options };
export default dataSource;
