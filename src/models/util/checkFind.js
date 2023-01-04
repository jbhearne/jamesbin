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