import {Link} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Slider from 'react-slick'

import Loader from 'react-loader-spinner'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Header from '../Header'
import Footer from '../Footer'
import './index.css'
import FailureView from '../FailureView'

class Home extends Component {
  state = {
    thumbnail: {
      status: 'loading',
      movie: [],
    },
    trending: {
      status: 'loading',
      movies: [],
    },
    original: {
      status: 'loading',
      movies: [],
    },
  }

  componentDidMount() {
    this.getTrendingMovies()
    this.getOriginalMovies()
  }

  getTrendingMovies = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/trending-movies'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const result = await response.json()
    if (response.ok) {
      const lt = result.results.map(ele => ({
        backdropPath: ele.backdrop_path,
        id: ele.id,
        overview: ele.overview,
        posterPath: ele.poster_path,
        title: ele.title,
      }))
      this.setState({
        trending: {
          status: 'success',
          movies: [...lt],
        },
      })
    } else {
      this.setState({
        trending: {
          status: 'failed',
          movies: [],
        },
      })
    }
  }

  getOriginalMovies = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/originals'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const result = await response.json()

    if (response.ok) {
      const lt = result.results.map(ele => ({
        backdropPath: ele.backdrop_path,
        id: ele.id,
        overview: ele.overview,
        posterPath: ele.poster_path,
        title: ele.title,
      }))
      const randNum = Math.floor(Math.random() * lt.length)
      this.setState({
        original: {
          status: 'success',
          movies: [...lt],
        },
        thumbnail: {
          status: 'success',
          ...lt[randNum],
        },
      })
    } else {
      this.setState({
        original: {
          status: 'failed',
          movies: [],
        },
        thumbnail: {
          status: 'failed',
          movies: [],
        },
      })
    }
  }

  onRetryTrending = () => {
    this.getTrendingMovies()
  }

  onRetryOriginal = () => {
    this.getOriginalMovies()
  }

  render() {
    const {trending, thumbnail, original} = this.state
    const myStyle = {
      backgroundImage: `url(${thumbnail.backdropPath})`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
    }
    // console.log(trending)
    const settings = {
      dots: false,
      infinite: true,
      lazy: true,
      arrows: true,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
    }
    return (
      <div className="outer">
        <Header />
        <div className="top-thumbnail">
          {thumbnail.status === 'success' && (
            <div className="top-thumbnail" style={myStyle}>
              <div className="thumbnail-bg">
                <h1 className="heading1">{thumbnail.title}</h1>
                <h1 className="para2">{thumbnail.overview}</h1>
                <Link to={`/movies/${thumbnail.id}`}>
                  <button className="play-btn" type="button">
                    Play
                  </button>
                </Link>
              </div>
            </div>
          )}
          {thumbnail.status === 'loading' && (
            <div className="loader-container" testid="loader">
              <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
            </div>
          )}
          {thumbnail.status === 'failed' && (
            <FailureView key="trend" onRetry={this.onRetryOriginal} />
          )}
        </div>
        <div className="trending">
          <h1>Trending Now</h1>
          {trending.status === 'success' && (
            <Slider {...settings}>
              {trending.movies.map(ele => (
                <Link to={`/movies/${ele.id}`}>
                  <img
                    className="trend-img"
                    src={ele.posterPath}
                    alt={ele.title}
                  />
                </Link>
              ))}
            </Slider>
          )}
          {trending.status === 'failed' && (
            <FailureView key="trend" onRetry={this.onRetryTrending} />
          )}
          {trending.status === 'loading' && (
            <div className="loader-container" testid="loader">
              <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
            </div>
          )}
        </div>
        <div className="trending">
          <h1>Originals</h1>
          {original.status === 'success' && (
            <Slider {...settings}>
              {original.movies.map(ele => (
                <Link key={ele.id} to={`/movie/${ele.id}`}>
                  <img
                    className="trend-img"
                    src={ele.posterPath}
                    alt={ele.title}
                  />
                </Link>
              ))}
            </Slider>
          )}
          {original.status === 'failed' && (
            <FailureView key="original" onRetry={this.onRetryOriginal} />
          )}
          {original.status === 'loading' && (
            <div className="loader-container" testid="loader">
              <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
            </div>
          )}
        </div>
        <Footer />
        <p className="contact-us-footer">Contact us</p>
      </div>
    )
  }
}

export default Home
