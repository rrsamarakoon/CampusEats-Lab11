FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["backend/CampusEats.Api/CampusEats.Api.csproj", "backend/CampusEats.Api/"]
RUN dotnet restore "backend/CampusEats.Api/CampusEats.Api.csproj"

COPY ["backend/CampusEats.Api/", "backend/CampusEats.Api/"]
WORKDIR /src/backend/CampusEats.Api
RUN dotnet publish "CampusEats.Api.csproj" \
    --configuration Release \
    --output /app/publish \
    --no-restore \
    /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://0.0.0.0:8080
EXPOSE 8080

COPY --from=build /app/publish .
USER $APP_UID
ENTRYPOINT ["dotnet", "CampusEats.Api.dll"]
