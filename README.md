# Next-dotnet-auth0

A basic implementation of Auth0 using Next.js and dotnet minimal APIs that can be used as a template for future projects.

Once this repo is cloned / forked / used setup as below, once completed either locally or via Azure visit the Next.js web client. Clicking the `Ping Api` button should result in a return message of `Woo Authed` this will mean that the backend and frontend have an authenticated API using Auth0 credentials connected.

Forking / using this template will require some setup for Auth0, Azure, and Github environment secret setup, the following is required: 

### Azure
Set up the following via Azure Portal 
- Resource Group
- Azure Container Registry
- 2x Azure Container Apps
- Azure Key Vault

### Github Environment
<img width="189" alt="Screenshot 2024-05-05 at 23 39 36" src="https://github.com/JeCFe/next-dotnet-auth0/assets/38367384/3d12c1a8-3b0c-4a51-bca0-3ae3b2956931">


## Deployment
CICD pipelines have been setup to run unit and cypress testing for both client and server. Automatic deployment to Azure Container Registry and Azure Container Apps has been configured, you can view the template next app here [Next Template](https://next-template.jessicafealy.dev)

## Frontend

Read the frontend README

```Basb
cd client
```

## Backend

Read the backend README

```Basb
cd server
```
