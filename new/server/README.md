# SpiceHaven Backend

This is the Node.js/Express backend for SpiceHaven using MySQL.

## Setup Instructions

1. Ensure MySQL is running on your machine.
2. Create the database and tables using the provided `schema.sql` file.
   - Example: `mysql -u root -p < schema.sql`
3. Edit the `.env` file to match your MySQL credentials (DB_HOST, DB_USER, DB_PASS, DB_NAME).
4. Run `npm install` to install dependencies.
5. Run `npm start` to start the server on port 5000.
