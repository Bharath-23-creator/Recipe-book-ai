import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { API_URL } from '../api'
import '../styles/saved.css'

function SavedRecipes() {
  const [savedRecipes, setSavedRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadRecipes = async () => {
      const token = localStorage.getItem('token')

      try {
        const response = await fetch(`${API_URL}/recipes/`, {
          headers: { Authorization: `Token ${token}` },
        })
        const data = await response.json()

        if (response.ok) {
          setSavedRecipes(data)
        } else {
          setError('Could not load recipes')
        }
      } catch (err) {
        setError('Cannot connect to the server')
      }

      setLoading(false)
    }

    loadRecipes()
  }, [])

  const deleteRecipe = async (id) => {
    const token = localStorage.getItem('token')

    try {
      const response = await fetch(`${API_URL}/recipes/${id}/`, {
        method: 'DELETE',
        headers: { Authorization: `Token ${token}` },
      })

      if (response.ok) {
        setSavedRecipes(savedRecipes.filter((r) => r.id !== id))
      } else {
        setError('Could not delete the recipe')
      }
    } catch (err) {
      setError('Cannot connect to the server')
    }
  }

  return (
    <div className="saved-page">
      <Navbar />

      <main className="saved-content">
        <h3>Saved Recipes</h3>

        {error && <p className="error-msg">{error}</p>}
        {loading && <p className="saved-empty">Loading...</p>}

        {!loading && savedRecipes.length === 0 && (
          <p className="saved-empty">You have not saved any recipes yet</p>
        )}

        <div className="saved-grid">
          {savedRecipes.map((recipe) => (
            <div className="saved-card" key={recipe.id}>
              <h4>{recipe.title}</h4>

              <p className="saved-label">Ingredients</p>
              <p>{recipe.ingredients.join(', ')}</p>

              <p className="saved-label">Steps</p>
              <ol>
                {recipe.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>

              <button
                className="delete-btn"
                onClick={() => deleteRecipe(recipe.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default SavedRecipes