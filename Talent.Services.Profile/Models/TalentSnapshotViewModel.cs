using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Talent.Common.Models;

namespace Talent.Services.Profile.Models
{
    public class TalentSnapshotViewModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public LinkedAccounts linkedAccounts { get; set; }
        public string PhotoUrl { get; set; }
        public string VideoUrl { get; set; }
        public string CVUrl { get; set; }
        public string CurrentEmployer { get; set; }
        public string CurrentPosition { get; set; }
        public string VisaStatus { get; set; }
        public List<string> Skills { get; set; }
    }
}
