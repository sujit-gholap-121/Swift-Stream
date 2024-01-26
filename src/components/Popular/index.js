import {Component} from 'react'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Header from '../Header'
import './index.css'
import Footer from '../Footer'

class Popular extends Component {
  state = {status: 'loading', lt: []}

  componentDidMount() {
    this.getPopularMovies()
  }

  getPopularMovies = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/movies-app/popular-movies'
    const options = {
      method: 'GET',
      headers: {
        Authorization: `bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    const result = await response.json()
    if (response.ok) {
      //   console.log(result)
      const lt1 = result.results.map(ele => ({
        backdropPath: ele.backdrop_path,
        id: ele.id,
        overview: ele.overview,
        posterPath: ele.poster_path,
        title: ele.title,
      }))
      this.setState({status: 'success', lt: [...lt1]})
    } else {
      this.setState({
        status: 'failed',
      })
    }
  }

  render() {
    const {lt, status} = this.state
    return (
      <div className="popular-outer">
        <Header />
        <div className="list-container">
          (
          <ul className="list1">
            {status === 'success' &&
              lt.map(ele => (
                <li className="li2" key={ele.id}>
                  <Link to={`/movies/:${ele.id}`}>
                    <img
                      className="popular-img"
                      src={ele.posterPath}
                      alt={ele.title}
                    />
                  </Link>
                </li>
              ))}
            {status === 'loading' && (
              <div className="loader-container" testid="loader">
                <Loader
                  type="TailSpin"
                  color="#D81F26"
                  height={50}
                  width={50}
                />
              </div>
            )}
          </ul>
        </div>
        <Footer />
        <p className="contact-us-footer">Contact us</p>
      </div>
    )
  }
}

export default Popular
