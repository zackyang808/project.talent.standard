import React from 'react';
import Cookies from 'js-cookie';
import _ from 'lodash';
import SocialMediaLinkedAccount from './SocialMediaLinkedAccount.jsx';
import { IndividualDetailSection } from './ContactDetail.jsx';
import FormItemWrapper from '../Form/FormItemWrapper.jsx';
import moment from 'moment';
import { Address, Nationality } from './Location.jsx';
import Language from './Language.jsx';
import Skill from './Skill.jsx';
// import Education from './Education.jsx';
// import Certificate from './Certificate.jsx';
import VisaStatus from './VisaStatus.jsx'
import PhotoUpload from './PhotoUpload.jsx';
// import VideoUpload from './VideoUpload.jsx';
// import CVUpload from './CVUpload.jsx';
import SelfIntroduction from './SelfIntroduction.jsx';
import Experience from './Experience.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';
// import { LoggedInNavigation } from '../Layout/LoggedInNavigation.jsx';
import TalentStatus from './TalentStatus.jsx';

export default class AccountProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            profileData: {
                linkedAccounts: {
                    linkedIn: '',
                    github: ''
                },
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: {},
                summary: '',
                description: '',
                nationality: '',
                education: [],
                languages: [],
                skills: [],
                experience: [],
                certifications: [],
                visaStatus: '',
                visaExpiryDate: '',
                jobSeekingStatus: {
                    status: '',
                    availableDate: ''
                },
                profilePhotoUrl: ''
            },
            loaderData: loaderData,

        }

        this.updateWithoutSave = this.updateWithoutSave.bind(this)
        this.updateAndSaveData = this.updateAndSaveData.bind(this)
        this.saveProfile = this.saveProfile.bind(this)
        this.loadData = this.loadData.bind(this)
        this.init = this.init.bind(this);
    };

    init() {
        let loaderData = this.state.loaderData;
        loaderData.allowedUsers.push("Talent");
        loaderData.isLoading = false;
        this.setState({ loaderData, })
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/getTalentProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            success: function (res) {
                if (res.data.visaExpiryDate) {
                    res.data.visaExpiryDate = moment(res.data.visaExpiryDate).format('DD/MM/YYYY');
                }
                if (res.data.jobSeekingStatus && res.data.jobSeekingStatus.availableDate) {
                    res.data.jobSeekingStatus.availableDate = moment(res.data.jobSeekingStatus.availableDate).format('DD/MM/YYYY');
                }
                if (res.data.experience) {
                    res.data.experience.forEach(obj => {
                        if (obj.start) {
                            obj.start = moment(obj.start).format('Do MMMM, YYYY');
                        }
                        if (obj.end) {
                            obj.end = moment(obj.end).format('Do MMMM, YYYY');
                        }
                    });
                }
                this.updateWithoutSave(res.data)
            }.bind(this)
        })
        this.init()
    }
    //updates component's state without saving data
    updateWithoutSave(newValues) {
        const newProfile = Object.assign({}, this.state.profileData, newValues)
        this.setState({
            profileData: newProfile
        })
    }

    //updates component's state and saves data
    updateAndSaveData(newValues) {
        const newProfile = Object.assign({}, this.state.profileData, newValues)
        this.setState({
            profileData: newProfile
        }, this.saveProfile)
    }

    saveProfile() {
        var cookies = Cookies.get('talentAuthToken');
        // var data = Object.assign({}, this.state.profileData);
        var data = _.cloneDeep(this.state.profileData);
        if (data.visaExpiryDate) {
            data.visaExpiryDate = moment.utc(data.visaExpiryDate, 'DD/MM/YYYY').format();
        }
        if (data.jobSeekingStatus && data.jobSeekingStatus.availableDate) {
            const date = moment.utc(data.jobSeekingStatus.availableDate, 'DD/MM/YYYY').format();
            data.jobSeekingStatus.availableDate = date;
        }
        if (data.experience) {
            data.experience.forEach(obj => {
                if (obj.start) {
                    obj.start = moment.utc(obj.start, 'Do MMMM, YYYY').format();
                }
                if (obj.end) {
                    obj.end = moment.utc(obj.end, 'Do MMMM, YYYY').format();
                }
            });
        }
        $.ajax({
            url: 'http://localhost:60290/profile/profile/updateTalentProfile',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "POST",
            data: JSON.stringify(data),
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show("Profile updated sucessfully", "success", null, null);
                } else {
                    TalentUtil.notification.show("Profile did not update successfully", "error", null, null);
                }

            }.bind(this),
            error: function (res, a, b) {
                TalentUtil.notification.show("Profile did not update successfully", "error", null, null);
                console.log(res)
                console.log(a)
                console.log(b)
            }.bind(this)
        })
    }

    render() {
        const profile = {
            firstName: this.state.profileData.firstName ? this.state.profileData.firstName : '',
            lastName: this.state.profileData.lastName ? this.state.profileData.lastName : '',
            email: this.state.profileData.email ? this.state.profileData.email : '',
            phone: this.state.profileData.phone ? this.state.profileData.phone : ''
        }
        const description = {
            summary: this.state.profileData.summary ? this.state.profileData.summary : '',
            description: this.state.profileData.description ? this.state.profileData.description : ''
        }

        const address = {
            number: this.state.profileData.address.number ? this.state.profileData.address.number : '',
            street: this.state.profileData.address.street ? this.state.profileData.address.street : '',
            suburb: this.state.profileData.address.suburb ? this.state.profileData.address.suburb : '',
            postCode: this.state.profileData.address.postCode ? this.state.profileData.address.postCode : '',
            city: this.state.profileData.address.city ? this.state.profileData.address.city : '',
            country: this.state.profileData.address.country ? this.state.profileData.address.country : ''
        }

        const nationality = { nationality: this.state.profileData.nationality ? this.state.profileData.nationality : '' }

        const jobSeekingStatus = this.state.profileData.jobSeekingStatus ?
            {
                status: this.state.profileData.jobSeekingStatus.status ? this.state.profileData.jobSeekingStatus.status : '',
                availableDate: this.state.profileData.jobSeekingStatus.availableDate ? this.state.profileData.jobSeekingStatus.availableDate : ''
            } :
            { status: '', availableDate: '' };

        const visaStatus = {
            visaStatus: this.state.profileData.visaStatus ? this.state.profileData.visaStatus : '',
            visaExpiryDate: this.state.profileData.visaExpiryDate ? this.state.profileData.visaExpiryDate : ''
        }

        const profilePhotoUrl = { profilePhotoUrl: this.state.profileData.profilePhotoUrl ? this.state.profileData.profilePhotoUrl : '' }

        return (
            <BodyWrapper reload={this.loadData} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <div className="ui container">
                            <div className="profile">
                                <form className="ui form">
                                    <div className="ui grid">
                                        <FormItemWrapper
                                            title='Linked Accounts'
                                            tooltip='Linking to online social networks adds credibility to your profile' >
                                            <SocialMediaLinkedAccount
                                                componentData={this.state.profileData.linkedAccounts}
                                                componentId='linkedAccounts'
                                                //updateProfileData={this.updateWithoutSave}
                                                saveProfileData={this.updateAndSaveData} />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Description'>
                                            <SelfIntroduction
                                                componentData={description}
                                                saveProfileData={this.updateAndSaveData} />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='User Details'
                                            tooltip='Enter your contact details' >
                                            <IndividualDetailSection
                                                controlFunc={(componentId, data) => this.updateAndSaveData(data)}
                                                details={profile}
                                                componentId='contactDetails' />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Address'
                                            tooltip='Enter your current address'>
                                            <Address
                                                componentId="address"
                                                componentData={address}
                                                //updateProfileData={this.updateWithoutSave}
                                                saveProfileData={this.updateAndSaveData} />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Nationality'
                                            tooltip='Select your nationality'>
                                            <Nationality
                                                componentData={nationality}
                                                saveProfileData={this.updateAndSaveData} />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Languages'
                                            tooltip='Select languages that you speak'>
                                            <Language
                                                componentData={this.state.profileData.languages}
                                                saveProfileData={this.updateAndSaveData}
                                                componentId='languages' />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Skills'
                                            tooltip='List your skills'>
                                            <Skill
                                                componentData={this.state.profileData.skills}
                                                saveProfileData={this.updateAndSaveData}
                                                componentId='skills' />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Work experience'
                                            tooltip='Add your work experience'>
                                            <Experience
                                                componentData={this.state.profileData.experience}
                                                saveProfileData={this.updateAndSaveData}
                                                componentId='experience'
                                            />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Visa Status'
                                            tooltip='What is your current Visa/Citizenship status?'>
                                            <VisaStatus
                                                componentData={visaStatus}
                                                saveProfileData={this.updateAndSaveData} />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Status'
                                            tooltip='What is your current status in jobseeking?'>
                                            <TalentStatus
                                                componentId="jobSeekingStatus"
                                                componentData={jobSeekingStatus}
                                                saveProfileData={this.updateAndSaveData}
                                            />
                                        </FormItemWrapper>

                                        <FormItemWrapper
                                            title='Profile Photo'
                                            tooltip='Please upload your profile photo'
                                            hideSegment={true}>
                                            <PhotoUpload
                                                componentData={profilePhotoUrl}
                                                updateProfileData={this.updateWithoutSave}
                                                savePhotoUrl='http://localhost:60290/profile/profile/updateProfilePhoto' />
                                        </FormItemWrapper>

                                        {/* <FormItemWrapper
                                                title='Education'
                                                tooltip='Add your educational background'
                                            >
                                                <Education
                                                    educationData={this.state.profileData.education}
                                                    updateProfileData={this.updateAndSaveData}
                                                />
                                            </FormItemWrapper>
                                            <FormItemWrapper
                                                title='Certification'
                                                tooltip='List your certificates, honors and awards'
                                            >
                                                <Certificate
                                                    certificateData={this.state.profileData.certifications}
                                                    updateProfileData={this.updateAndSaveData}
                                                />
                                            </FormItemWrapper> 
                                            
                                        <FormItemWrapper
                                            title='Profile Video'
                                            tooltip='Upload a brief self-introduction video'
                                            hideSegment={true}
                                        >
                                            <VideoUpload
                                                videoName={this.state.profileData.videoName}
                                                updateProfileData={this.updateWithoutSave}
                                                saveVideoUrl={'http://localhost:60290/profile/profile/updateTalentVideo'}
                                            />
                                        </FormItemWrapper>
                                         <FormItemWrapper
                                                title='CV'
                                                tooltip='Upload your CV. Accepted files are pdf, doc & docx)'
                                                hideSegment={true}
                                            >
                                                <CVUpload
                                                    cvName={this.state.profileData.cvName}
                                                    cvUrl={this.state.profileData.cvUrl}
                                                    updateProfileData={this.updateWithoutSave}
                                                    saveCVUrl={'http://localhost:60290/profile/profile/updateTalentCV'}
                                                />
                                            </FormItemWrapper> */}

                                    </div>
                                </form>
                            </div >
                        </div>
                    </div>
                </section>
            </BodyWrapper>
        )
    }
}
