import { useState } from 'react'
import { Clock, Users, Heart, ChevronRight, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const RecipeCard = ({ recipe, onClick, userIngredients = [] }) => {
  const [isFavorite, setIsFavorite] = useState(() => {
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    return favorites.some(fav => fav.id === recipe.id)
  })

  const toggleFavorite = (e) => {
    e.stopPropagation()
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]')
    
    if (isFavorite) {
      const newFavorites = favorites.filter(fav => fav.id !== recipe.id)
      localStorage.setItem('favorites', JSON.stringify(newFavorites))
      setIsFavorite(false)
      toast.success('Removed from favorites')
    } else {
      favorites.push({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        matchPercentage: recipe.matchPercentage
      })
      localStorage.setItem('favorites', JSON.stringify(favorites))
      setIsFavorite(true)
      toast.success('Added to favorites!')
    }
  }

  // Updated match colors using green palette
  const matchColor = recipe.matchPercentage >= 80 ? 'bg-[#5E936C]' 
    : recipe.matchPercentage >= 60 ? 'bg-[#93DA97]' 
    : 'bg-[#E8FFD7] text-gray-800'

  return (
    <div 
      className="recipe-card cursor-pointer group bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = `https://source.unsplash.com/featured/312x231/?food,${recipe.title.split(' ')[0]}`
          }}
        />
        
        {/* Match Badge */}
        <div className={`absolute top-4 right-4 ${matchColor} px-3 py-1 rounded-full font-bold text-sm shadow-lg border border-white/20 backdrop-blur-sm`}>
          {recipe.matchPercentage}% Match
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-4 left-4 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart 
            size={20} 
            className={isFavorite ? "fill-[#3E5F44] text-[#3E5F44]" : "text-gray-600"} 
          />
        </button>
        
        {/* Quick Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock size={16} />
                <span className="text-sm font-medium">{recipe.readyInMinutes} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span className="text-sm font-medium">{recipe.servings} servings</span>
              </div>
            </div>
            {recipe.veryPopular && (
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">Popular</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-[#3E5F44] dark:group-hover:text-[#5E936C] transition-colors">
          {recipe.title}
        </h3>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.cheap && (
            <span className="px-2 py-1 bg-[#E8FFD7] text-[#3E5F44] text-xs rounded-full border border-[#93DA97]/30">
              Budget
            </span>
          )}
          {recipe.vegetarian && (
            <span className="px-2 py-1 bg-[#E8FFD7] text-[#3E5F44] text-xs rounded-full border border-[#93DA97]/30">
              Vegetarian
            </span>
          )}
          {recipe.vegan && (
            <span className="px-2 py-1 bg-[#E8FFD7] text-[#3E5F44] text-xs rounded-full border border-[#93DA97]/30">
              Vegan
            </span>
          )}
          {recipe.glutenFree && (
            <span className="px-2 py-1 bg-[#E8FFD7] text-[#3E5F44] text-xs rounded-full border border-[#93DA97]/30">
              Gluten-Free
            </span>
          )}
          {recipe.veryHealthy && (
            <span className="px-2 py-1 bg-[#E8FFD7] text-[#3E5F44] text-xs rounded-full border border-[#93DA97]/30">
              Healthy
            </span>
          )}
        </div>

        {/* Match Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>Ingredient match</span>
            <span className="font-bold">{recipe.matchPercentage}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                recipe.matchPercentage >= 80 ? 'bg-[#5E936C]' 
                : recipe.matchPercentage >= 60 ? 'bg-[#93DA97]' 
                : 'bg-[#E8FFD7]'
              }`}
              style={{ width: `${Math.min(recipe.matchPercentage, 100)}%` }}
            ></div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-between">
          <button className="text-[#3E5F44] dark:text-[#5E936C] hover:text-[#5E936C] dark:hover:text-[#93DA97] font-medium flex items-center gap-1 group">
            View Recipe
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {userIngredients.length > 0 && (
              <span>{Math.min(recipe.matchPercentage, 100)}% of your ingredients</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeCard