const { Pool } = require('pg');
const pool = new Pool({ connectionString: 'postgresql://postgres:admin@localhost:5432/postgres' });
pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'profiles'")
    .then(res => {
        res.rows.forEach(r => console.log(r.column_name));
        process.exit(0);
    })
    .catch(console.error);
