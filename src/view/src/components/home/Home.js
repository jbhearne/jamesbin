import { fetchUser } from "../features/user/userSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

function Home() {
  const test = "helllo";
  const dispatch = useDispatch();

  /*useEffect(() => {
    dispatch(fetchUser())
  }, []);*/

  const handleTest = (e) => {
    dispatch(fetchUser())
  }

  return (
    <div>
      <h2>Mission Statement</h2>
      <p>Hello this is something about what this is</p>
      <p>{test}</p>
      <button onClick={handleTest}></button>
    </div>
  )
}

export default Home;