FROM mcr.microsoft.com/dotnet/aspnet:8.0

WORKDIR /app
COPY ./Server/bin/Release/net8.0/publish .

ENV ASPNETCORE_HTTP_PORTS=80
EXPOSE 80

ENTRYPOINT [ "dotnet", "Server.dll" ]