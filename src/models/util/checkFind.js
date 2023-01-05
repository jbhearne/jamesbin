/////////////////////////////////////////////////////
///Functions for checking sql results and error handling

//used to check if the result of a function is an object(success) or a string(failure)
const checkForFoundRowObj = (finding) => {
  if (typeof finding === 'string') {
    return {
      results: finding,
      status: 404
    }
  } else if (Object.keys(finding).length) {
    return {
      results: finding,
      status: 200
    }
  } else {
    /*return {
      results: Error(`Unkown result: ${finding}`),
      status: 400
    }*/
    throw Error(`Unkown result: ${finding}`)
  }
}

//used to check if the result of a function is an array(success) or a string(failure)
const checkForFoundRowsArr = (finding) => {
  if (typeof finding === 'string') {
    return {
      results: finding,
      status: 404
    }
  } else if (Array.isArray(finding)) {
    return {
      results: finding,
      status: 200
    }
  } else {
    /*return {
      results: Error(`Unkown result: ${finding}`),
      status: 400
    }*/
    throw Error(`Unkown result: ${finding}`)
  }
}

//used to check if a pool.query has returned anything, throws errors if there are there is no rows array.
//returns a message string if the array is empty and returns false if there are returned rows.
const checkNoResults = results => {
  if (!results) {
    //return 'Query failed.'
    throw Error('Query failed.')
  } else if (!results.rows) {
    //return 'No object found.'
    throw Error(`No rows in: ${results}`)
  } else if (!results.rows.length) {
    return 'No items found.'
  }
  return false;
}

//used to check if a pool.query has returned anything, returns message strings if there are there is no rows array.
//returns a message string if the array is empty and returns false if there are returned rows.
const messageNoResults = results => {
  if (!results) {
    return 'Query failed.'
    //throw Error('Query failed.')
  } else if (!results.rows) {
    return 'No object found.'
    //throw Error(`No rows in: ${results}`)
  } else if (!results.rows.length) {
    return 'No items found.'
  }
  return false;
}

module.exports = {
  checkForFoundRowObj,
  checkForFoundRowsArr,
  checkNoResults,
  messageNoResults
}