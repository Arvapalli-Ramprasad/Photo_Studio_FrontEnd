import React,{useState} from 'react';

const Login = () => {

    const [text, SetText] = useState("");
    const [btnClick,setbtn ] = useState("")

    function getValue(event){
        SetText(event.target.value)
        setbtn("")
    }

    function implementSubmit(event){
        event.preventDefault()
        setbtn(text)
        SetText("")
    }

    
    return (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
            <h1>Login Page</h1>

            <form onSubmit={implementSubmit}>
                <div>
                    <input 
                        type="text" 
                        placeholder="Enter Username"
                        onChange={getValue}
                        value={text}
                        
                    />
                    <p>{btnClick}</p>
                </div>

                
                

                <br />

                {/* <div>
                    <input 
                        type="password" 
                        placeholder="Enter Password" 
                    />
                </div> */}

                <br />

                <button type="submit" >Login</button>
            </form>
        </div>
    );
};

export default Login;