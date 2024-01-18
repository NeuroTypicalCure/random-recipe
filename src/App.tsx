import { useState } from 'react'
import './App.css'

// the og_object type refers to open graph protocol
// TODO: delete recipes and delete full list then some styling, possible bugfixing and testing then it's done

function isNotOGP(o){
  return !(Object.keys(o).includes('og:title') && Object.keys(o).includes('og:description') && Object.keys(o).includes('og:site_name') && Object.keys(o).includes('og:image') && Object.keys(o).includes('og:url'))
}

function App() {
  const [recipes,setRecipes] = useState<og_object[]>([{
      'og:type': "article",
      'og:site_name': "Allrecipes",
      'og:url': "https://www.allrecipes.com/recipe/15131/creamy-shrimp-and-corn-soup/",
      'og:title': "Creamy Shrimp and Corn Soup",
      'og:description': "Using the reduced fat versions of condensed cream of chicken and celery soups keeps the calories down in this creamy rosemary flavored soup with shrimp and frozen corn.",
      'og:image': "https://www.allrecipes.com/thmb/e4oLL89vmtVFPEKc5ASymiTT5J4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2959475-a45bf98a7241486cb496149d13de5249.jpg"
    }
  ]);
  const [currentRecipe,setCurrentRecipe] = useState<og_object>(null);
  const [addRecipeInput, setAddRecipeInput] = useState<string>('');
  const [previousNumber,setPreviousNumber] = useState<number>(null);

  const randomRecipe = () => {
    const r = getRandomNumberWithoutRepetition(0,(recipes.length-1));
    setCurrentRecipe(recipes[r]);
  }

  function getRandomNumberWithoutRepetition(min:number, max:number) {
    let randomNumber;
    console.log('previous:',previousNumber);
    do {
      randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      console.log('inside:', randomNumber);
    } while (randomNumber === previousNumber);
    setPreviousNumber(randomNumber);
    return randomNumber;
  }

  const addRecipeChange = (e) => {
    setAddRecipeInput(e.target.value);
  }

  const addRecipe = () => {
    const http = new XMLHttpRequest()
    console.log('input:',addRecipeInput);
    http.open("GET", `http://localhost:3001/${addRecipeInput}`)
    http.send()
    http.onload = () => {
      console.log(http.responseText)
      let result = JSON.parse(http.responseText);
      if(isNotOGP(result)) result = {'og:url':addRecipeInput};
      setRecipes((prev) => (prev.length === 0 ? [result] : [...prev, result]));
    }
  }

  const renderCurrentRecipe = () => {
    if (currentRecipe && Object.entries(currentRecipe).length === 1) {
      return (
        <div className='card'>
          <div className='content'>
            <a href={currentRecipe['og:url']}><h4 className='title'>{currentRecipe['og:url']}</h4></a>
          </div>
        </div>
      );
    } else if (currentRecipe) {
        return (
          <div className='card'>
            <span>{currentRecipe['og:site_name']}</span>
            <img src={currentRecipe['og:image']} alt={currentRecipe['og:title']} />
            <div className='content'>
              <a href={currentRecipe['og:url']}><h4 className='title'>{currentRecipe['og:title']}</h4></a>
              <p className='description'>{currentRecipe['og:description']}</p>
            </div>
          </div>
        );
    } else {
      return <div>Add recipes to list and press random</div>;
    }
  };
  
  return (
    <>
      <div style={{minHeight:"15em"}}>
        {renderCurrentRecipe()}
      </div>
      <br/>
      <button style={{margin:"1em auto"}} onClick={randomRecipe}>random</button>
      <br/>
      <br/>
      <br/>
      <div style={{display:"flex", margin:"0 auto", width:"70%"}}>
        <input style={{display:"inline",width:"30em"}} type='text' placeholder='paste url of recipe here..' value={addRecipeInput} onChange={addRecipeChange}></input>
        <button style={{display:"inline", width:"9em"}} onClick={addRecipe}>add url to list</button>
      </div>
      <br/>
      {recipes.map((e:og_object,n) => {
        if(isNotOGP(e)) {
          console.log('no ogp');
          return (<div key={n}>
            <div className='card'>
              <div className='content'>
                <a href={e['og:url']}><h4 className='title'>{e['og:url']}</h4></a>
              </div>
            </div>
          </div>)
        }else{
          return (<div key={n}>
            <div className='card'>
              <span>{e['og:site_name']}</span>
              <img src={e['og:image']}/>
              <div className='content'>
                <a href={e['og:url']}><h4 className='title'>{e['og:title']}</h4></a>
                <p className='description'>{e['og:description']}</p>
              </div>
            </div>
          </div>)
        }
      })}
    </>
  )
}

type og_object = {
  'og:title': string;
  'og:type': string;
  'og:image': string;
  'og:url': string;
  'og:description'?: string;
  'og:site_name'?: string;
  'og:determiner'?: string;
  'og:locale'?: string;
  'og:article_published_time'?: string; // ISO 8601 format
  'og:article_modified_time'?: string; // ISO 8601 format
  'og:article_author'?: string;
  'og:video'?: string;
  'og:video_secure_url'?: string;
  'og:video_type'?: string;
  'og:video_width'?: number;
  'og:video_height'?: number;
  'og:audio'?: string;
  'og:audio_secure_url'?: string;
  'og:audio_type'?: string;
  'og:app_id'?: string;
};


export default App
