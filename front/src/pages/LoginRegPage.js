import {useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

function LoginRegPage({setUser}) {

    const emailRef = useRef();
    const passwordOneRef = useRef();
    const passwordTwoRef = useRef();
    const emailLoginRef = useRef();
    const passwordLoginRef = useRef();

    const [regMessage, setRegMessage] = useState('');
    const [logMessage, setLogMessage] = useState('');

    const navigate = useNavigate();

    function onRegister() {
        const user = {
            email: emailRef.current.value,
            passwordOne: passwordOneRef.current.value,
            passwordTwo: passwordTwoRef.current.value,
        }

        const options= {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        }

        fetch("http://localhost:2600/register", options)
            .then(res => res.json())
            .then(data => {
                console.log(data)
                setRegMessage(data.message);
            })
    }

    function onLogin() {
        const user = {
            email: emailLoginRef.current.value,
            password: passwordLoginRef.current.value
        }

        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(user)
        }

        fetch("http://localhost:2600/login", options)
            .then(res => res.json())
            .then(data => {
                if (data.success === true && data.token && data.data) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.data));
                    setUser(data.data);
                    setLogMessage(data.message);
                    navigate("/createitem");
                } else {
                    setLogMessage(data.message);
                }
            })
    }
    return (
        <div className="container">
            <div className="box">
                <input type="text" placeholder='Email Address' ref={emailRef}/>
                <input type="password" placeholder='Password' ref={passwordOneRef}/>
                <input type="password" placeholder='Confirm Password' ref={passwordTwoRef}/>
                <button className="btn btn-create" onClick={onRegister}>Register</button>
                <p>{regMessage}</p>
            </div>

            <div className="box">
                <input type="text" placeholder='Email Address' ref={emailLoginRef}/>
                <input type="password" placeholder='Password' ref={passwordLoginRef}/>
                <button className="btn btn-create" onClick={onLogin}>Login</button>
                <p>{logMessage}</p>
            </div>
        </div>
    )
}

export default LoginRegPage;