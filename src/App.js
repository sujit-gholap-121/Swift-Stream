import {Switch, Route} from 'react-router-dom'
import './App.css'
import Login from './components/Login'
import Home from './components/Home'
import Popular from './components/Popular'
import MovieDetails from './components/MovieDetails'
import NotFound from './components/NotFound'
import Account from './components/Account'
import ProtectedRoute from './components/ProtectedRoute'
import SearchFilter from './components/SearchRoute'

const App = () => (
  <Switch>
    <Route exact path="/login" component={Login} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/popular" component={Popular} />
    <ProtectedRoute exact path="/movies/:movieId" component={MovieDetails} />
    <ProtectedRoute exact path="/search" component={SearchFilter} />
    <ProtectedRoute exact path="/account" component={Account} />
    <Route component={NotFound} />
  </Switch>
)

export default App
