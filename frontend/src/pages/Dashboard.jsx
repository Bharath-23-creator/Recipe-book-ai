import { useState } from 'react'
import Navbar from '../components/Navbar'
import '../styles/Dashboard.css'
import { API_URL } from '../api'

function Dashboard() {
  const [ingredient, setIngredient] = useState('')
  const [ingredients, setIngredients] = useState([])
  const [dish, setDish] = useState('')
  const [recipe, setRecipe] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const addIngredient = (e) => {
    e.preventDefault()
    const item = ingredient.trim()
    if (item === '') return

    const alreadyAdded = ingredients.some(
      (i) => i.toLowerCase() === item.toLowerCase()
    )
    if (alreadyAdded) {
      setError('Ingredient already added')
      return
    }

    setIngredients([...ingredients, item])
    setIngredient('')
    setError('')
  }

  const removeIngredient = (name) => {
    setIngredients(ingredients.filter((i) => i !== name))
  }

  const generateRecipe = async () => {
  if (ingredients.length === 0) {
    setError('Add at least one ingredient')
    return
  }

  setError('')
  setLoading(true)
  setRecipe(null)
  setSaved(false)

  const token = localStorage.getItem('token')

  try {
    const response = await fetch(`${API_URL}/generate/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ ingredients, dish }),
    })
    const data = await response.json()

    if (response.ok) {
      setRecipe(data)
    } else {
      setError(data.error)
    }
  } catch (err) {
    setError('Cannot connect to the server')
  }

  setLoading(false)
}

  const handleSave = async () => {
  const token = localStorage.getItem('token')

  try {
    const response = await fetch(`${API_URL}/recipes/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(recipe),
    })

    if (response.ok) {
      setSaved(true)
    } else {
      setError('Could not save the recipe')
    }
  } catch (err) {
    setError('Cannot connect to the server')
  }
}

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard-content">
        <section className="panel">
          <h3>Your Ingredients</h3>

          <form className="add-row" onSubmit={addIngredient}>
            <input
              type="text"
              placeholder="Type an ingredient, e.g. chicken"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
            />
            <button type="submit">Add</button>
          </form>

          {error && <p className="error-msg">{error}</p>}

          <div className="chips">
            {ingredients.length === 0 && (
              <p className="empty">No ingredients added yet</p>
            )}
            {ingredients.map((item) => (
              <span className="chip" key={item}>
                {item}
                <button onClick={() => removeIngredient(item)}>x</button>
              </span>
            ))}
          </div>

          <input
            type="text"
            className="dish-input"
            placeholder="Dish you want (optional), e.g. biryani"
            value={dish}
            onChange={(e) => setDish(e.target.value)}
          />

          <button
            className="generate-btn"
            onClick={generateRecipe}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Recipe'}
          </button>
        </section>

        <section className="panel">
          <h3>Recipe</h3>

          {!recipe && !loading && (
            <p className="empty">Your recipe will appear here</p>
          )}
          {loading && <p className="empty">Cooking up a recipe...</p>}

          {recipe && (
            <div className="recipe">
              <h4>{recipe.title}</h4>

              <p className="label">Ingredients</p>
              <ul>
                {recipe.ingredients.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <p className="label">Steps</p>
              <ol>
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>

              <button
                className="save-btn"
                onClick={handleSave}
                disabled={saved}
              >
                {saved ? 'Saved' : 'Save Recipe'}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Dashboard