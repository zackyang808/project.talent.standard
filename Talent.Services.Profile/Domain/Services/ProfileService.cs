using Talent.Common.Contracts;
using Talent.Common.Models;
using Talent.Services.Profile.Domain.Contracts;
using Talent.Services.Profile.Models.Profile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Talent.Services.Profile.Models;
using Microsoft.AspNetCore.Http;
using System.IO;
using Talent.Common.Security;

namespace Talent.Services.Profile.Domain.Services
{
    public class ProfileService : IProfileService
    {
        private readonly IUserAppContext _userAppContext;
        IRepository<UserLanguage> _userLanguageRepository;
        IRepository<User> _userRepository;
        IRepository<Employer> _employerRepository;
        IRepository<Job> _jobRepository;
        IRepository<Recruiter> _recruiterRepository;
        IFileService _fileService;


        public ProfileService(IUserAppContext userAppContext,
                              IRepository<UserLanguage> userLanguageRepository,
                              IRepository<User> userRepository,
                              IRepository<Employer> employerRepository,
                              IRepository<Job> jobRepository,
                              IRepository<Recruiter> recruiterRepository,
                              IFileService fileService)
        {
            _userAppContext = userAppContext;
            _userLanguageRepository = userLanguageRepository;
            _userRepository = userRepository;
            _employerRepository = employerRepository;
            _jobRepository = jobRepository;
            _recruiterRepository = recruiterRepository;
            _fileService = fileService;
        }

        public bool AddNewLanguage(AddLanguageViewModel language)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<TalentProfileViewModel> GetTalentProfile(string Id)
        {
            User profile = await _userRepository.GetByIdAsync(Id);

            if (profile != null)
            {
                var result = new TalentProfileViewModel
                {
                    Id = profile.Id,
                    FirstName = profile.FirstName,
                    MiddleName = profile.MiddleName,
                    LastName = profile.LastName,
                    Gender = profile.Gender,
                    Email = profile.Email,
                    Phone = profile.Phone,
                    MobilePhone = profile.MobilePhone,
                    IsMobilePhoneVerified = profile.IsMobilePhoneVerified,
                    Address = profile.Address,
                    Nationality = profile.Nationality,
                    VisaStatus = profile.VisaStatus,
                    VisaExpiryDate = profile.VisaExpiryDate,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = string.IsNullOrWhiteSpace(profile.VideoName) ? "" : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo),
                    CvName = profile.CvName,
                    CvUrl = string.IsNullOrWhiteSpace(profile.CvName) ? "" : await _fileService.GetFileURL(profile.CvName, FileType.UserVideo),
                    Summary = profile.Summary,
                    Description = profile.Description,
                    LinkedAccounts = profile.LinkedAccounts,
                    JobSeekingStatus = profile.JobSeekingStatus,
                    Languages = profile.Languages.Select(l => ViewModelFromLanguage(l)).ToList(),
                    Skills = profile.Skills.Select(s => ViewModelFromSkill(s)).ToList(),
                    Education = profile.Education.Select(e => ViewModelFromEducation(e)).ToList(),
                    Certifications = profile.Certifications.Select(c => ViewModelFromCertification(c)).ToList(),
                    Experience = profile.Experience.Select(e => ViewModelFromExperience(e)).ToList()
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateTalentProfile(TalentProfileViewModel model, string updaterId)
        {
            try
            {
                if (model.Id != null)
                {
                    User user = await _userRepository.GetByIdAsync(model.Id);
                    if (user != null)
                    {
                        user.FirstName = model.FirstName;
                        user.MiddleName = model.MiddleName;
                        user.LastName = model.LastName;
                        user.Gender = model.Gender;
                        user.Email = model.Email;
                        user.Phone = model.Phone;
                        user.MobilePhone = model.MobilePhone;
                        user.IsMobilePhoneVerified = model.IsMobilePhoneVerified;
                        user.Address = model.Address;
                        user.Nationality = model.Nationality;
                        user.VisaStatus = model.VisaStatus;
                        user.JobSeekingStatus = model.JobSeekingStatus;
                        user.VisaExpiryDate = model.VisaExpiryDate;
                        user.Summary = model.Summary;
                        user.Description = model.Description;
                        //user.ProfilePhoto = model.ProfilePhoto;
                        //user.ProfilePhotoUrl = model.ProfilePhotoUrl;
                        user.VideoName = model.VideoName;
                        //user.Videos
                        user.CvName = model.CvName;
                        user.LinkedAccounts = model.LinkedAccounts;
                        user.UpdatedOn = DateTime.Now;
                        user.UpdatedBy = updaterId;

                        var newLanguages = new List<UserLanguage>();
                        foreach (var item in model.Languages)
                        {
                            var language = user.Languages.SingleOrDefault(x => x.Id == item.Id);
                            if (language == null)
                            {
                                language = new UserLanguage
                                {
                                    //Id = ObjectId.GenerateNewId().ToString(),
                                    UserId = updaterId,
                                    IsDeleted = false
                                };
                            }
                            UpdateLanguageFromView(item, language);
                            newLanguages.Add(language);
                        }
                        user.Languages = newLanguages;

                        var newSkills = new List<UserSkill>();
                        foreach (var item in model.Skills)
                        {
                            var skill = user.Skills.SingleOrDefault(x => x.Id == item.Id);
                            if (skill == null)
                            {
                                skill = new UserSkill
                                {
                                    //Id = ObjectId.GenerateNewId().ToString(),
                                    IsDeleted = false
                                };
                            }
                            UpdateSkillFromView(item, skill);
                            newSkills.Add(skill);
                        }
                        user.Skills = newSkills;

                        var newCertifications = new List<UserCertification>();
                        foreach (var item in model.Certifications)
                        {
                            var certification = user.Certifications.SingleOrDefault(x => x.Id == item.Id);
                            if (certification == null)
                            {
                                certification = new UserCertification
                                {
                                    //Id = ObjectId.GenerateNewId().ToString(),
                                    CreatedBy = updaterId,
                                    CreatedOn = DateTime.Now,
                                    IsDeleted = false
                                };
                            }
                            certification.UpdatedBy = updaterId;
                            certification.UpdatedOn = DateTime.Now;
                            UpdateCertificationFromView(item, certification);
                            newCertifications.Add(certification);
                        }
                        user.Certifications = newCertifications;

                        var newEducation = new List<UserEducation>();
                        foreach (var item in model.Education)
                        {
                            var education = user.Education.SingleOrDefault(x => x.Id == item.Id);
                            if (education == null)
                            {
                                education = new UserEducation
                                {
                                    //Id = ObjectId.GenerateNewId().ToString(),
                                    CreatedBy = updaterId,
                                    CreatedOn = DateTime.Now,
                                    IsDeleted = false
                                };
                            }
                            education.UpdatedBy = updaterId;
                            education.UpdatedOn = DateTime.Now;
                            UpdateEducationFromView(item, education);
                            newEducation.Add(education);
                        }
                        user.Education = newEducation;

                        var newExperience = new List<UserExperience>();
                        foreach (var item in model.Experience)
                        {
                            var experience = user.Experience.SingleOrDefault(x => x.Id == item.Id);
                            if (experience == null)
                            {
                                experience = new UserExperience();
                                //    experience = new UserExperience
                                //    {
                                //        Id = ObjectId.GenerateNewId().ToString(),
                                //    };
                            }
                            UpdateExperienceFromView(item, experience);
                            newExperience.Add(experience);
                        }
                        user.Experience = newExperience;

                        await _userRepository.Update(user);

                        return true;
                    }

                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<EmployerProfileViewModel> GetEmployerProfile(string Id, string role)
        {

            Employer profile = null;
            switch (role)
            {
                case "employer":
                    profile = (await _employerRepository.GetByIdAsync(Id));
                    break;
                case "recruiter":
                    profile = (await _recruiterRepository.GetByIdAsync(Id));
                    break;
            }

            var videoUrl = "";

            if (profile != null)
            {
                videoUrl = string.IsNullOrWhiteSpace(profile.VideoName)
                          ? ""
                          : await _fileService.GetFileURL(profile.VideoName, FileType.UserVideo);

                var skills = profile.Skills.Select(x => ViewModelFromSkill(x)).ToList();

                var result = new EmployerProfileViewModel
                {
                    Id = profile.Id,
                    CompanyContact = profile.CompanyContact,
                    PrimaryContact = profile.PrimaryContact,
                    Skills = skills,
                    ProfilePhoto = profile.ProfilePhoto,
                    ProfilePhotoUrl = profile.ProfilePhotoUrl,
                    VideoName = profile.VideoName,
                    VideoUrl = videoUrl,
                    DisplayProfile = profile.DisplayProfile,
                };
                return result;
            }

            return null;
        }

        public async Task<bool> UpdateEmployerProfile(EmployerProfileViewModel employer, string updaterId, string role)
        {
            try
            {
                if (employer.Id != null)
                {
                    switch (role)
                    {
                        case "employer":
                            Employer existingEmployer = (await _employerRepository.GetByIdAsync(employer.Id));
                            existingEmployer.CompanyContact = employer.CompanyContact;
                            existingEmployer.PrimaryContact = employer.PrimaryContact;
                            existingEmployer.ProfilePhoto = employer.ProfilePhoto;
                            existingEmployer.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingEmployer.DisplayProfile = employer.DisplayProfile;
                            existingEmployer.UpdatedBy = updaterId;
                            existingEmployer.UpdatedOn = DateTime.Now;

                            var newSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingEmployer.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newSkills.Add(skill);
                            }
                            existingEmployer.Skills = newSkills;

                            await _employerRepository.Update(existingEmployer);
                            break;

                        case "recruiter":
                            Recruiter existingRecruiter = (await _recruiterRepository.GetByIdAsync(employer.Id));
                            existingRecruiter.CompanyContact = employer.CompanyContact;
                            existingRecruiter.PrimaryContact = employer.PrimaryContact;
                            existingRecruiter.ProfilePhoto = employer.ProfilePhoto;
                            existingRecruiter.ProfilePhotoUrl = employer.ProfilePhotoUrl;
                            existingRecruiter.DisplayProfile = employer.DisplayProfile;
                            existingRecruiter.UpdatedBy = updaterId;
                            existingRecruiter.UpdatedOn = DateTime.Now;

                            var newRSkills = new List<UserSkill>();
                            foreach (var item in employer.Skills)
                            {
                                var skill = existingRecruiter.Skills.SingleOrDefault(x => x.Id == item.Id);
                                if (skill == null)
                                {
                                    skill = new UserSkill
                                    {
                                        Id = ObjectId.GenerateNewId().ToString(),
                                        IsDeleted = false
                                    };
                                }
                                UpdateSkillFromView(item, skill);
                                newRSkills.Add(skill);
                            }
                            existingRecruiter.Skills = newRSkills;
                            await _recruiterRepository.Update(existingRecruiter);

                            break;
                    }
                    return true;
                }
                return false;
            }
            catch (MongoException e)
            {
                return false;
            }
        }

        public async Task<bool> UpdateEmployerPhoto(string employerId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return false;
            }

            var profile = (await _employerRepository.Get(x => x.Id == employerId)).SingleOrDefault();

            if (profile == null)
            {
                return false;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _employerRepository.Update(profile);
                return true;
            }

            return false;

        }

        public async Task<bool> AddEmployerVideo(string employerId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<string> UpdateTalentPhoto(string talentId, IFormFile file)
        {
            var fileExtension = Path.GetExtension(file.FileName);
            List<string> acceptedExtensions = new List<string> { ".jpg", ".png", ".gif", ".jpeg" };

            if (fileExtension != null && !acceptedExtensions.Contains(fileExtension.ToLower()))
            {
                return null;
            }

            var profile = (await _userRepository.Get(x => x.Id == talentId)).SingleOrDefault();

            if (profile == null)
            {
                return null;
            }

            var newFileName = await _fileService.SaveFile(file, FileType.ProfilePhoto);

            if (!string.IsNullOrWhiteSpace(newFileName))
            {
                var oldFileName = profile.ProfilePhoto;

                if (!string.IsNullOrWhiteSpace(oldFileName))
                {
                    await _fileService.DeleteFile(oldFileName, FileType.ProfilePhoto);
                }

                profile.ProfilePhoto = newFileName;
                profile.ProfilePhotoUrl = await _fileService.GetFileURL(newFileName, FileType.ProfilePhoto);

                await _userRepository.Update(profile);
                return profile.ProfilePhotoUrl;
            }

            return null;
        }

        public async Task<bool> AddTalentVideo(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<bool> RemoveTalentVideo(string talentId, string videoName)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateTalentCV(string talentId, IFormFile file)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<string>> GetTalentSuggestionIds(string employerOrJobId, bool forJob, int position, int increment)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(string employerOrJobId, bool forJob, int position, int increment)
        {
            List<TalentSnapshotViewModel> result = new List<TalentSnapshotViewModel>();

            List<User> talents = await Task.FromResult(_userRepository.GetQueryable().Skip(position * increment).Take(increment).ToList());
            foreach (var talent in talents)
            {
                UserExperience experience = talent.Experience.OrderByDescending(e => e.Start).FirstOrDefault();

                TalentSnapshotViewModel model = new TalentSnapshotViewModel
                {
                    Id = talent.Id,
                    Name = $"{talent.FirstName} {talent.MiddleName} {talent.LastName}",
                    linkedAccounts = talent.LinkedAccounts,
                    PhotoUrl = talent.ProfilePhotoUrl,
                    VideoUrl = string.IsNullOrWhiteSpace(talent.VideoName) ? "" : await _fileService.GetFileURL(talent.VideoName, FileType.UserVideo),
                    CVUrl = string.IsNullOrWhiteSpace(talent.CvName) ? "" : await _fileService.GetFileURL(talent.CvName, FileType.UserCV),
                    CurrentEmployer = experience == null ? "" : experience.Company,
                    CurrentPosition = experience == null ? "" : experience.Position,
                    VisaStatus = talent.VisaStatus,
                    Skills = talent.Skills.Select(s => s.Skill).ToList()
                };
                result.Add(model);
            }

            return result;
        }

        public async Task<IEnumerable<TalentSnapshotViewModel>> GetTalentSnapshotList(IEnumerable<string> ids)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #region TalentMatching

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetFullTalentList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public IEnumerable<TalentMatchingEmployerViewModel> GetEmployerList()
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentMatchingEmployerViewModel>> GetEmployerListByFilterAsync(SearchCompanyModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestionViewModel>> GetTalentListByFilterAsync(SearchTalentModel model)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<TalentSuggestion>> GetSuggestionList(string employerOrJobId, bool forJob, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<bool> AddTalentSuggestions(AddTalentSuggestionList selectedTalents)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        #endregion

        #region Conversion Methods

        #region Update from View

        protected void UpdateSkillFromView(AddSkillViewModel model, UserSkill original)
        {
            original.Id = model.Id;
            original.ExperienceLevel = model.Level;
            original.Skill = model.Name;
        }

        protected void UpdateLanguageFromView(AddLanguageViewModel model, UserLanguage original)
        {
            original.Id = model.Id;
            original.LanguageLevel = model.Level;
            original.Language = model.Name;
        }

        protected void UpdateEducationFromView(AddEducationViewModel model, UserEducation original)
        {
            original.Id = model.Id;
            original.Title = model.Title;
            original.Degree = model.Degree;
            original.InstituteName = model.InstituteName;
            original.Country = model.Country;
            original.YearOfGraduation = model.YearOfGraduation;
        }

        protected void UpdateCertificationFromView(AddCertificationViewModel model, UserCertification original)
        {
            original.Id = model.Id;
            original.CertificationName = model.CertificationName;
            original.CertificationFrom = model.CertificationFrom;
            original.CertificationYear = model.CertificationYear;
        }

        protected void UpdateExperienceFromView(ExperienceViewModel model, UserExperience original)
        {
            original.Id = model.Id;
            original.Position = model.Position;
            original.Responsibilities = model.Responsibilities;
            original.Company = model.Company;
            original.Start = model.Start;
            original.End = model.End;
        }

        #endregion

        #region Build Views from Model

        protected AddSkillViewModel ViewModelFromSkill(UserSkill skill)
        {
            return new AddSkillViewModel
            {
                Id = skill.Id,
                Level = skill.ExperienceLevel,
                Name = skill.Skill
            };
        }

        protected AddLanguageViewModel ViewModelFromLanguage(UserLanguage language)
        {
            return new AddLanguageViewModel
            {
                Id = language.Id,
                CurrentUserId = language.UserId,
                Level = language.LanguageLevel,
                Name = language.Language
            };
        }

        protected AddEducationViewModel ViewModelFromEducation(UserEducation education)
        {
            return new AddEducationViewModel
            {
                Id = education.Id,
                Title = education.Title,
                Degree = education.Degree,
                YearOfGraduation = education.YearOfGraduation,
                InstituteName = education.InstituteName,
                Country = education.Country
            };
        }

        protected AddCertificationViewModel ViewModelFromCertification(UserCertification certification)
        {
            return new AddCertificationViewModel
            {
                Id = certification.Id,
                CertificationName = certification.CertificationName,
                CertificationFrom = certification.CertificationFrom,
                CertificationYear = certification.CertificationYear
            };
        }

        protected ExperienceViewModel ViewModelFromExperience(UserExperience experience)
        {
            return new ExperienceViewModel
            {
                Id = experience.Id,
                Position = experience.Position,
                Responsibilities = experience.Responsibilities,
                Company = experience.Company,
                Start = experience.Start,
                End = experience.End
            };
        }

        #endregion

        #endregion

        #region ManageClients

        public async Task<IEnumerable<ClientViewModel>> GetClientListAsync(string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<ClientViewModel> ConvertToClientsViewAsync(Client client, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();
        }

        public async Task<int> GetTotalTalentsForClient(string clientId, string recruiterId)
        {
            //Your code here;
            throw new NotImplementedException();

        }

        public async Task<Employer> GetEmployer(string employerId)
        {
            return await _employerRepository.GetByIdAsync(employerId);
        }
        #endregion

    }
}
