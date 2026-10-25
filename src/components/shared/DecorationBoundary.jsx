import { Component } from 'react'

export default class DecorationBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    console.warn('A decorative animation could not load. Portfolio content remains available.')
  }
  render() {
    return this.state.failed ? this.props.fallback || null : this.props.children
  }
}
