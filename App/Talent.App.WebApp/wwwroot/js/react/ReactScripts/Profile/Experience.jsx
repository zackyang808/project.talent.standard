/* Experience section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import moment from 'moment';

export default class Experience extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.componentData,
            newExperience:
            {
                id: '',
                position: '',
                company: '',
                start: '',
                end: '',
                responsibilities: ''
            },
            modifingExperience:
            {
                id: '',
                position: '',
                company: '',
                start: '',
                end: '',
                responsibilities: ''
            },
            editableRowId: '',
            showAddNewSection: false
        }

        this.addNew = this.addNew.bind(this);
        this.showAddNewSection = this.showAddNewSection.bind(this);
        this.hideAddNewSection = this.hideAddNewSection.bind(this);
        this.edit = this.edit.bind(this);
        this.delete = this.delete.bind(this);
        this.update = this.update.bind(this);
        this.canCelEdit = this.canCelEdit.bind(this);
        this.handleInputChangeForAddNew = this.handleInputChangeForAddNew.bind(this);
        this.handleInputChangeForEdit = this.handleInputChangeForEdit.bind(this);
    };

    showAddNewSection(e) {
        e.preventDefault();
        this.setState({
            newExperience:
            {
                id: '',
                position: '',
                company: '',
                start: '',
                end: '',
                responsibilities: ''
            }
        })
        this.setState({ showAddNewSection: true });
    }

    hideAddNewSection(e) {
        e.preventDefault();
        this.setState({ showAddNewSection: false });
    }

    addNew(e) {
        e.preventDefault();
        const ObjectID = require("bson-objectid");
        const newExperience = Object.assign({}, this.state.newExperience, { id: ObjectID().toHexString() });
        newExperience.start = moment(newExperience.start,'DD/MM/YYYY').format('Do MMMM, YYYY');
        newExperience.end = moment(newExperience.end,'DD/MM/YYYY').format('Do MMMM, YYYY');
        let newExperiences = this.state.data.slice();
        newExperiences.push(newExperience);
        this.setState({ data: newExperiences })

        let data = {};
        data[this.props.componentId] = newExperiences;
        this.props.saveProfileData(data)
        this.setState({ showAddNewSection: false });
    }

    edit(e, experience) {
        e.preventDefault();
        this.setState({
            modifingExperience:
            {
                id: experience.id,
                position: experience.position,
                company: experience.company,
                start: moment(experience.start, 'Do MMMM, YYYY').format('DD/MM/YYYY'),
                end: moment(experience.end, 'Do MMMM, YYYY').format('DD/MM/YYYY'),
                responsibilities: experience.responsibilities
            },
            editableRowId: experience.id
        });
    }

    delete(e, id) {
        e.preventDefault();

        const newExperiences = this.state.data.filter(x => x.id !== id);
        this.setState({ data: newExperiences })

        let data = {};
        data[this.props.componentId] = newExperiences;
        this.props.saveProfileData(data)
    }

    update(e) {
        e.preventDefault();
        let modifingExperience = Object.assign({}, this.state.modifingExperience);
        if (modifingExperience.start) {
            modifingExperience.start = moment(modifingExperience.start,'DD/MM/YYYY').format('Do MMMM, YYYY');
        }
        if (modifingExperience.end) {
            modifingExperience.end = moment(modifingExperience.end,'DD/MM/YYYY').format('Do MMMM, YYYY');
        }
        const newExperiences = this.state.data.map(x => modifingExperience.id === x.id ? modifingExperience : x);
        let data = {};
        data[this.props.componentId] = newExperiences;
        this.props.saveProfileData(data);
        this.setState({ editableRowId: '' });
    }

    canCelEdit(e) {
        e.preventDefault();
        this.setState({ editableRowId: '' });
    }

    handleInputChangeForAddNew(e) {
        let data = Object.assign({}, this.state.newExperience);
        data[e.target.name] = e.target.value;
        this.setState({ newExperience: data });
    }

    handleInputChangeForEdit(e) {
        let data = Object.assign({}, this.state.modifingExperience);
        data[e.target.name] = e.target.value;
        this.setState({ modifingExperience: data });
    }

    componentDidUpdate(preProps) {
        if (preProps.componentData !== this.props.componentData) {
            this.setState({ data: this.props.componentData });
        }
    }

    render() {
        return (
            <div className="sixteen wide column">
                <div className="ui grid">
                    {
                        this.state.showAddNewSection ?
                            <div className="row">
                                <div className="sixteen wide column">
                                    <div className="two fields">
                                        <ChildSingleInput
                                            inputType="text"
                                            name="company"
                                            value={this.state.newExperience.company}
                                            controlFunc={this.handleInputChangeForAddNew}
                                            maxLength={200}
                                            label="Company"
                                            placeholder="Company"
                                            errorMessage="Please enter a valid company"
                                        />
                                        <ChildSingleInput
                                            inputType="text"
                                            name="position"
                                            value={this.state.newExperience.position}
                                            controlFunc={this.handleInputChangeForAddNew}
                                            maxLength={50}
                                            label="Position"
                                            placeholder="Position"
                                            errorMessage="Please enter a valid position"
                                        />
                                    </div>
                                    <div className="two fields">
                                        <ChildSingleInput
                                            inputType="text"
                                            name="start"
                                            value={this.state.newExperience.start}
                                            controlFunc={this.handleInputChangeForAddNew}
                                            maxLength={10}
                                            label="Start Date"
                                            placeholder="Format: Day/Month/Year"
                                            errorMessage="Please enter a valid start date"
                                        />
                                        <ChildSingleInput
                                            inputType="text"
                                            name="end"
                                            value={this.state.newExperience.end}
                                            controlFunc={this.handleInputChangeForAddNew}
                                            maxLength={10}
                                            label="End Date"
                                            placeholder="Format: Day/Month/Year"
                                            errorMessage="Please enter a valid end date"
                                        />
                                    </div>
                                    <ChildSingleInput
                                        inputType="text"
                                        name="responsibilities"
                                        value={this.state.newExperience.responsibilities}
                                        controlFunc={this.handleInputChangeForAddNew}
                                        maxLength={500}
                                        label="Responsibilities"
                                        placeholder="Responsibilities"
                                        errorMessage="Please enter valid responsibilities"
                                    />
                                    <input type="button" className="ui teal button" onClick={this.addNew} value="Add"></input>
                                    <input type="button" className="ui button" onClick={this.hideAddNewSection} value="Cancel"></input>
                                </div>
                            </div> : ''
                    }

                    <div className="row">
                        <div className="sixteen wide column">
                            <table className="ui fixed table">
                                <thead>
                                    <tr>
                                        <th>Company</th>
                                        <th>Position</th>
                                        <th>Responsibilities</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>
                                            <button className="ui teal button" onClick={this.showAddNewSection}>
                                                <i className="plus icon"></i>
                                                Add New
                                        </button>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.data.map(x =>
                                        (
                                            x.id === this.state.editableRowId ?
                                                <tr key={this.state.editableRowId}>
                                                    <td colSpan="6">
                                                        <div className="two fields">
                                                            <ChildSingleInput
                                                                inputType="text"
                                                                name="company"
                                                                value={this.state.modifingExperience.company}
                                                                controlFunc={this.handleInputChangeForEdit}
                                                                maxLength={200}
                                                                label="Company"
                                                                placeholder="Company"
                                                                errorMessage="Please enter a valid company"
                                                            />
                                                            <ChildSingleInput
                                                                inputType="text"
                                                                name="position"
                                                                value={this.state.modifingExperience.position}
                                                                controlFunc={this.handleInputChangeForEdit}
                                                                maxLength={50}
                                                                label="Position"
                                                                placeholder="Position"
                                                                errorMessage="Please enter a valid position"
                                                            />
                                                        </div>
                                                        <div className="two fields">
                                                            <ChildSingleInput
                                                                inputType="text"
                                                                name="start"
                                                                value={this.state.modifingExperience.start}
                                                                controlFunc={this.handleInputChangeForEdit}
                                                                maxLength={10}
                                                                label="Start Date"
                                                                placeholder="Format: Day/Month/Year"
                                                                errorMessage="Please enter a valid start date"
                                                            />
                                                            <ChildSingleInput
                                                                inputType="text"
                                                                name="end"
                                                                value={this.state.modifingExperience.end}
                                                                controlFunc={this.handleInputChangeForEdit}
                                                                maxLength={10}
                                                                label="End Date"
                                                                placeholder="Format: Day/Month/Year"
                                                                errorMessage="Please enter a valid end date"
                                                            />
                                                        </div>
                                                        <ChildSingleInput
                                                            inputType="text"
                                                            name="responsibilities"
                                                            value={this.state.modifingExperience.responsibilities}
                                                            controlFunc={this.handleInputChangeForEdit}
                                                            maxLength={500}
                                                            label="Responsibilities"
                                                            placeholder="Responsibilities"
                                                            errorMessage="Please enter valid responsibilities"
                                                        />
                                                        <button className="ui blue basic button" onClick={this.update}>Update</button>
                                                        <button className="ui red basic button" onClick={this.canCelEdit}>Cancel</button>
                                                    </td>
                                                </tr>
                                                :
                                                <tr key={x.id}>
                                                    <td>{x.company}</td>
                                                    <td>{x.position}</td>
                                                    <td>{x.responsibilities}</td>
                                                    <td>{x.start}</td>
                                                    <td>{x.end}</td>
                                                    <td>
                                                        <button className="ui icon button" onClick={(e) => { this.edit(e, x) }}>
                                                            <i className="pencil icon"></i>
                                                        </button>
                                                        <button className="ui icon button" onClick={(e) => this.delete(e, x.id)}>
                                                            <i className="close icon"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )

    }
}
