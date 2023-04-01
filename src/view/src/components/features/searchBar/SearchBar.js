import { useDispatch, useSelector } from "react-redux";
import { selectSearch, setSearch, clearSearch } from "./searchBarSlice";

function SearchBar() {
  const dispatch = useDispatch();

  const handleChange = e => {
    dispatch(setSearch(e.target.searchBar.value));
  }

  return (
    <div>
      <form>
        <input type='search' placeholder='Search' id='searchBar' onChange={handleChange}></input>
      </form>
    </div>
  )
}

export default SearchBar;