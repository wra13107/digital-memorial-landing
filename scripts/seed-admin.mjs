#!/usr/bin/env node

import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ADMIN_EMAIL = 'Administrator';
const ADMIN_PASSWORD = '$8W4Ds@%kjjZ';
const ADMIN_FIRST_NAME = 'Admin';
const ADMIN_LAST_NAME = 'Administrator';
const ADMIN_PATRONYMIC = 'System';

async function seedAdmin() {
  let pool;
  let connection;
  try {
    // Parse DATABASE_URL
    const dbUrl = new URL(process.env.DATABASE_URL);
    
    // For TiDB Cloud, we need to use SSL
    const config = {
      host: dbUrl.hostname,
      user: dbUrl.username,
      password: dbUrl.password,
      database: dbUrl.pathname.slice(1),
      port: dbUrl.port || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false,
      },
    };

    console.log(`Connecting to database: ${config.host}:${config.port}/${config.database}`);

    pool = mysql.createPool(config);
    connection = await pool.getConnection();

    // Check if admin already exists
    const [existingAdmin] = await connection.execute(
      'SELECT id FROM users WHERE email = ? AND role = ?',
      [ADMIN_EMAIL, 'admin']
    );

    if (existingAdmin.length > 0) {
      console.log('✓ Admin account already exists. Skipping creation.');
      await connection.release();
      await pool.end();
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    // Generate unique openId for admin
    const adminOpenId = `admin-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create admin user
    const [result] = await connection.execute(
      `INSERT INTO users (
        openId,
        email, 
        passwordHash, 
        firstName, 
        lastName, 
        patronymic, 
        birthDate, 
        deathDate, 
        role, 
        loginMethod,
        createdAt, 
        updatedAt,
        lastSignedIn
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW())`,
      [
        adminOpenId,
        ADMIN_EMAIL,
        passwordHash,
        ADMIN_FIRST_NAME,
        ADMIN_LAST_NAME,
        ADMIN_PATRONYMIC,
        new Date('1990-01-01'),
        null,
        'admin',
        'local',
      ]
    );

    console.log(`✓ Admin account created successfully!`);
    console.log(`  Email: ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log(`  User ID: ${result.insertId}`);

    await connection.release();
    await pool.end();
  } catch (error) {
    console.error('✗ Error creating admin account:', error.message);
    if (connection) {
      try {
        await connection.release();
      } catch (e) {
        // Ignore release errors
      }
    }
    if (pool) {
      try {
        await pool.end();
      } catch (e) {
        // Ignore pool end errors
      }
    }
    process.exit(1);
  }
}

// Run seeder
seedAdmin();
