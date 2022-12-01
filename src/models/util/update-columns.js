const updateColumns = rowObj => {
  const columnsArr = [];
  let colUpdate = '';

  for (colName in rowObj) {
    console.log(colName + rowObj[colName]);
    colUpdate = rowObj[colName] ? ` ${colName} = '${rowObj[colName]}'` : '';
    columnsArr.push(colUpdate);
  }
  //TODO:probably should change to the JS filter method.
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