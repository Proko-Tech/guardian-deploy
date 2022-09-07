const app = require('../../app/index');
const supertest = require('supertest');

jest.mock('../../database/models/CoreDeploymentMappingsModel');
jest.mock('../../services/S3');
jest.mock('../../services/Deploy');
jest.mock('../../services/CreateFile');
jest.mock('../../services/Slack');

const CoreDeploymentMappingModel = require('../../database/models/CoreDeploymentMappingsModel');
const S3 = require('../../services/S3');
const Deploy = require('../../services/Deploy');
const CreateFile = require('../../services/CreateFile');

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
         },
       ];
     };

        S3.getByFilename = async (fileName) => {
          expect(fileName).toBe('testFile');
          return Buffer.from('...');
        };

        CreateFile.createFile = async (content) => {
          return 'somePath';
        }

        Deploy.runDeployment =
     async (host, username, privateKey, repoPath, deployService, callback) => {
       expect(host).toBe('testHost');
       expect(username).toBe('testUser');
       expect(repoPath).toBe('testRepo');
       expect(deployService).toBe('PM2');
       callback({ok: true, error: null})
     };

        const res = await supertest(app)
            .post('/hook/github/')
            .send({
              ref: 'refs/heads/master',
              repository: {
                id: 1,
              },
            });
        expect(res.status).toBe(200);
      });

  it('POST /hook/github should return status 400 with no mapping',
      async () => {
        CoreDeploymentMappingModel.getByRepositoryIdAndBranchName =
        async (repositoryId, branchName) => {
          return [];
        };

        const res = await supertest(app)
            .post('/hook/github/')
            .send({
              ref: 'refs/heads/master',
              repository: {
                id: 1,
              },
            });
        expect(res.status).toBe(404);
      });
});
