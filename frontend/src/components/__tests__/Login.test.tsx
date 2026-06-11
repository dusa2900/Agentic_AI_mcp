import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Login from '../Login'
import { AuthProvider } from '../../AuthContext'

describe('Login Component', () => {
  it('renders login form by default', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    )
    expect(screen.getByText('Login')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('toggles to signup form', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    )
    const toggleButton = screen.getByText(/Need an account\? Sign up/i)
    fireEvent.click(toggleButton)
    expect(screen.getByText('Sign Up')).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()
  })

  it('displays email and password inputs', () => {
    render(
      <AuthProvider>
        <Login />
      </AuthProvider>
    )
    const emailInput = screen.getByLabelText('Email')
    const passwordInput = screen.getByLabelText('Password')
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})
