import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Dropdown } from 'semantic-ui-react';

export default class VisaStatus extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: props.componentData ? props.componentData :
                {
                    visaStatus: '',
                    visaExpiryDate: ''
                },
            showExpiryDate: false

        }
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.save = this.save.bind(this);
    }

    handleTypeChange(e, data) {
        if (data.value === 'Citizen' || data.value === 'Permanent Resident') {
            this.setState({ showExpiryDate: false });
            this.setState({ data: Object.assign({}, this.state.data, { visaStatus: data.value, visaExpiryDate: '' }) });
        }
        else {
            this.setState({ showExpiryDate: true });
            this.setState({ data: Object.assign({}, this.state.data, { visaStatus: data.value }) });
        }
    }

    handleInputChange(e) {
        let data = Object.assign({}, this.state.data);
        data[e.target.name] = e.target.value;
        this.setState({ data: data });
    }

    save() {
        let data = Object.assign({}, this.state.data);
        this.props.saveProfileData(data);
    }

    componentDidUpdate(preProps) {
        if (preProps.componentData !== this.props.componentData) {
            if (this.props.componentData.visaStatus === 'Citizen' || this.props.componentData.visaStatus === 'Permanent Resident') {
                this.setState({ showExpiryDate: false });
            } else {
                this.setState({ showExpiryDate: true });
            }
            this.setState({ data: Object.assign({}, this.state.data, this.props.componentData) });
        }
    }

    render() {
        const visaTypeOptions = [
            { key: 'Citizen', value: 'Citizen', text: 'Citizen' },
            { key: 'Permanent Resident', value: 'Permanent Resident', text: 'Permanent Resident' },
            { key: 'Work Visa', value: 'Work Visa', text: 'Work Visa' },
            { key: 'Student Visa', value: 'Student Visa', text: 'Student Visa' }
        ];
        return (
            <div className="row">
                <div className="fourteen wide column">
                    <div className="two fields">
                        <div className="field">
                            <label>VisaType</label>
                            <Dropdown
                                placeholder='Select your visa type'
                                fluid
                                selection
                                onChange={this.handleTypeChange}
                                options={visaTypeOptions}
                                value={this.state.data.visaStatus}
                            />
                        </div>
                        <div className="field">
                            {this.state.showExpiryDate ?
                                <ChildSingleInput
                                    inputType="text"
                                    label="Visa expiry date"
                                    name="visaExpiryDate"
                                    value={this.state.data.visaExpiryDate}
                                    controlFunc={this.handleInputChange}
                                    maxLength={10}
                                    placeholder="Format: Day/Month/Year"
                                    errorMessage="Please enter a valid date."
                                /> : ''
                            }
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