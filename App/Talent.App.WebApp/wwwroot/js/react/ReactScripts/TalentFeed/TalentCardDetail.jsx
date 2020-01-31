import React from 'react';
import ReactDOM from 'react-dom';
import ReactPlayer from 'react-player';
import { Embed, Grid, Image, Header } from 'semantic-ui-react'

export default class TalentCardDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.componentData ? this.props.componentData :
                {
                    photoUrl: '',
                    videoUrl: '',
                    visaStatus: '',
                    currentEmployer: '',
                    currentcurrentPosition: ''
                },
            showTalentProfile: this.props.showTalentProfile
        }

        this.renderVideo = this.renderVideo.bind(this);
        this.renderProfile = this.renderProfile.bind(this);
    };

    renderVideo() {
        return (
            <Embed url={this.state.data.videoUrl ? this.state.data.videoUrl : ''}
                iframe={{
                    allowFullScreen: true
                }} />
        )
    }

    renderProfile() {
        const photoUrl = this.state.data.photoUrl ? this.state.data.photoUrl : '/images/no-image.png';
        const employer = this.state.data.currentEmployer ? this.state.data.currentEmployer : '';
        const visaStatus = this.state.data.visaStatus ? this.state.data.visaStatus : '';
        const currentPosition = this.state.data.currentPosition ? this.state.data.currentPosition : '';
        return (
            <Grid columns={2}>
                <Grid.Row>
                    <Grid.Column>
                        <Image src={photoUrl} />
                    </Grid.Column>
                    <Grid.Column>
                        <Header as='h4'>Talent snapshot</Header>
                        <Header sub>CURRENT EMPLOYER</Header>
                        <p>{employer}</p>
                        <Header sub>VISA STATUS</Header>
                        <p>{visaStatus}</p>
                        <Header sub>currentPosition</Header>
                        <p>{currentPosition}</p>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }

    componentDidUpdate(preProps) {
        if (preProps.componentData !== this.props.componentData) {
            this.setState({ data: this.props.componentData });
        }
        if (preProps.showTalentProfile !== this.props.showTalentProfile) {
            this.setState({ showTalentProfile: this.props.showTalentProfile });
        }
    }

    render() {
        return this.state.showTalentProfile ? this.renderProfile() : this.renderVideo();
    }
}