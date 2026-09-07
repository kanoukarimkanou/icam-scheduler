// import pg from 'pg';
// import fs from 'fs';

// // Collez votre chaine de connexion complete ici (avec votre mot de passe)
// const CONNECTION_STRING = "";

// const client = new pg.Client({
//   connectionString: CONNECTION_STRING,
//   ssl: { rejectUnauthorized: false },
// });

// async function createBackup() {
//   const dateStr = new Date().toISOString().slice(0, 10);
//   const backupFileName = `backup_${dateStr}.sql`;
//   let sqlDump = `-- SAUVEGARDE BASE DE DONNEES ICAM SCHEDULER\n-- Date: ${new Date().toISOString()}\n\n`;

//   try {
//     console.log('Connexion a Supabase en cours...');
//     await client.connect();
//     console.log('Connecte avec succes a PostgreSQL.');

//     // 1. Recuperation de toutes les tables du schema public
//     const tablesRes = await client.query(`
//       SELECT table_name 
//       FROM information_schema.tables 
//       WHERE table_schema = 'public' 
//         AND table_type = 'BASE TABLE'
//       ORDER BY table_name;
//     `);

//     const tables = tablesRes.rows.map((r) => r.table_name);
//     console.log(`Tables detectees (${tables.length}) :`, tables.join(', '));

//     // 2. Desactiver temporairement les contraintes de cles etrangeres lors de la restauration
//     sqlDump += `SET session_replication_role = 'replica';\n\n`;

//     for (const table of tables) {
//       // Lire les donnees de la table
//       const dataRes = await client.query(`SELECT * FROM public."${table}";`);
//       const rows = dataRes.rows;

//       sqlDump += `-- Table: public.${table} (${rows.length} lignes)\n`;
//     //   sqlDump += `TRUNCATE TABLE public."${table}" CASCADE;\n`;

//       if (rows.length > 0) {
//         const columns = Object.keys(rows[0]);
//         const colsSql = columns.map((c) => `"${c}"`).join(', ');

//         for (const row of rows) {
//           const valuesSql = columns
//             .map((col) => {
//               const val = row[col];
//               if (val === null || val === undefined) return 'NULL';
//               if (typeof val === 'number' || typeof val === 'boolean') return val;
//               if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
//               return `'${String(val).replace(/'/g, "''")}'`;
//             })
//             .join(', ');

//           sqlDump += `INSERT INTO public."${table}" (${colsSql}) VALUES (${valuesSql});\n`;
//         }
//       }
//       sqlDump += `\n`;
//       console.log(`Table "${table}" : ${rows.length} ligne(s) sauvegardee(s).`);
//     }

//     // Reactiver les contraintes
//     sqlDump += `SET session_replication_role = 'origin';\n`;

//     fs.writeFileSync(backupFileName, sqlDump, 'utf-8');
//     console.log(`\nSauvegarde terminee avec succes !`);
//     console.log(`Fichier cree sur votre machine : ${backupFileName}`);
//   } catch (err) {
//     console.error('Erreur lors de la sauvegarde :', err.message);
//   } finally {
//     await client.end();
//   }
// }

// createBackup();

import pg from 'pg';
import fs from 'fs';

// Lecture securisee de la chaine de connexion depuis les variables d environnement
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Erreur : La variable d environnement DATABASE_URL est absente.');
  process.exit(1);
}

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function createBackup() {
  const dateStr = new Date().toISOString().slice(0, 10);
  const backupFileName = `backup_${dateStr}.sql`;
  let sqlDump = `-- SAUVEGARDE BASE DE DONNEES ICAM SCHEDULER\n-- Date: ${new Date().toISOString()}\n\n`;

  try {
    console.log('Connexion a Supabase en cours...');
    await client.connect();
    console.log('Connecte avec succes a PostgreSQL.');

    // 1. Recuperation de toutes les tables du schema public
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const tables = tablesRes.rows.map((r) => r.table_name);
    console.log(`Tables detectees (${tables.length}) :`, tables.join(', '));

    // 2. Desactiver temporairement les contraintes de cles etrangeres lors d une restauration
    sqlDump += `SET session_replication_role = 'replica';\n\n`;

    for (const table of tables) {
      const dataRes = await client.query(`SELECT * FROM public."${table}";`);
      const rows = dataRes.rows;

      sqlDump += `-- Table: public.${table} (${rows.length} lignes)\n`;

      if (rows.length > 0) {
        const columns = Object.keys(rows[0]);
        const colsSql = columns.map((c) => `"${c}"`).join(', ');

        for (const row of rows) {
          const valuesSql = columns
            .map((col) => {
              const val = row[col];
              if (val === null || val === undefined) return 'NULL';
              if (typeof val === 'number' || typeof val === 'boolean') return val;
              if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'`;
              return `'${String(val).replace(/'/g, "''")}'`;
            })
            .join(', ');

          sqlDump += `INSERT INTO public."${table}" (${colsSql}) VALUES (${valuesSql});\n`;
        }
      }
      sqlDump += `\n`;
      console.log(`Table "${table}" : ${rows.length} ligne(s) sauvegardee(s).`);
    }

    // Reactivation des contraintes
    sqlDump += `SET session_replication_role = 'origin';\n`;

    fs.writeFileSync(backupFileName, sqlDump, 'utf-8');
    console.log(`\nSauvegarde terminee avec succes !`);
    console.log(`Fichier cree : ${backupFileName}`);
  } catch (err) {
    console.error('Erreur lors de la sauvegarde :', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

createBackup();