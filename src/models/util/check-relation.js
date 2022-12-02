//WARNING: this module is a flawed concept...
//FROM NODE-POSTGRES: "PostgreSQL does not support parameters for identifiers. If you need to have dynamic database, schema, table, or column names (e.g. in DDL statements) use pg-format package for handling escaping these values to ensure you do not have SQL injection!"
//columns/tables/schema cannot use numbered parameters, only values for searching, adding, updating.
const pool = require('./pool');

const checkManyToOne = (columns, tableA, tableB, fkey, pkey, tableAid) => {
  console.log('test checkManyToOne ' + tableAid)
  console.log(columns + tableA + tableB + fkey + pkey + tableAid)
  const sql = 'SELECT $1 FROM $2 JOIN $3 ON $4 = $5 WHERE id = $6';
  
  pool.query(sql, [columns, tableA, tableB, fkey, pkey, tableAid], (err, res) => {
    if (err) {
      throw err;
    }
    const results = res.rows;
    let notNull = false;
    if (results.length === 1) {
      if (results[0]) {
        notNull = true;
      } else if (results.length > 1) {
        throw Error('Multiple Rows. This should be a many-to-one relationship and only return one result');
      }
    }
    return notNull;
  });
};

module.exports = {
  checkManyToOne
}
