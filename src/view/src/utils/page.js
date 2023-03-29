
/*GARBAGE export const pagefff = (direction, pageNum, maxPage, setPageNum) => {
  if (direction === 'prev') {
    if (pageNum > 1) setPageNum(pageNum - 1);
  } else if (direction === 'next') {
    if (pageNum < maxPage) setPageNum(pageNum + 1);
  }
} */

export const page = (pageNum, setPageNum, numItems, setNumItems, maxItems, numPageLink = 5) => {
  const pageEnd = pageNum * numItems;
  const pageStart = pageEnd - numItems;
  const maxPage = Math.ceil(maxItems / numItems);
  
  const pageLinks = [];
  let start = 1
  let end = maxPage
  if (numPageLink < maxPage) {
    if (pageNum <= Math.floor(numPageLink / 2)) {
      end = numPageLink;
    } else if (pageNum > maxPage - (Math.floor(numPageLink / 2))) {
      start = maxPage - (numPageLink - 1);
    } else {
      start = pageNum - Math.floor(numPageLink / 2);
      end = start + (numPageLink - 1)
    }
  }
  for (let i = start; i <= end; i++) {
    pageLinks.push(i)
  }

  return {
    setPage: (directionOrNum) => {
      if (directionOrNum === 'prev') {
        if (pageNum > 1) setPageNum(pageNum - 1);
      } else if (directionOrNum === 'next') {
        if (pageNum < maxPage) setPageNum(pageNum + 1);
      } else if (directionOrNum >= 1 && directionOrNum <= maxPage) {
        setPageNum(parseInt(directionOrNum));
      }
    },
    pageStart,
    pageEnd,
    maxPage,
    pageLinks,
  }
}
