import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {useState, useEffect} from "react";
import LoginRegPage from './pages/LoginRegPage';
import CreateItemPage from './pages/CreateItemPage';
import Toolbar from "./components/Toolbar";
import AllItemsPage from "./pages/AllItemsPage";
import ReservedItemsPage from "./pages/ReservedItemsPage";

function App() {

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [reserved, setReserved] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem('user');
        if (saved) {
            setUser(JSON.parse(saved));
        }
    }, []);

  return (
      <>
          <BrowserRouter>
              <Toolbar user={user} setUser={setUser} posts={posts} reserved={reserved} />
              <Routes>
                  <Route path='/' element={<LoginRegPage setUser={setUser}/>}/>
                  <Route path='/createitem' element={<CreateItemPage/>} />
                  <Route path='/allitems' element={<AllItemsPage user={user} setUser={setUser} posts={posts} setPosts={setPosts} />} />
                  <Route path='/reserveditems' element={<ReservedItemsPage user={user} setUser={setUser} reserved={reserved} setReserved={setReserved} />} />
              </Routes>
          </BrowserRouter>
      </>
  );
}

export default App;
