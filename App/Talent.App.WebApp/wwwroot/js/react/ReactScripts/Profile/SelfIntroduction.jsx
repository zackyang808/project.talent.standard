/* Self introduction section */
import React, { Component } from 'react';
import Cookies from 'js-cookie'
import { ChildSingleInput } from '../Form/SingleInput.jsx';

export default class SelfIntroduction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.componentData ? Object.assign({}, props.componentData) :
                {
                    summary: '',
                    description: ''
                }
        }

        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
    };

    componentDidUpdate(preProps) {
        if (preProps.componentData !== this.props.componentData) {
            this.setState({ data: this.props.componentData });
        }
    }

    handleChange(e) {
        let data = Object.assign({}, this.state.data);
        data[e.target.name] = e.target.value;
        this.setState({ data: data });
    }

    save() {
        this.props.saveProfileData(Object.assign({}, this.state.data));
    }

    render() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    name="summary"
                    value={this.state.data.summary}
                    controlFunc={this.handleChange}
                    maxLength={150}
                    placeholder="Please provide a short summary about yourself"
                    errorMessage="Please enter a valid LinkedIn URL."
                />
                <div className="field">
                    <label>Summary must be no more than 150 characters.</label>
                </div>
                <div className="field">
                    <textarea
                        name="description"
                        placeholder="Please tell us any hobbies, additional expertise, or anything else you'd like to add"
                        value={this.state.data.description}
                        onChange={this.handleChange}
                        maxLength={600}                   >
                    </textarea>
                </div>
                <div className="field">
                    <label>Description must be between 150-600 characters.</label>
                </div>
                <input type="button" className="ui teal button right floated" onClick={this.save} value="Save"></input>
            </div>
        )
    }
}



