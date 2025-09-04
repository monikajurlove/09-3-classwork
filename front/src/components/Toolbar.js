import {Link, useNavigate} from 'react-router-dom';
import {useState, useEffect} from "react";

function Toolbar({user, setUser, posts, reserved}) {
    const [currentUser, setCurrentUser] = useState(null);
    const navigate = useNavigate();
    const postsAmount = posts.length;
    const reservedAmount = reserved.length;

    useEffect(() => {
        if (user) {
            setCurrentUser(user);
            return;
        }

        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        } else {
            setCurrentUser(null);
        }
    }, [user]);

    function onLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    }

    const shown = currentUser || user;

    return (
        <div className='toolbar'>
            <h3>
                {user
                    ? `Logged in with: ${user.email}, id: ${user._id}`
                    : "Not logged in"}
            </h3>

            {user && (
                <div className="toolbar-right">
                    <h3>Money: {user.money}</h3>
                    <Link to='/allitems'><button>All items list ({postsAmount})</button></Link>
                    <Link to='/createitem'><button>Upload item</button></Link>
                    <Link to='/reserveditems'><button>My reserved items ({reservedAmount})</button></Link>
                    <button onClick={onLogout}>Log out</button>
                </div>
            )}
        </div>
    );
}

export default Toolbar;
