import { useState, useEffect } from 'react';
import he from 'he';
import { nanoid } from "nanoid";
import { Fireworks } from 'fireworks-js';
import Confetti from "react-confetti"

function Questions(props) {

    const [questionsArray, setQuestionsArray] = useState(props.questions);
    const [allQuestionsDetails, setAllQuestionsDetails] = useState(extractQuestionsDetails());
    const [triggerCheck, setTriggrCheck] = useState(false);
    const [totalAnsweredQuestions, setTotalAsweredQuestions] = useState(0);
    const [totalCorrectAnswers, setTotalCorrectAnswers] = useState(0);
    

    const clickSelect = {backgroundColor:`#20232f`, border:`none`};
    const unClickSelect = {backgroundColor:``, border:``};
    const failed = {backgroundColor:`#4c2222`, border:`none`};
    const passed = {backgroundColor:`#225126`, border:`none`};




    //console.log("Something caused a re-render");
    //console.log(allQuestionsDetails);
    //console.log(totalAnsweredQuestions);



    function extractQuestionsDetails(){
        const questBlock = [];//object array


        for(let i = 0; i < questionsArray.length; i++){
            
            const decodedQuestion = he.decode(questionsArray[i].question);
            const decodedAnswer = he.decode(questionsArray[i].correct_answer);
            const decodedWrongAnswers = questionsArray[i].incorrect_answers.map(options =>  he.decode(options));
        
            // inserting the answer at a random index...
            let randomIndex = Math.floor(Math.random() * (decodedWrongAnswers.length + 1));
            const allOptions = [...decodedWrongAnswers];
            allOptions.splice(randomIndex, 0, decodedAnswer);


            const trackedOptions = allOptions.map(option => {
                return(
                        {  
                            optionValue: option, 
                            optionIndex: allOptions.indexOf(option)
                        }
                    );
            })


            questBlock.push(
                {   
                    id: nanoid(),
                    quest: decodedQuestion,
                    answer: decodedAnswer,
                    opts: trackedOptions,//object array
                    answerIndex: randomIndex,
                    selectedIndex: null
                    

                    
                }
            );

        }
        return questBlock;
    }



    function clickOption(event){
    
        const selectedOptionIndex = Number(event.target.getAttribute("index"));//current option index
        const selectedOptionId = event.target.getAttribute("i_d");
        const indexOfSelectedOption = event.target.getAttribute("option_select");
        const indexOfCorrectAnswer = event.target.getAttribute("answer_index");



        //console.log(`${selectedOptionIndex}  ${selectedOptionId}`);


        const tempQuest = [...allQuestionsDetails];


        for(let i = 0; i < tempQuest.length; i++){
            if(tempQuest[i].id == selectedOptionId){
                tempQuest[i] = {...tempQuest[i], selectedIndex:selectedOptionIndex, pass:indexOfCorrectAnswer == selectedOptionIndex? "Yes" : "No"}
            }
            else{
                tempQuest[i] = {...tempQuest[i]}
            }
        }
        
        
        if(indexOfSelectedOption === null){
            setTotalAsweredQuestions(prevNumber => prevNumber + 1);
           
        }
       
        

        setAllQuestionsDetails(tempQuest);
        setTotalCorrectAnswers(0);

     
    }


    
    useEffect(() => {
        
        if(totalAnsweredQuestions == allQuestionsDetails.length){//only count correct answers when total number of questions is complete
            for(let i = 0; i < allQuestionsDetails.length; i++){
                if(allQuestionsDetails[i].pass && allQuestionsDetails[i].pass === "Yes"){
                   setTotalCorrectAnswers(prev => prev + 1);
                    
                }
            }
        }
    },[allQuestionsDetails]);






    function checkAnswers(){
    
        setTriggrCheck(true);
       
        
    }

    function playAgain(){
        
        window.location.reload();

    }


    
   
  


    const questOptAns = allQuestionsDetails.map(data => {


        const arrayOptions = data.opts.map(base =>  {
            return(
            <div 
                key={nanoid()}
                i_d={data.id}
                index={base.optionIndex}
                option_select={data.selectedIndex}
                answer_index={data.answerIndex}
                style={(data.selectedIndex === base.optionIndex && data.selectedIndex != null)? clickSelect: unClickSelect}
                className='options'
                onClick={clickOption} >
            {base.optionValue}
            </div>
            );
            });
        
        
        const arrayAnswers = data.opts.map(base =>  {
            let styler = {};
            if(base.optionIndex == data.selectedIndex && base.optionIndex != data.answerIndex){
                styler = failed;
            }
            if(base.optionIndex == data.answerIndex){
                styler = passed;
               
            }
            return( 
            <div 
                key={nanoid()}
                index={base.optionIndex}
                style={styler}
                className='options options-marked'>
            {base.optionValue}
            </div>);
            
             } );




    return(
            <div key={nanoid()}
                 className='question-block' >

                {!triggerCheck &&    
                <>
                <div className='question'>{data.quest}</div>
                <div className='option-block'>{arrayOptions}</div>
                <hr />
                </>
                }
                {triggerCheck &&
                <>
                <div className='question question-marked'>{data.quest}</div>
                <div className='option-block'>{arrayAnswers}</div>
                <hr />
                </>
                }

            </div>
    );});








    






    return(
        < >
    
            {questOptAns}
            {(!triggerCheck && totalAnsweredQuestions == allQuestionsDetails.length) &&
            <>
                <div>
                    <button className='check-answers' onClick={checkAnswers}>Check Answers</button>
                </div>
            </>
            }

            
            {triggerCheck &&
            <>
            {(totalCorrectAnswers == allQuestionsDetails.length) && <Confetti />}
            <div className='results'>

                <h5>You scored {totalCorrectAnswers}/{allQuestionsDetails.length} correct answers {`${(totalCorrectAnswers == allQuestionsDetails.length)? "!!!!!" : ""}`}</h5>
                <button className='check-answers play-again' onClick={playAgain}>Play Again</button>

            </div>
            </>
            }
            

    
    
        </>
    );
}


export default Questions;