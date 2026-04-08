import React from 'react';

const SignUp = ()=>{
    return(
        <div>
            <form>
                <h1>Sign Up</h1>
                <input
                    type="text"
                    className="signup"
                    placeholder="Enter EmailId"
                ></input>
            </form>
        </div>
        
    );
};

export default SignUp;