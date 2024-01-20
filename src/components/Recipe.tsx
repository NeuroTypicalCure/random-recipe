import './Recipe.css';

function Recipe(props){

  const renderRecipe = () => {
    return (
      <div className='card'>
        <span>{props.data['og:site_name']}</span>
        <button id='delete' onClick={()=>{props.deleteItem(props.data)}}>delete</button>
        <img src={props.data['og:image']} alt={props.data['og:title']} />
        <div className='content'>
          <a href={props.data['og:url']}><h4 className='title'>{props.data['og:title']}</h4></a>
          <p className='description'>{props.data['og:description']}</p>
        </div>
      </div>
    )
  }

  const renderUrl = () => {
    return (
      <div className='card'>
        <button id='delete' onClick={()=>{props.deleteItem(props.data)}}>delete</button>
        <div className='content'>
          <a href={props.data['og:url']}><h4 className='title'>{props.data['og:url']}</h4></a>
        </div>
      </div>
    )
  }

  return (
    <>
      {props.ogp?renderRecipe():renderUrl()}
    </>
  );
}

export default Recipe