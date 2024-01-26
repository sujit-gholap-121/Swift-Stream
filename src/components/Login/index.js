import {Redirect, Route} from 'react-router-dom'
import {Component} from 'react'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {name: '', pass: '', errorStatus: false, errorMsg: ''}

  afterSubmit = async e => {
    const {name, pass} = this.state
    e.preventDefault()
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify({username: name, password: pass}),
    }
    const response = await fetch(url, options)
    const result = await response.json()
    if (response.ok) {
      this.onSuccess(result.jwt_token)
    } else {
      this.onFailure(result.error_msg)
    }
  }

  onSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 2})
    const {history} = this.props
    history.replace('/')
    const {name, pass} = this.state
    localStorage.setItem('username', name)
    localStorage.setItem('password', pass)
  }

  onFailure = msg => {
    this.setState({errorStatus: true, errorMsg: msg})
  }

  updateUsername = e => this.setState({name: e.target.value})

  updatePassword = e => this.setState({pass: e.target.value})

  render() {
    const {name, pass, errorStatus, errorMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Route component={() => <Redirect to="/" />} />
    }
    return (
      <div className="bg">
        <div className="Navbar">
          <img
            className="logo-img"
            alt="login website"
            src="https://res.cloudinary.com/dwqgzsu1f/image/upload/v1705949836/Netflix%20Clone/Group_7399website-logo_hsjjca.png"
          />
        </div>
        <div className="login-body">
          <div className="login-card">
            <h1 className="login-head">Login</h1>
            <form className="login-form" onSubmit={this.afterSubmit}>
              <div>
                <label className="login-label" htmlFor="username">
                  USERNAME
                </label>
                <br />
                <input
                  placeholder="Username"
                  className="login-input"
                  id="username"
                  value={name}
                  onChange={this.updateUsername}
                />
              </div>

              <div>
                <label className="login-label" htmlFor="password">
                  PASSWORD
                </label>
                <br />
                <input
                  type="password"
                  placeholder="Password"
                  className="login-input"
                  id="password"
                  value={pass}
                  onChange={this.updatePassword}
                />
              </div>
              {errorStatus && <p className="error-para">{errorMsg}</p>}
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
