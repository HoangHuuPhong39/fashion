const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

function hashPassword(plain) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(plain, salt);
}

try {
  if (fs.existsSync(USERS_FILE)) {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    const users = JSON.parse(raw);
    const demoEmails = ['hoangyen@tada.vn', 'minhanh@tada.vn'];

    let count = 0;
    const filtered = users.filter((u) => !demoEmails.includes(u.email?.toLowerCase()));

    const migrated = filtered.map((u) => {
      const clone = { ...u };
      if (clone.password) {
        if (!clone.passwordHash) {
          clone.passwordHash = hashPassword(clone.password);
          count++;
        }
        delete clone.password;
      }
      return clone;
    });

    fs.writeFileSync(USERS_FILE, JSON.stringify(migrated, null, 2), 'utf-8');
    console.log(`Successfully migrated ${count} users. Plaintext passwords removed.`);
  } else {
    console.log('users.json not found.');
  }
} catch (e) {
  console.error('Migration failed:', e);
}
