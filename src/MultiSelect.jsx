'use strict'

import Select from 'react-select';
import React from 'react';

import 'react-select/dist/react-select.css';


export default class MultiSelect extends React.Component {
  constructor(props) {
      super(props);

      this.state = {
          value: '',
          options: []
      };
  }

  handleSelectChange(value) {
      console.log('value', value)
      this.setState({ value });
      this.props.update(value)
  }

  componentDidMount() {
        fetch(`http://localhost:3000/api/options?dim=${this.props.label}`)
          .then(response => {
              return response.json()
          }).then(json => {
            this.setState({'options': json});
        }).catch(error => {
            console.log('boom: ' + error.message);
        });
    }


  render () {
		return (
			<div className="section">
				<h3 className="section-heading">{this.props.label}</h3>
				<Select
                    multi={true}
					value={this.state.value}
					placeholder={'All ' + this.props.label}
					options={this.state.options}
					onChange={this.handleSelectChange.bind(this)}
                />
			</div>
		);
  }

}

MultiSelect.propTypes = {
	updateBrands: React.PropTypes.func,
};
