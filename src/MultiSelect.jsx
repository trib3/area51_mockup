import Select from 'react-select';
import React from 'react';

import 'react-select/dist/react-select.css';


export default class MultiSelect extends React.Component {
  constructor() {
      super();

      this.state = {
        value: []
      }
  }

  handleSelectChange (value) {
		console.log('CHILD You\'ve selected:', value);
		this.setState({ value });
		this.props.updateBrands(value.split(','))
	}

  render () {
		return (
			<div className="section">
				<h3 className="section-heading">{this.props.label}</h3>
				<Select multi simpleValue
					value={this.state.value}
					placeholder={"choose " + this.props.label + "s ..."}
					options={this.props.options}
					onChange={this.handleSelectChange.bind(this)} />
			</div>
		);
	}

}

MultiSelect.propTypes = {
	updateBrands: React.PropTypes.func,
};
