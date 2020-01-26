using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Amazon.S3.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Talent.Common.Aws;
using Talent.Common.Contracts;

namespace Talent.Common.Services
{
    public class FileService : IFileService
    {
        private readonly IHostingEnvironment _environment;
        private readonly string _bucket;
        private readonly string _tempFolder;
        private IAwsService _awsService;

        public FileService(IHostingEnvironment environment,
            IAwsService awsService)
        {
            _environment = environment;
            _bucket = "zacksstorage";
            _tempFolder = "images\\";
            _awsService = awsService;
        }

        public async Task<string> GetFileURL(string id, FileType type)
        {
            return await _awsService.GetStaticUrl(id, _bucket);
        }

        public async Task<string> SaveFile(IFormFile file, FileType type)
        {
            return await SaveFileGeneral(file, _bucket, _tempFolder, false);
        }

        public async Task<bool> DeleteFile(string id, FileType type)
        {
            return await DeleteFileGeneral(id, _bucket);
        }


        #region Document Save Methods

        private async Task<string> SaveFileGeneral(IFormFile file, string bucket, string folder, bool isPublic)
        {
            var fileName = Guid.NewGuid() + file.FileName;
            using (var stream = new MemoryStream())
            {
                file.CopyTo(stream);
                if (await _awsService.PutFileToS3(fileName, stream, bucket, isPublic))
                {
                    return fileName;
                }
            }

            return null;
        }

        private async Task<bool> DeleteFileGeneral(string id, string bucket)
        {
            return await _awsService.RemoveFileFromS3(id, bucket);
        }
        #endregion
    }
}
