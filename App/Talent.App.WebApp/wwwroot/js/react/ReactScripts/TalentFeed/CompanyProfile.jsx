import React from 'react';
import Cookies from 'js-cookie';
import { Loader } from 'semantic-ui-react';
import { Card, Icon, Image } from 'semantic-ui-react'

export default class CompanyProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                companyContact: {
                    name: '',
                    phone: '',
                    email: '',
                    location: {
                        country: '',
                        city: ''
                    }
                },
                // skills:[],
                profilePhotoUrl: ''
            }
        }

        this.loadData = this.loadData.bind(this);
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://zack-advanced-m1-profile.azurewebsites.net/profile/profile/getEmployerProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                if (res.success) {
                    this.setState({ data: res.employer });
                }
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
    }

    componentDidMount() {
        this.loadData();
    }

    render() {
        return (
            <Card>
                <Card.Content className='center aligned'>
                    <Image src={this.state.data.profilePhotoUrl ? this.state.data.profilePhotoUrl : '/images/no-image.png'}
                        centered size='tiny' circular />
                    <Card.Header>{this.state.data.companyContact.name}</Card.Header>
                    <Card.Meta>
                        <Icon name='map marker alternate' />
                        <span>{this.state.data.companyContact.location ?
                            this.state.data.companyContact.location.city + ', ' + this.state.data.companyContact.location.country : ''}
                        </span>
                    </Card.Meta>
                    <Card.Description>
                        We currently do not have specific skills that we desire.
                </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <p><Icon name='phone' />: {this.state.data.companyContact.phone ? this.state.data.companyContact.phone : ''}</p>
                    <p><Icon name='envelope outline' />: {this.state.data.companyContact.email ? this.state.data.companyContact.email : ''}</p>
                </Card.Content>
            </Card>
        )
    }
}