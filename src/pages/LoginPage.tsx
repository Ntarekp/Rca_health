import { useState } from 'react'
import './LoginPage.css'

interface LoginPageProps {
  onLogin: () => void
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onLogin()
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-content">
          {/* Left side - Image */}
          <div className="login-image-container">
            <div className="login-image">
              {/* Image placeholder - replace with actual image from Figma */}
              <div className="image-placeholder" />
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="login-form-container">
            <div className="login-form">
              {/* Header */}
              <div className="login-header">
                <div className="login-title-container">
                  <h1 className="login-title">RCA STOCK MANAGEMENT SYSTEM</h1>
                </div>
                <div className="login-subtitle-container">
                  <p className="login-subtitle">Log into your Account</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="login-fields">
                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="form-field">
                    <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="form-field">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label="Toggle password visibility"
                    >
                      {/* Eye icon placeholder */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="form-options">
                    <div className="remember-me">
                      <input
                        type="checkbox"
                        id="remember"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="checkbox"
                      />
                      <label htmlFor="remember" className="checkbox-label">
                        Remember me
                      </label>
                    </div>
                    <div className="forgot-password">
                      <a href="#" className="forgot-link">Forgot Password</a>
                    </div>
                  </div>

                  {/* Login Button */}
                  <button type="submit" className="login-button">
                    <span>Login</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

