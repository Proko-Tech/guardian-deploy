# Guardian Deploy 🫡

![Lint](https://github.com/Proko-Tech/guardian-deploy/actions/workflows/lint.yml/badge.svg)
![Build](https://github.com/Proko-Tech/guardian-deploy/actions/workflows/node.js.yml/badge.svg)

## Introduction
Guardian Deploy is a server tool that deploys the newest updates from a github repo(through github webhook) into an EC2
instance.

AWS provides cloud deployment and hosting services. A common suite or product people use to continuously deploy their
code into a cloud server is using: AWS CodePipeline which listens to a source control artifact(github, bitbucket, etc),
initiates deployment and build process into services like AWS Elastic Beanstalk.

[Design Doc](https://docs.google.com/document/d/1BJuRVHccgxoZYrTCYMLjVhhjOGTlrSmhwRjgZ8Y3jeQ/edit?usp=sharing)
