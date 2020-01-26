import React from 'react'
import { Form, Checkbox } from 'semantic-ui-react';
import { ChildSingleInput } from '../Form/SingleInput.jsx'

export default class TalentStatus extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.componentData ? props.componentData :
                {
                    status: '',
                    availableDate: ''
                }
        }
        this.handleDateChange = this.handleDateChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.save = this.save.bind(this);
    }

    handleStatusChange(e,{value}){
        let data = Object.assign({}, this.state.data);
        data['status'] = value;
        this.setState({ data: data });
    }

    handleDateChange(e) {
        let data = Object.assign({}, this.state.data);
        data[e.target.name] = e.target.value;
        this.setState({ data: data });
    }

    save() {
        let data = {};
        data[this.props.componentId] = Object.assign({}, this.state.data);
        this.props.saveProfileData(data);
        this.closeEditSection();
    }

    componentDidUpdate(preProps) {
        if (preProps.componentData !== this.props.componentData) {
            this.setState({ data: this.props.componentData });
        }
    }

    render() {
        return (
            <div className="row">
                <div className="fourteen wide column">
                    <div className="two fields">
                        <div className="field">
                            <div className="field">
                                <label>Current Status</label>
                            </div>
                            <div className="field">
                                <Checkbox
                                    radio
                                    label='Activly looking for a job'
                                    name='status'
                                    value='Activly looking for a job'
                                    checked={this.state.data.status === 'Activly looking for a job'}
                                    onChange={this.handleStatusChange}
                                />
                            </div>
                            <div className="field">
                                <Checkbox
                                    radio
                                    label='Not looking for a job at the moment'
                                    name='status'
                                    value='Not looking for a job at the moment'
                                    checked={this.state.data.status === 'Not looking for a job at the moment'}
                                    onChange={this.handleStatusChange}
                                />
                            </div>
                            <div className="field">
                                <Checkbox
                                    radio
                                    label='Currently employed but open to offers'
                                    name='status'
                                    value='Currently employed but open to offers'
                                    checked={this.state.data.status === 'Currently employed but open to offers'}
                                    onChange={this.handleStatusChange}
                                />
                            </div>
                            <div className="field">
                                <Checkbox
                                    radio
                                    label='Will be available on later date'
                                    name='status'
                                    value='Will be available on later date'
                                    checked={this.state.data.status === 'Will be available on later date'}
                                    onChange={this.handleStatusChange}
                                />
                            </div>
                        </div>
                        <div className="field">
                            <ChildSingleInput
                                inputType="text"
                                label="Available Date"
                                name="availableDate"
                                value={this.state.data.availableDate}
                                controlFunc={this.handleDateChange}
                                maxLength={10}
                                placeholder="Format: Day/Month/Year"
                                errorMessage="Please enter a valid date."
                            />
                        </div>
                    </div>
                </div>
                <div className="two wide column middle aligned">
                    <input type="button" className="ui teal right floated button" onClick={this.save} value="Save"></input>
                </div>
            </div>
        )
    }
}