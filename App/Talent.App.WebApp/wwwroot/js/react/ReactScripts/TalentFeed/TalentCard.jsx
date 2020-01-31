import React from 'react';
import ReactPlayer from 'react-player';
import PropTypes from 'prop-types'
import TalentCardDetail from './TalentCardDetail.jsx'
import { Card, Grid, Popup, Icon, Header, Label } from 'semantic-ui-react'

export default class TalentCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: this.props.componentData ? this.props.componentData :
                {
                    name: '',
                    photoUrl: '',
                    videoUrl: '',
                    cvUrl: '',
                    visaStatus: '',
                    linkedAccounts: {
                        linkedIn: '',
                        github: ''
                    },
                    skills: [],
                    currentEmployer: '',
                    currentPosition: ''
                },
            showTalentProfile: false
        }

        this.shiftTalentDetail = this.shiftTalentDetail.bind(this);
    };

    shiftTalentDetail(e) {
        e.preventDefault();
        this.setState({ showTalentProfile: !this.state.showTalentProfile });
    }

    componentDidUpdate(preProps) {
        if (preProps.componentData !== this.props.componentData) {
            this.setState({ data: this.props.componentData });
        }
    }

    render() {
        const name = this.state.data.name ? this.state.data.name : '';
        const cvUrl = this.state.data.cvUrl ? this.state.data.cvUrl : '';
        const linkedIn = this.state.data.linkedAccounts ? this.state.data.linkedAccounts.linkedIn : '';
        const github = this.state.data.linkedAccounts ? this.state.data.linkedAccounts.github : '';
        const talentDetailData = {
            photoUrl: this.state.data.photoUrl ? this.state.data.photoUrl : '',
            videoUrl: this.state.data.videoUrl ? this.state.data.videoUrl : '',
            visaStatus: this.state.data.visaStatus ? this.state.data.visaStatus : '',
            currentEmployer: this.state.data.currentEmployer ? this.state.data.currentEmployer : '',
            currentPosition: this.state.data.currentPosition ? this.state.data.currentPosition : ''
        }
        return (
            <Card className='fluid'>
                <Card.Content>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={10}>
                                <Header as='h4'>{name}</Header>
                            </Grid.Column>
                            <Grid.Column width={6} className='right aligned'>
                                <Icon name='star' className='large' />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Content>
                <Card.Content>
                    <TalentCardDetail
                        componentData={talentDetailData}
                        showTalentProfile={this.state.showTalentProfile} />
                </Card.Content>
                <Card.Content>
                    <Grid>
                        <Grid.Row columns={4}>
                            <Grid.Column className='center aligned'>
                                {
                                    this.state.showTalentProfile ?
                                        <Icon link name='video' className='large' onClick={this.shiftTalentDetail} />
                                        :
                                        <Icon link name='user' className='large' onClick={this.shiftTalentDetail} />
                                }
                            </Grid.Column>
                            <Grid.Column className='center aligned'>
                                {
                                    cvUrl ?
                                        <a href={cvUrl} target="_blank">
                                            <Icon name='file pdf outline' className='large' />
                                        </a> : ''
                                }

                            </Grid.Column>
                            <Grid.Column className='center aligned'>
                                {
                                    linkedIn ?
                                        <a href={linkedIn} target="_blank">
                                            <Icon name='linkedin' className='large' />
                                        </a> : ''
                                }
                            </Grid.Column>
                            <Grid.Column className='center aligned'>
                                {
                                    github ?
                                        <a href={github} target="_blank">
                                            <Icon name='github' className='large' />
                                        </a> : ''
                                }
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Card.Content>
                <Card.Content>
                    {
                        this.state.data.skills.map((obj, i) => {
                            return (
                                <Label key={i} basic color='blue'>
                                    {obj}
                                </Label>
                            )
                        })
                    }
                </Card.Content>
            </Card >
        )

    }
}

