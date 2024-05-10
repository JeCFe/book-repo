# Dotnet server

Simple Dotnet mininal API backed boilerplate.

## Local run

# Env

Inside an _appsettings.local.json_ or _appsettings.development.json_ include the following from your Auth0 details

```
  "Auth0": {
    "Domain": *****,
    "ClientId": ****,
    "ClientSecret": ****,
    "Audience": ****
  }
```

Run the service by:

```bash
  dotnet run --project Server
```

This will open a website you can view the swagger UI by going to:

```
http://localhost:SOMEPORT/swagger/index.html
```

## Build

```bash
cd server/Server
dotnet publish --configuration Release
```

## Local Tests

# Automation tests

You will need the following in a `cypress.env.json` file

```
{
  "auth_audience": ****,
  "auth_url": ****,
  "auth_client_id": ****,
  "auth_client_secret": ****,
  "CYPRESS_USERNAME": ****,
  "CYPRESS_PASSWORD": ****,
}

```

You can open up Cypress via

```bash
npx cypress open
```

# Unit tests

```bash
dotnet test
```

## Generate Swagger

To generate the swagger `api-spec.json` run the following command.

```
dotnet test
```

This will run the project xunit tests, one of these tests is the comparing and generation of a swagger file (the frontend required this to build a TS client).
