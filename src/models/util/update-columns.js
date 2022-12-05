//WARN: this module is a flawed concept...
//NOTE: FROM NODE-POSTGRES: "PostgreSQL does not support parameters for identifiers. If you need to have dynamic database, schema, table, or column names (e.g. in DDL statements) use pg-format package for handling escaping these values to ensure you do not have SQL injection!"
//LINK - https://www.npmjs.com/package/pg-format
//columns/tables/schema cannot use numbered parameters, only values for searching, adding, updating.
const pool = require('./pool');

const updateColumns = rowObj => {
  const columnsArr = [];
  let colUpdate = '';

  for (colName in rowObj) {
    console.log(colName + rowObj[colName]);
    colUpdate = rowObj[colName] ? ` ${colName} = '${rowObj[colName]}'` : '';
    columnsArr.push(colUpdate);
  }
  //NOTE: probably should change to the JS filter method.
  for (let i=0; i < columnsArr.length; i++) {
    console.log(i)
    if (columnsArr[i].length === 0) {
      columnsArr.splice(i, 1);
      i--;
    } 
  };

  return columnsArr.join();
 };

 module.exports = updateColumns;