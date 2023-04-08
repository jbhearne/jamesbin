//GARBAGE unused module
//IDEA in order to implement this I would have to add a body, which would mean changing to a POST request?
//IDEA unless I can include this in the headers? Which should work. or as a query.which is probably how that is supposed to work.

const sql = 'SELECT * FROM _____ WHERE ___ = $1 ORDER BY $2 DESC LIMIT $3 OFFSET $4'

const sort = (order, limit, page) => {
  const offset = limit * page;
  return {
    order: order,
    limit: limit,
    offset: offset,
  }
}