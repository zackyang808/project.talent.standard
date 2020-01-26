﻿/* Language section */
import React from 'react';
import Cookies from 'js-cookie';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Dropdown } from 'semantic-ui-react'

export default class Language extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.componentData,
            newLanguage:
            {
                id: '',
                currentUserId: '',
                name: '',
                level: ''
            },
            modifingLanguage:
            {
                id: '',
                currentUserId: '',
                name: '',
                level: ''
            },
            languageLevelOptions:
                [
                    { key: 'Basic', value: 'Basic', text: 'Basic' },
                    { key: 'Conversational', value: 'Conversational', text: 'Conversational' },
                    { key: 'Fluent', value: 'Fluent', text: 'Fluent' },
                    { key: 'Native/Bilingual', value: 'Native/Bilingual', text: 'Native/Bilingual' }
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
    }

    showAddNewSection(e) {
        e.preventDefault();
        this.setState({
            newLanguage:
            {
                id: '',
                currentUserId: '',
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
        const newLanguage = Object.assign({}, this.state.newLanguage, { id: ObjectID().toHexString() });
        let newLanguages = this.state.data.slice();
        newLanguages.push(newLanguage);
        this.setState({ data: newLanguages })

        let data = {};
        data[this.props.componentId] = newLanguages;
        this.props.saveProfileData(data)
        this.setState({ showAddNewSection: false });
    }

    edit(e, language) {
        e.preventDefault();
        this.setState({
            modifingLanguage:
            {
                id: language.id,
                currentUserId: language.currentUserId,
                name: language.name,
                level: language.level
            },
            editableRowId: language.id
        });
    }

    delete(e, id) {
        e.preventDefault();

        const newLanguages = this.state.data.filter(x => x.id !== id);
        this.setState({ data: newLanguages })

        let data = {};
        data[this.props.componentId] = newLanguages;
        this.props.saveProfileData(data)
    }

    update(e) {
        e.preventDefault();
        const newLanguages = this.state.data.map(x => this.state.modifingLanguage.id === x.id ? this.state.modifingLanguage : x);
        let data = {};
        data[this.props.componentId] = newLanguages;
        this.props.saveProfileData(data);
        this.setState({ editableRowId: '' });
    }

    canCelEdit(e) {
        e.preventDefault();
        this.setState({ editableRowId: '' });
    }

    handleInputChangeForAddNew(e) {
        let data = Object.assign({}, this.state.newLanguage);
        data[e.target.name] = e.target.value;
        this.setState({ newLanguage: data });
    }

    handleInputChangeForEdit(e) {
        let data = Object.assign({}, this.state.modifingLanguage);
        data[e.target.name] = e.target.value;
        this.setState({ modifingLanguage: data });
    }

    handleSelectChangeForAddNew(e, data) {
        const level = { level: data.value };
        this.setState({ newLanguage: Object.assign({}, this.state.newLanguage, level) })
    }

    handleSelectChangeForEdit(e, data) {
        const level = { level: data.value };
        this.setState({ modifingLanguage: Object.assign({}, this.state.modifingLanguage, level) })
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
                                            value={this.state.newLanguage.name}
                                            controlFunc={this.handleInputChangeForAddNew}
                                            maxLength={50}
                                            placeholder="Add language"
                                            errorMessage="Please enter a valid language"
                                        />
                                        <div className="field">
                                            <Dropdown
                                                placeholder='Language level'
                                                selection
                                                onChange={this.handleSelectChangeForAddNew}
                                                options={this.state.languageLevelOptions}
                                                value={this.state.newLanguage.level}
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
                                        <th className="eight wide">Language</th>
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
                                                            value={this.state.modifingLanguage.name}
                                                            controlFunc={this.handleInputChangeForEdit}
                                                            maxLength={50}
                                                            placeholder="Add language"
                                                            errorMessage="Please enter a valid language"
                                                        />
                                                    </td>
                                                    <td>
                                                        <Dropdown
                                                            placeholder='Language level'
                                                            fluid
                                                            selection
                                                            onChange={this.handleSelectChangeForEdit}
                                                            options={this.state.languageLevelOptions}
                                                            value={this.state.modifingLanguage.level}
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