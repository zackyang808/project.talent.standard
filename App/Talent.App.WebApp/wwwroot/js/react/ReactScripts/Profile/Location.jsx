import React from 'react'
import Cookies from 'js-cookie'
import { countries, countryOptions, nationalityOptions } from '../Employer/common.js'
import { ChildSingleInput } from '../Form/SingleInput.jsx'
import { Dropdown } from 'semantic-ui-react'

export class Address extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            data: props.componentData ? props.componentData :
                {
                    number: '',
                    street: '',
                    suburb: '',
                    postCode: '',
                    city: '',
                    country: ''
                },
            showEditSection: false,
            cityOptions: []
        }
        this.renderEditSection = this.renderEditSection.bind(this);
        this.renderViewSection = this.renderViewSection.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.handleCityChange = this.handleCityChange.bind(this);
        this.loadCityOptions = this.loadCityOptions.bind(this);
        this.save = this.save.bind(this);
        this.showEditSection = this.showEditSection.bind(this);
        this.closeEditSection = this.closeEditSection.bind(this);
    }

    handleChange(e) {
        let data = Object.assign({}, this.state.data);
        data[e.target.name] = e.target.value;
        this.setState({ data: data });
    }

    handleCountryChange(e, data) {
        const country = { country: data.value };
        this.setState({ data: Object.assign({}, this.state.data, country) })
        this.loadCityOptions(data.value);
    }

    handleCityChange(e, data) {
        const city = { city: data.value };
        this.setState({ data: Object.assign({}, this.state.data, city) })
    }

    loadCityOptions(countryKey) {
        if (countryKey) {
            const selectedCountry = countryOptions.filter(c => c.value === countryKey)[0].text;
            if (countries[selectedCountry]) {
                const cityOptions = countries[selectedCountry].map(c => {
                    let option = {};
                    option["key"] = c;
                    option["value"] = c;
                    option["text"] = c;
                    return option;
                });
                if (cityOptions !== this.state.cityOptions) {
                    this.setState({ cityOptions: cityOptions });
                }
            }
            else {
                this.setState({ cityOptions: [] });
            }
        }
    }

    save() {
        let data = {};
        data[this.props.componentId] = Object.assign({}, this.state.data);
        this.props.saveProfileData(data);
        this.closeEditSection();
    }

    showEditSection() {
        this.setState({ showEditSection: true });
    }

    closeEditSection() {
        this.setState({ showEditSection: false });
    }

    componentDidMount() {
        this.loadCityOptions(this.state.data.country);
    }

    componentDidUpdate(preProps) {
        if (preProps.componentData !== this.props.componentData) {
            this.setState({ data: this.props.componentData });
            this.loadCityOptions(this.props.componentData.country);
        }
    }

    render() {
        return (this.state.showEditSection ? this.renderEditSection() : this.renderViewSection())
    }

    renderEditSection() {
        return (
            <div className='ui sixteen wide column'>
                <div className="fields">
                    <div className="two wide field">
                        <ChildSingleInput
                            inputType="text"
                            label="Number"
                            name="number"
                            value={this.state.data.number}
                            controlFunc={this.handleChange}
                            maxLength={10}
                            placeholder="Number"
                            errorMessage="Please enter a valid number."
                        />
                    </div>
                    <div className="eight wide field">
                        <ChildSingleInput
                            inputType="text"
                            label="Street"
                            name="street"
                            value={this.state.data.street}
                            controlFunc={this.handleChange}
                            maxLength={200}
                            placeholder="Enter your street name"
                            errorMessage="Please enter a valid street name."
                        />
                    </div>
                    <div className="six wide field">
                        <ChildSingleInput
                            inputType="text"
                            label="Suburb"
                            name="suburb"
                            value={this.state.data.suburb}
                            controlFunc={this.handleChange}
                            maxLength={100}
                            placeholder="Enter your suburb"
                            errorMessage="Please enter a valid suburb."
                        />
                    </div>
                </div>
                <div className="fields">
                    <div className="ten wide field">
                        <div className="two fields">
                            <div className="field">
                                <label>Country</label>
                                <Dropdown
                                    placeholder='Select your country'
                                    fluid
                                    search
                                    selection
                                    onChange={this.handleCountryChange}
                                    options={countryOptions}
                                    value={this.state.data.country}
                                />
                            </div>
                            <div className="field">
                                <label>City</label>
                                <Dropdown
                                    placeholder='Select your city'
                                    fluid
                                    search
                                    selection
                                    onChange={this.handleCityChange}
                                    options={this.state.cityOptions}
                                    value={this.state.data.city}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="six wide field">
                        <ChildSingleInput
                            inputType="text"
                            label="Post Code"
                            name="postCode"
                            value={this.state.data.postCode}
                            controlFunc={this.handleChange}
                            maxLength={10}
                            placeholder="Enter your post code"
                            errorMessage="Please enter a valid post code."
                        />
                    </div>
                </div>


                <button type="button" className="ui teal button" onClick={this.save}>Save</button>
                <button type="button" className="ui button" onClick={this.closeEditSection}>Cancel</button>
            </div>
        )
    }

    renderViewSection() {
        const fullAddress = `${this.state.data.number}, ${this.state.data.street}, ${this.state.data.suburb}, ${this.state.data.postCode}`

        return (
            <div className="ui sixteen wide column">
                <React.Fragment>
                    <p>Address: {fullAddress}</p>
                    <p>City: {this.state.data.city}</p>
                    <p>Country: {this.state.data.country ? countryOptions.filter(c => c.value === this.state.data.country)[0].text : ''}</p>
                </React.Fragment>
                <button type="button" className="ui right floated teal button" onClick={this.showEditSection}>Edit</button>
            </div>
        )
    }

}

export class Nationality extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            data: props.componentData ? props.componentData :
                {
                    nationality: ''
                }
        }
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
    }

    handleChange(e, data) {
        const nationality = { nationality: data.value };
        this.setState({ data: Object.assign({}, this.state.data, nationality) },
            this.save)
    }

    save() {
        this.props.saveProfileData(Object.assign({}, this.state.data));
    }

    componentDidUpdate(preProps) {
        if (preProps.componentData !== this.props.componentData) {
            this.setState({ data: Object.assign({}, this.state.data, this.props.componentData) });
        }
    }

    render() {
        return (
            <div className="ui sixteen wide column">
                <div className="field">
                    <label>Nationality</label>
                    <Dropdown
                        placeholder='Select your nationality'
                        fluid
                        search
                        selection
                        onChange={this.handleChange}
                        options={nationalityOptions}
                        value={this.state.data.nationality}
                    />
                </div>
            </div>
        )
    }
}