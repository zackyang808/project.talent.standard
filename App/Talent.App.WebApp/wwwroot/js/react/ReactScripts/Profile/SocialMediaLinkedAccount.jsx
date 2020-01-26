/* Social media JSX */
import React from 'react';
import { ChildSingleInput } from '../Form/SingleInput.jsx';
import { Popup } from 'semantic-ui-react';

export default class SocialMediaLinkedAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showEditSection: false,
            data: props.componentData ? Object.assign({}, props.componentData) :
                {
                    linkedIn: '',
                    github: ''
                }
        }

        this.renderViewSection = this.renderViewSection.bind(this);
        this.renderEditSection = this.renderEditSection.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.save = this.save.bind(this);
        this.showEditSection = this.showEditSection.bind(this);
        this.closeEditSection = this.closeEditSection.bind(this);
    }

    componentDidMount() {
        // $('.ui.button.social-media')
        //     .popup();
    }

    componentDidUpdate(preProps) {
        if (preProps.componentData !== this.props.componentData) {
            this.setState({ data: this.props.componentData });
        }
    }


    render() {
        return (this.state.showEditSection ? this.renderEditSection() : this.renderViewSection())
    }

    renderViewSection() {
        return (
            <div className="sixteen wide column">
                {
                    this.state.data.linkedIn && this.state.data.linkedIn.length > 0 ?
                        (
                            <a className="ui linkedin button" href={this.state.data.linkedIn} target="_blank">
                                <i className="linkedin icon"></i>
                                LinkedIn
                            </a>
                        ) :
                        (<div />)
                }

                {
                    this.state.data.github && this.state.data.github.length > 0 ?
                        (
                            <a className="ui secondary button" href={this.state.data.github} target="_blank">
                                <i className="github icon"></i>
                                GitHub
                            </a>
                        ) :
                        (<div />)
                }

                <button className="ui teal right floated button" onClick={this.showEditSection}>Edit</button>
            </div>
        )
    }

    renderEditSection() {
        return (
            <div className='ui sixteen wide column'>
                <ChildSingleInput
                    inputType="text"
                    label="LinkedIn"
                    name="linkedIn"
                    value={this.state.data.linkedIn}
                    controlFunc={this.handleChange}
                    maxLength={400}
                    placeholder="Enter your LinkedIn URL"
                    errorMessage="Please enter a valid LinkedIn URL."
                />
                <ChildSingleInput
                    inputType="text"
                    label="GitHub"
                    name="github"
                    value={this.state.data.github}
                    controlFunc={this.handleChange}
                    maxLength={400}
                    placeholder="Enter your GitHub URL"
                    errorMessage="Please enter a valid GitHub URL."
                />
                
                <input type="button" className="ui teal button" onClick={this.save} value="Save"></input>
                <input type="button" className="ui button" onClick={this.closeEditSection} value="Cancel"></input>
            </div>
        )
    }

    handleChange(e) {
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

    showEditSection() {
        this.setState({ showEditSection: true });
    }

    closeEditSection() {
        this.setState({ showEditSection: false });
    }

}