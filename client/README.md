# Next.js Typescript Client

Building blocks for a Next.js client that has Auth0 authentication setup.

Using Next API Routes to handle external API calls, this has been typed by using a TS client.

## Local Run

Install Client with npm

```bash
  npm install
  npm run build:client
  npm run dev
```

In this `build:client` refers to building the TS client from the api-spec.json built by the dotnet server.

In event TS Client does not build, look at the Server readme for more instructions.

## Local Tests

# Automation tests

You will need the following in a `cypress.env.json` file

```
{
  "CYPRESS_USERNAME": ****,
  "CYPRESS_PASSWORD": ****,
  "CYPRESS_DOMAIN": ****
}

```

You can open up Cypress via

```bash
npx cypress open
```

## Environment Variables

These enviroment variables are required in a `.env.local`. For `BASE_URL` set this as your backend service, if you have more than one backend service add new variables. Look at `getApiClient`for a plan on how to set up additional clients.

```bash
AUTH0_SECRET=
AUTH0_BASE_URL=
AUTH0_ISSUER_BASE_URL=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
BASE_URL=
```

## Auth0

Requires Auth0 account and knowledge, please look at the Auth0 documentation for further details [Auth0 Next.js Quickstart](https://auth0.com/docs/quickstart/webapp/nextjs).
