import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie'
import TalentCard from './TalentCard.jsx';
import { Loader } from 'semantic-ui-react';
import CompanyProfile from './CompanyProfile.jsx';
import FollowingSuggestion from './FollowingSuggestion.jsx';
import { BodyWrapper, loaderData } from '../Layout/BodyWrapper.jsx';

export default class TalentFeed extends React.Component {
    constructor(props) {
        super(props);

        let loader = loaderData
        loader.allowedUsers.push("Employer")
        loader.allowedUsers.push("Recruiter")

        this.state = {
            loadNumber: 3,
            loadPosition: 0,
            feedData: [],
            watchlist: [],
            loaderData: loader,
            loadingFeedData: false,
            companyDetails: null
        }

        this.init = this.init.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.loadFeedData = this.loadFeedData.bind(this);

    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this
    }

    handleScroll() {
        const win = $(window);
        if ((($(document).height() - win.height()) == Math.round(win.scrollTop())) || ($(document).height() - win.height()) - Math.round(win.scrollTop()) == 1) {
            this.setState({ loadingFeedData: true }, this.loadFeedData);
        }
    };

    loadFeedData() {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://zack-advanced-m1-profile.azurewebsites.net/profile/profile/getTalent',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: { position: this.state.loadPosition, number: this.state.loadNumber },
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                if (res.success && res.data) {
                    const data = this.state.feedData.concat(res.data);
                    this.setState({ feedData: data, loadPosition: this.state.loadPosition + 1 });
                }
                this.setState({ loadingFeedData: false });
            }.bind(this),
            error: function (res) {
            }
        })
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        this.init()
        this.loadFeedData();
    };


    render() {

        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui grid talent-feed container">
                    <div className="four wide column">
                        <CompanyProfile />
                    </div>
                    <div className="eight wide column">
                        {
                            this.state.feedData.map(obj => {
                                return (
                                    <TalentCard key={obj.id} componentData={obj} />
                                )
                            })
                        }

                        {
                            this.state.loadingFeedData ?
                                <div style={{ textAlign: "center" }}>
                                    <div className="ui image tiny" >
                                        <img src="/images/rolling.gif" alt="Loading…" />
                                    </div>
                                </div>
                                : ''
                        }
                    </div>
                    <div className="four wide column">
                        <div className="ui card">
                            <FollowingSuggestion />
                        </div>
                    </div>
                </div>
            </BodyWrapper>
        )
    }
}