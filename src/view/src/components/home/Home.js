import { fetchUser, setIsloggedIn, removeUser } from "../features/user/userSlice";
import { logoutToken } from "../../utils/apiLogin";
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

  const logoutTest = (e) => {
    dispatch(removeUser());
    logoutToken();
  }

  return (
    <div>
      <h2>Mission Statement</h2>
      <p>Hello this is something about what this is</p>
      <p>{test}</p>
      <button onClick={handleTest}></button><br/>
      <button onClick={logoutTest}></button>
    </div>
  )
}

export default Home;