import { Component } from 'react'
export default class AssistantBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    /* Keep the portfolio usable if a lazy chat chunk fails. */
  }
  render() {
    return this.state.failed ? (
      <div className="assistant-loading" role="status">
        The assistant could not load. <a href="#contact">Contact Ali</a>
        <button type="button" onClick={this.props.onClose}>
          Dismiss
        </button>
      </div>
    ) : (
      this.props.children
    )
  }
}
