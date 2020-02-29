import React, { Component } from 'react';
import axios from 'axios';

class Fib extends Component {
  state = {
    seenIndexes: [],
    values: {},
    index: ''
  }
  
  componentDidMount() {
    this.fetchValues();
    this.fetchIndexes();
  }
  
  async fetchValues() {
    const values = await axios.get('/api/values/current');
    this.setState({ values: values.data });
  }

  async fetchIndexes () {
    const seenIndexes = await axios.get('/api/values/all');
    this.setState({ seenIndexes: seenIndexes.data });
  }

  renderSeenIndexes() {
    return this.state.seenIndexes.map(({ number }) => number).sort((x, y) => x - y).join(', ');
  }

  renderValues() {
    const entries = [];

    for (let key in this.state.values) {
      entries.push(
        <tr key={key}>
          <td>{key}</td>
          <td>{this.state.values[key]}</td>
        </tr>
      );
    }

    return entries;
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    await axios.post('/api/values', {index: this.state.index});
    this.setState({index: ''});
  };

  render() {
    return(
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>Enter index:</label>
          <input
            type="number"
            min="1"
            value={this.state.index}
            onChange={ event => this.setState( {index: event.target.value} ) }
          />
          <button type="submit">Submit</button>
        </form>

        <h3>Indexes already calculated:</h3>
        { this.renderSeenIndexes() }
        <h3>Calculated values:</h3>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Index</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            { this.renderValues() }
          </tbody>
        </table>
      </div>
    );
  }
};

export default Fib;