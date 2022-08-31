const app = require('../../app/index');
const supertest = require('supertest');

jest.mock('../../database/models/CoreDeploymentMappingsModel');
jest.mock('../../services/S3');
jest.mock('../../services/Deploy');

const CoreDeploymentMappingModel = require('../../database/models/CoreDeploymentMappingsModel');
const S3 = require('../../services/S3');
const Deploy = require('../../services/Deploy');

describe('Test deployment', () => {
  it('POST /hook/github should return status 200 with successful deployment',
    async () => {
   CoreDeploymentMappingModel.getByRepositoryIdAndBranchName =
     async (repositoryId, branchName) => {
     return [
       {
         repository_id: repositoryId,
         default_branch: branchName,
         target_host: 'testHost',
         server_username: 'testUser',
         access_key_file_name: 'testFile',
         repo_path: 'testRepo',
         deploy_service: 'PM2',
       }
     ]
   }

   S3.getByFilename = async (fileName) => {
     expect(fileName).toBe('testFile');
     return Buffer.from('...');
   }

   Deploy.runDeployment =
     async (host, username, privateKey, repoPath, deployService) => {
     expect(host).toBe('testHost');
     expect(username).toBe('testUser');
     expect(Buffer.compare(privateKey, Buffer.from('...')))
       .toBe(0);
     expect(repoPath).toBe('testRepo');
     expect(deployService).toBe('PM2');
     return {ok:true};
   }

   const res = await supertest(app)
     .post('/hook/github/')
     .send({
       ref: 'refs/heads/master',
       repository: {
         id: 1,
       }
     });
   expect(res.status).toBe(200);
  });

  it('POST /hook/github should return status 400 with no mapping',
    async () => {
      CoreDeploymentMappingModel.getByRepositoryIdAndBranchName =
        async (repositoryId, branchName) => {
          return []
        }

      const res = await supertest(app)
        .post('/hook/github/')
        .send({
          ref: 'refs/heads/master',
          repository: {
            id: 1,
          }
        });
      expect(res.status).toBe(404);
    });
});
