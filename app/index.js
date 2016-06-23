import React from 'react';
import ReactDOM from 'react-dom';


// require('./main.css');
// var component = require('./component');

// document.body.appendChild(component());

var uniqueId = function (prefix) {
        return prefix + Math.floor(Math.random() * 1000);
    };

var AnswerMultiChoiceQues = React.createClass({
    propTypes: {
        value: React.PropTypes.string,
        choices: React.PropTypes.array.isRequired,
        onCompleted: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return {
            id: uniqueId('multiple-choice-'),
            value: this.props.value
        }
    },
    handleChanged: function (value) {
        this.setState({value: value});
        this.props.onCompleted(value);
    },
    renderChoices: function () {
        return this.props.choices.map(function (choice, i) {
            var radioProp = {
                id: "choice-" + i,
                name: this.state.id,
                label: choice,
                value: choice,
                checked: this.state.value === choice,
                onChanged: this.handleChanged
            };

            return <AnswerRadioInput  {...radioProp} />;
        }.bind(this));
    },
    render: function () {
        return (
            <div className="form-group">
                <label className="survey-item-label" htmlFor={this.state.id}> {this.props.label} </label>
                <div className="survey-item-content">
                    {this.renderChoices()}
                </div>
            </div>
        );
    }
});

var AnswerRadioInput = React.createClass({
    propTypes: {
        id: React.PropTypes.string,
        name: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired,
        value: React.PropTypes.string.isRequired,
        checked: React.PropTypes.bool,
        onChanged: React.PropTypes.func.isRequired
    },
    getDefaultProps: function () {
        // optional props
        return {
            id: null,
            checked: false
        };
    },
    getInitialState: function () {
        var id = this.props.id ? this.props.id : uniqueId('radio-');
           return {
               id: id,
               name: id,
               checked: !!this.props.checked
           }
    },
    handleChanged: function (evt) {
        var checked = evt.target.checked;

        if (checked)
            this.props.onChanged(this.props.value)
    },
    render: function () {
        return (
            <div className="radio">
                <label htmlFor={this.state.id}>
                    <input type="radio" name={this.state.name} id={this.state.id} value={this.props.value} checked={this.props.checked} onClick={this.handleChanged}/> {this.props.label}
                </label>
            </div>
        );
    }
});

ReactDOM.render(<AnswerMultiChoiceQues label="myMultipleChoices" choices={['apple', 'banana', 'orange']} onCompleted={function () {}} value="apple"/>, document.getElementById('mybody'));    
