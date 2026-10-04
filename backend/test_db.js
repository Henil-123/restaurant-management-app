const { initDb, query } = require('./config/db');

async function test() {
  console.log('Testing DB connection and tables...');
  await initDb();
  
  const [users] = await query('SELECT * FROM users');
  console.log('✅ Users table count:', users.length);
  console.log('Users:', users.map(u => ({ id: u.id, name: u.name, role: u.role })));

  const [reservations] = await query('SELECT * FROM reservations');
  console.log('✅ Reservations table count:', reservations.length);

  const [foods] = await query('SELECT * FROM foods');
  console.log('✅ Foods table count:', foods.length);

  console.log('🎉 DB initialization test passed perfectly!');
  process.exit(0);
}

test().catch(err => {
  console.error('❌ DB Error:', err);
  process.exit(1);
});
