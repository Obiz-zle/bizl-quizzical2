
import { useState, useEffect } from 'react'
import he from 'he';
import { nanoid } from "nanoid";
import './App.css'
import Questions from './components/Questions';
import IntroPage from './components/IntroPage';



function App() {

  const [quizQuestions, setQuizQuestions] = useState(JSON.parse(localStorage.getItem('myData'))||{});
  const [quizNotStarted, setQuizNotStarted] = useState(true);


  useEffect(()=>{
   const OpentdbAPI = "https://opentdb.com/api.php?amount=5&difficulty=easy";
   fetch(OpentdbAPI)
   .then(res => res.json())
   .then(data => {setQuizQuestions(data);  localStorage.setItem('myData', JSON.stringify(data));})

  },[]);




function startQuiz(){
    setQuizNotStarted(false);
}



const allQuestions = function() {
  return(
  <>
      <Questions key={nanoid()}
                 questions={quizQuestions.results}
                
      />

  </>
  );
}





  return (
    <>
          <main className='container'>



              <div className='blob1'></div>
              <div className='blob2'></div>


              <IntroPage  startQuiz={startQuiz}/>
               
              {
              !quizNotStarted &&
              <>
                {allQuestions()}
              </>
              }



          </main>
    </>
  )
}

export default App;
