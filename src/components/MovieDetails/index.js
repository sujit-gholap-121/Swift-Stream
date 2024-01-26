import {format} from 'date-fns'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {Component} from 'react'
import {FaGoogle, FaTwitter, FaInstagram, FaYoutube} from 'react-icons/fa'
import Cookies from 'js-cookie'
import './index.css'
import Header from '../Header'
import Footer from '../Footer'

const SimilarCard = props => {
  const {ele, redirectMovie} = props
  const updateMovie = () => {
    redirectMovie(ele.id)
  }
  return (
    <li className="li3">
      {/* <Link to={`/movies-app/movies/${ele.id}`}> */}
      <button
        className="btn1"
        type="button"
        onClick={updateMovie}
        value={ele.id}
      >
        <img
          className="similar-img"
          src={ele.backdrop_path}
          alt={ele.title}
          value={ele.id}
        />
      </button>
      {/* </Link> */}
    </li>
  )
}

class MovieDetails extends Component {
  state = {status: 'loading', details: {}}

  componentDidMount() {
    const {match} = this.props
    const {params} = match
    const {movieId} = params
    console.log(movieId)
    this.getMovie(movieId)
  }

  getMovie = async movieId => {
    const jwtToken = Cookies.get('jwt_token')

    // console.log(params)
    const url = `https://apis.ccbp.in/movies-app/movies/${movieId}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const result = await response.json()
    const result1 = result.movie_details
    console.log(response)
    if (response.ok) {
      const details = {
        adult: result1.adult,
        backdropPath: result1.backdrop_path,
        budget: result1.budget,
        genres: result1.genres,
        id: result1.id,
        overview: result1.overview,
        posterPath: result1.poster_path,
        releaseDate: result1.release_date,
        runtime: result1.runtime,
        similarMovies: result1.similar_movies,
        spokenLanguages: result1.spoken_languages,
        title: result1.title,
        voteAverage: result1.vote_average,
        voteCount: result1.vote_count,
      }
      this.setState({
        status: 'success',
        details,
      })
    } else {
      this.setState({
        status: 'failed',
      })
    }
  }

  redirectMovie = id => {
    const {history} = this.props
    history.push(`/movies-app/movies/${id}`)
    this.getMovie(id)
  }

  render() {
    const {status, details} = this.state
    console.log(details)
    const {genres, similarMovies} = details
    const bgImage = {
      backgroundImage: `url(${details.backdropPath})`,

      backgroundSize: 'cover',
    }
    if (status === 'loading') {
      return (
        <div className="loader-container" testid="loader">
          <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
        </div>
      )
    }
    return (
      <div className="Movie-details">
        <div className="movie-body">
          <div className="movie-thumb" style={bgImage}>
            <Header />
            <div className="movie-poster">
              <h1>Avengers</h1>
              <ul className="movie-poster-details">
                <p className="para4">{`${parseInt(details.runtime / 60)}h ${
                  details.runtime % 60
                }m`}</p>
                <p className="para4">{details.adult ? 'A' : 'U/A'}</p>
                <p className="para4">
                  {format(new Date(details.releaseDate), 'yyyy')}
                </p>
              </ul>
              <p className="para4">{details.overview}</p>
              <button type="button" className="play-btn">
                Play
              </button>
            </div>
          </div>
          <div className="movie-rating-details">
            <div>
              <h1 className="head3">Genre</h1>
              <ul>
                {details.genres.map(ele => (
                  <li key={ele.id}>{ele.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h1 className="head3">Audio Available</h1>
              <ul>
                {details.spokenLanguages.map(ele => (
                  <li key={ele.id}>{ele.english_name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h1 className="head3">Rating Count</h1>
              <p>{details.voteCount}</p>
              <h1 className="head3">Rating Average</h1>
              <p>{parseFloat(details.voteAverage) / 2}</p>
            </div>
            <div>
              <h1 className="head3">Budget</h1>
              <p>{details.budget}</p>
              <h1 className="head3">Release Date</h1>
              <p>{format(new Date(details.releaseDate), 'do MMMM yyyy')}</p>
            </div>
          </div>
          <div className="similar-movies">
            <h1>More like this</h1>
            <ul className="similar-list-box">
              {similarMovies.map(ele => (
                <SimilarCard
                  key={ele.id}
                  ele={ele}
                  redirectMovie={this.redirectMovie}
                />
              ))}
            </ul>
          </div>
        </div>
        <Footer />
        <p>Contact us</p>
      </div>
    )
  }
}
export default MovieDetails
