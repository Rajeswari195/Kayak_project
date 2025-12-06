const db = require('./backend/database/mysql_connection');

async function inspect() {
    try {
        const [tables] = await db.execute('SHOW TABLES');
        console.log('Tables:', tables);

        for (const table of tables) {
            const tableName = Object.values(table)[0];
            const [columns] = await db.execute(`DESCRIBE ${tableName}`);
            console.log(`\nSchema for ${tableName}:`, columns);
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

inspect();
