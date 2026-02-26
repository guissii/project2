import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Replace with your local PostgreSQL credentials
const connectionString = 'postgresql://postgres:admin@localhost:5432/postgres';

const client = new Client({
    connectionString,
});

async function runSeed() {
    try {
        console.log('Connecting to the database...');
        await client.connect();
        console.log('Connected successfully.');

        // 1. Read and execute schema
        const schemaPath = path.join(__dirname, 'db', 'schema.sql');
        console.log(`Reading schema from ${schemaPath}...`);
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Executing schema...');
        await client.query(schemaSql);
        console.log('Schema executed successfully.');

        // 2. Read and execute seed
        const seedPath = path.join(__dirname, 'db', 'seed.sql');
        console.log(`Reading seed data from ${seedPath}...`);
        const seedSql = fs.readFileSync(seedPath, 'utf8');

        console.log('Executing seed data...');
        await client.query(seedSql);
        console.log('Seed data embedded successfully.');

    } catch (err) {
        console.error('Error executing seed script:', err);
    } finally {
        await client.end();
        console.log('Database connection closed.');
    }
}

runSeed();
