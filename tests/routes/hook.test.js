const app = require('../../app/index');
const supertest = require('supertest');

jest.mock('../../database/models/CoreDeploymentMappingsModel');
jest.mock('../../services/S3');
jest.mock('../../services/Deploy');
jest.mock('../../services/CreateFile');
jest.mock('../../services/Slack');
jest.mock('../../services/Mailer');

const CoreDeploymentMappingModel = require('../../database/models/CoreDeploymentMappingsModel');
const S3 = require('../../services/S3');
const Deploy = require('../../services/Deploy');
const CreateFile = require('../../services/CreateFile');
const TasksModel = require('../../database/models/TasksModel');
const Mailer = require('../../services/Mailer');

describe('Test deployment', () => {
  it('POST /hook/github should return status 200 with successful deployment',
      async () => {
        CoreDeploymentMappingModel.getByRepositoryIdAndBranchName =
     async (repositoryId, branchName) => {
       return [
         {
           id: 1,
           repository_id: repositoryId,
           default_branch: branchName,
           target_host: 'testHost',
           server_username: 'testUser',
           access_key_file_name: 'testFile',
           repo_path: 'testRepo',
           deploy_service: 'PM2',
           owners: 'email@email.com',
         },
       ];
     };

        S3.getByFilename = async (fileName) => {
          expect(fileName).toBe('testFile');
          return Buffer.from('...');
        };

        TasksModel.insert = (payload) => {
          expect(payload.code_deployment_mappings_id).toBe(1);
          return [1];
        }

        Mailer.sendTextEmail = async (emailPayload) => {
          expect(emailPayload.to).toBe('email@email.com');
        }

        Mailer.sendEmailTemplate = (payload, emailPayload) => {
          console.log('amazingly here')
          expect(payload.to).toBe('email@email.com');
          expect(emailPayload.stdout).toBe('stdout');
        }

        CreateFile.createFile = async (content) => {
          return 'somePath';
        };

        Deploy.runDeployment =
     async (host, username, privateKey, repoPath, deployService, callback) => {
       expect(host).toBe('testHost');
       expect(username).toBe('testUser');
       expect(repoPath).toBe('testRepo');
       expect(deployService).toBe('PM2');
       callback({ok: true, error: null, stdout: 'stdout', stderr: 'stderr'});
     };

        TasksModel.updateById = (id, payload) => {
          expect(id).toBe(1);
        }

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
