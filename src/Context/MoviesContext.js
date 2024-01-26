import {createContext} from 'react'

const MoviesContext = createContext({
  avatar: '',
  updateSearchMovie: () => {},
})

export default MoviesContext
