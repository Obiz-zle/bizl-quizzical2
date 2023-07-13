

import { useState } from "react";



function IntroPage(props){
    const[startQuiz, setStartQuiz] = useState(false);

    function clickStart(){
        props.startQuiz();
        setStartQuiz(true);

    }


    return(

        
        <div id="intro">
            {(!startQuiz) &&
            <>
                
                <h1>Qu!zz!cal</h1>
                <h4>Answer these damn questions!!!</h4>
                <button onClick={clickStart}>Start Quiz</button>
            </>
            }
        </div>
        
    );
}


export default IntroPage;