import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function updateAdminUsername() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'gateway03.us-east-1.prod.aws.tidbcloud.com',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'test',
    ssl: { rejectUnauthorized: false },
  });

  try {
    // Update admin user with username
    const [result] = await connection.execute(
      'UPDATE users SET username = ? WHERE id = ?',
      ['Administrator', 85]
    );

    console.log('✓ Admin username updated successfully');
    console.log(`Rows affected: ${result.affectedRows}`);
  } catch (error) {
    console.error('✗ Error updating admin username:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

updateAdminUsername();
