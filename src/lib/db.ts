// src/lib/db.ts
import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'your_database',
};

let pool: mysql.Pool | null = null;

async function getPool(): Promise<mysql.Pool> {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

export async function query(sql: string, values?: any[]) {
  const pool = await getPool();
  try {
    const [rows] = await pool.execute(sql, values);
    return rows;
  } catch (error: any) {
    console.error('Database query error:', error);
    throw new Error(error.message);
  }
}

export async function fetchBlogPosts() {
  try {
    const results = await query('SELECT * FROM blog_posts');
    return results as any[];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function fetchTestimonials() {
  try {
    const results = await query('SELECT * FROM testimonials');
    return results as any[];
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}
