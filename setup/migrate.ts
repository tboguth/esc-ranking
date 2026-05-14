import { Pool } from "pg";
import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";

config();

const __dirname = dirname(fileURLToPath(import.meta.url));

async function migrate() {
  const url = process.env.DATABASE_URL;

  if (!url || url.includes("xxx")) {
    console.error("❌ DATABASE_URL nicht gesetzt oder noch Platzhalter.");
    console.error("   Zu finden in: Supabase Dashboard → Settings → Database → Connection string → Transaction pooler");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  const migrationsDir = join(__dirname, "..", "supabase", "migrations");
  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  console.log(`⏳ ${files.length} Migration(en) gefunden...\n`);

  let failed = 0;

  for (const file of files) {
    const sql = readFileSync(join(migrationsDir, file), "utf8");
    process.stdout.write(`   ▶ ${file} ... `);
    try {
      await pool.query(sql);
      console.log("✅");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      // Policies/Objekte die schon existieren → kein echter Fehler
      if (msg.includes("already exists")) {
        console.log("⏭️  (bereits vorhanden, übersprungen)");
      } else {
        console.log("❌");
        console.error(`      Fehler: ${msg}`);
        failed++;
      }
    }
  }

  await pool.end();

  if (failed > 0) {
    console.error(`\n❌ ${failed} Migration(en) fehlgeschlagen.`);
    process.exit(1);
  } else {
    console.log("\n✅ Alle Migrationen abgeschlossen.");
  }
}

migrate();
