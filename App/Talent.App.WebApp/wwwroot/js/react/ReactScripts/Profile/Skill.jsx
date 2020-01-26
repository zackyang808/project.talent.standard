/* Skill section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Dropdown } from 'semantic-ui-react'

export default class Skill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.componentData,
            newSkill:
            {
                id: '',
                name: '',
                level: ''
            },
            modifingSkill:
            {
                id: '',
                name: '',
                level: ''
            },
            skillLevelOptions:
                [
                    { key: 'Beginner', value: 'Beginner', text: 'Beginner' },
                    { key: 'Intermediate', value: 'Intermediate', text: 'Intermediate' },
                    { key: 'Expert', value: 'Expert', text: 'Expert' }
                ],
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
        this.handleSelectChangeForAddNew = this.handleSelectChangeForAddNew.bind(this);
        this.handleSelectChangeForEdit = this.handleSelectChangeForEdit.bind(this);
    };


    showAddNewSection(e) {
        e.preventDefault();
        this.setState({
            newSkill:
            {
                id: '',
                name: '',
                level: ''
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
        const newSkill = Object.assign({}, this.state.newSkill, { id: ObjectID().toHexString() });
        let newSkills = this.state.data.slice();
        newSkills.push(newSkill);
        this.setState({ data: newSkills })

        let data = {};
        data[this.props.componentId] = newSkills;
        this.props.saveProfileData(data)
        this.setState({ showAddNewSection: false });
    }

    edit(e, skill) {
        e.preventDefault();
        this.setState({
            modifingSkill:
            {
                id: skill.id,
                name: skill.name,
                level: skill.level
            },
            editableRowId: skill.id
        });
    }

    delete(e, id) {
        e.preventDefault();

        const newSkills = this.state.data.filter(x => x.id !== id);
        this.setState({ data: newSkills })

        let data = {};
        data[this.props.componentId] = newSkills;
        this.props.saveProfileData(data)
    }

    update(e) {
        e.preventDefault();
        const newSkills = this.state.data.map(x => this.state.modifingSkill.id === x.id ? this.state.modifingSkill : x);
        let data = {};
        data[this.props.componentId] = newSkills;
        this.props.saveProfileData(data);
        this.setState({ editableRowId: '' });
    }

    canCelEdit(e) {
        e.preventDefault();
        this.setState({ editableRowId: '' });
    }

    handleInputChangeForAddNew(e) {
        let data = Object.assign({}, this.state.newSkill);
        data[e.target.name] = e.target.value;
        this.setState({ newSkill: data });
    }

    handleInputChangeForEdit(e) {
        let data = Object.assign({}, this.state.modifingSkill);
        data[e.target.name] = e.target.value;
        this.setState({ modifingSkill: data });
    }

    handleSelectChangeForAddNew(e, data) {
        const level = { level: data.value };
        this.setState({ newSkill: Object.assign({}, this.state.newSkill, level) })
    }

    handleSelectChangeForEdit(e, data) {
        const level = { level: data.value };
        this.setState({ modifingSkill: Object.assign({}, this.state.modifingSkill, level) })
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
                                    <div className="inline fields">
                                        <ChildSingleInput
                                            inputType="text"
                                            name="name"
                                            value={this.state.newSkill.name}
                                            controlFunc={this.handleInputChangeForAddNew}
                                            maxLength={50}
                                            placeholder="Add skill"
                                            errorMessage="Please enter a valid skill"
                                        />
                                        <div className="field">
                                            <Dropdown
                                                placeholder='skill level'
                                                selection
                                                onChange={this.handleSelectChangeForAddNew}
                                                options={this.state.skillLevelOptions}
                                                value={this.state.newSkill.level}
                                            />
                                        </div>
                                        <div className="field">
                                            <input type="button" className="ui teal button" onClick={this.addNew} value="Add"></input>
                                            <input type="button" className="ui button" onClick={this.hideAddNewSection} value="Cancel"></input>
                                        </div>
                                    </div>
                                </div>
                            </div> : ''
                    }

                    <div className="row">
                        <div className="sixteen wide column">
                            <table className="ui single line table">
                                <thead>
                                    <tr>
                                        <th className="eight wide">Skill</th>
                                        <th className="four wide">Level</th>
                                        <th className="four wide">
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
                                                    <td>
                                                        <ChildSingleInput
                                                            inputType="text"
                                                            name="name"
                                                            value={this.state.modifingSkill.name}
                                                            controlFunc={this.handleInputChangeForEdit}
                                                            maxLength={50}
                                                            placeholder="Add skill"
                                                            errorMessage="Please enter a valid skill"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Dropdown
                                                            placeholder='skill level'
                                                            fluid
                                                            selection
                                                            onChange={this.handleSelectChangeForEdit}
                                                            options={this.state.skillLevelOptions}
                                                            value={this.state.modifingSkill.level}
                                                        />
                                                    </td>
                                                    <td>
                                                        <button className="ui blue basic button" onClick={this.update}>Update</button>
                                                        <button className="ui red basic button" onClick={this.canCelEdit}>Cancel</button>
                                                    </td>
                                                </tr>
                                                :
                                                <tr key={x.id}>
                                                    <td>{x.name}</td>
                                                    <td>{x.level}</td>
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

