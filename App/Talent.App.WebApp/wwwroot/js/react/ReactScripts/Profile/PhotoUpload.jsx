/* Photo upload section */
import React, { Component } from 'react';
import Cookies from 'js-cookie';
import camera from '../images/camera.png'

export default class PhotoUpload extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: props.componentData ? Object.assign({}, props.componentData) :
                {
                    profilePhotoUrl: ''
                },
            showUploadBtn: false,
            selectedFile: null
        }

        this.fileInputRef = React.createRef();

        this.handleChange = this.handleChange.bind(this);
        this.selectImg = this.selectImg.bind(this);
        this.save = this.save.bind(this);
        this.updateProfilePhoto = this.updateProfilePhoto.bind(this);
    }



    handleChange(e) {
        if (e.target.files.length > 0) {
            this.setState({ selectedFile: e.target.files[0], showUploadBtn: true });
        } else {
            this.setState({ selectedFile: null, showUploadBtn: false });
        }
    }

    selectImg() {
        this.fileInputRef.current.click();
    }

    save() {
        const formData = new FormData();
        formData.append('file', this.state.selectedFile);
        this.updateProfilePhoto(formData);
    }

    updateProfilePhoto(formData) {
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'http://localhost:60290/profile/profile/updateProfilePhoto',
            headers: {
                'Authorization': 'Bearer ' + cookies
                // 'Content-Type': 'multipart/form-data'
            },
            type: "POST",
            data: formData,
            dataType: 'json',
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.success == true) {
                    TalentUtil.notification.show("Profile photo updated sucessfully", "success", null, null);
                    this.setState({ data: { profilePhotoUrl: res.talentPhotoUrl }, showUploadBtn: false });
                } else {
                    TalentUtil.notification.show("Profile photo did not update successfully", "error", null, null);
                }

            }.bind(this),
            error: function (res, a, b) {
                TalentUtil.notification.show("Profile photo did not update successfully", "error", null, null);
                console.log(res)
                console.log(a)
                console.log(b)
            }.bind(this)
        });
    }

    componentDidUpdate(preProps) {
        if (preProps.componentData !== this.props.componentData) {
            this.setState({ data: this.props.componentData });
        }
    }

    render() {
        return (
            <div className="column">
                <div className="ui grid">
                    <div className="row">
                        <div className="column center aligned">
                            <a href="javascript:void(0);">
                                <img className="ui small circular bordered image" style={{ display: 'inline-block' }}
                                    src={this.state.data.profilePhotoUrl && this.state.selectedFile ? URL.createObjectURL(this.state.selectedFile) :
                                        this.state.data.profilePhotoUrl ? this.state.data.profilePhotoUrl :
                                            this.state.selectedFile ? URL.createObjectURL(this.state.selectedFile) :
                                                camera}
                                    onClick={this.selectImg}></img>
                            </a>
                            <input type="file" name="file" ref={this.fileInputRef} onChange={this.handleChange} hidden />
                        </div>
                    </div>
                    <div className="row">
                        <div className="column center aligned">
                            {
                                this.state.showUploadBtn ?
                                    <button type="button" className="ui teal button" onClick={this.save}>
                                        <i className="upload icon"></i>
                                        Upload
                                    </button>
                                    : ""
                            }


                        </div>
                    </div>
                </div>




            </div>
        )
    }
}
