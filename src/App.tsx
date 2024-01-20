import { useState } from 'react'
import './App.css'
import og_object from './types/og_object';
import Recipe from './components/Recipe';

// the og_object type refers to open graph protocol
// TODO: delete recipes(check) and delete full list then some styling, possible bugfixing and testing then it's done

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
  const [currentRecipe,setCurrentRecipe] = useState<og_object|null>(null);
  const [addRecipeInput, setAddRecipeInput] = useState<string>('');
  const [previousNumber,setPreviousNumber] = useState<number|null>(null);

  const deleteItem = (item:og_object) => {
    setRecipes(recipes.filter(e => item!==e));
  } 

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
      if (currentRecipe === null) {
        return <div>Add recipes to list and press random</div>;
      }

      if (isNotOGP(currentRecipe)) {
        return (
          <Recipe ogp={false} deleteItem={deleteItem} data={currentRecipe}/>
        );
      } else {
        return (
          <Recipe ogp={true} deleteItem={deleteItem} data={currentRecipe}/>
        );
      }
  };

  const renderRandomButton = () => {
    return (
      <button style={{margin:"1em auto"}} onClick={randomRecipe}>random</button>
    )
  }
  
  return (
    <>
      <div style={{minHeight:"15em"}}>
        {recipes&&renderCurrentRecipe()}
      </div>
      <br/>
        {recipes&&recipes.length>1&&renderRandomButton()}
      <br/>
      <br/>
      <br/>
      <div style={{display:"flex", margin:"0 auto", width:"70%"}}>
        <input style={{display:"inline",width:"30em"}} type='text' placeholder='paste url of recipe here..' value={addRecipeInput} onChange={addRecipeChange}></input>
        <button style={{display:"inline", width:"9em"}} onClick={addRecipe}>add url to list</button>
      </div>
      <br/>
      {recipes&&recipes.length>0&&recipes.map((e:og_object,n) => {
        if(isNotOGP(e)) {
          console.log('no ogp');
          return (<div key={n}>
            <Recipe ogp={false} deleteItem={deleteItem} data={e}/>
          </div>)
        }else{
          return (
            <div key={n}>
              <Recipe ogp={true} deleteItem={deleteItem} data={e}/>
            </div>
          )
        }
      })}
    </>
  )
}

export default App
