namespace Server;

using System.Reflection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Server.Auth0;
using Server.Context;
using Server.Domain;
using Server.Domain.Commands;
using Server.filters;
using Server.OpenLibrary;
using Server.OpenLibrary.Blob;
using Server.Providers;
using Server.Routes;

public class Program
{
    static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        IConfiguration configuration = builder.Configuration;

        if (builder.Environment.IsDevelopment())
        {
            builder.Configuration.AddJsonFile("appsettings.development.json", true);
        }
        var dbConnectionString = configuration.GetConnectionString("db");

        builder
            .Services
            .AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.Authority = $"https://{configuration["Auth0:Domain"]}";
                options.Audience = configuration["Auth0:Audience"];
            });
        builder.Services.AddHttpContextAccessor();

        builder
            .Services
            .AddDbContext<BookRepoContext>(options =>
            {
                options.UseSqlServer(
                    dbConnectionString,
                    b => b.MigrationsAssembly("Server.Domain")
                );
            });

        builder.Services.AddHealthChecks();
        builder.Services.AddEndpointsApiExplorer();
        builder
            .Services
            .AddSwaggerGen(options =>
            {
                options.SwaggerDoc(
                    "v1",
                    new OpenApiInfo { Version = "0.1.0", Title = "Backend Service" }
                );
                options.SchemaFilter<NullabilityFilter>();
                options.AddSecurityDefinition(
                    "Bearer",
                    new OpenApiSecurityScheme
                    {
                        Name = "Authorization",
                        Description = "JWT Authorization header using the Bearer scheme",
                        In = ParameterLocation.Header,
                        Type = SecuritySchemeType.Http,
                        Scheme = "bearer",
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    }
                );

                options.AddSecurityRequirement(
                    new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            new string[] { }
                        }
                    }
                );
                options.ResolveConflictingActions(x => x.First());
                options.AddSecurityDefinition(
                    "oauth2",
                    new OpenApiSecurityScheme
                    {
                        Type = SecuritySchemeType.OAuth2,
                        BearerFormat = "JWT",
                        Flows = new OpenApiOAuthFlows
                        {
                            Implicit = new OpenApiOAuthFlow
                            {
                                TokenUrl = new Uri(
                                    $"https://{configuration["Auth0:Domain"]}/oauth/token"
                                ),
                                AuthorizationUrl = new Uri(
                                    $"https://{configuration["Auth0:Domain"]}/authorize?audience={configuration["Auth0:Audience"]}"
                                ),
                            }
                        }
                    }
                );
                options.AddSecurityRequirement(
                    new OpenApiSecurityRequirement
                    {
                        {
                            new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "oauth2"
                                }
                            },
                            new string[] { }
                        }
                    }
                );
            });
        builder
            .Services
            .AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });
        builder.Services.AddHttpClient();
        builder.Services.AddScoped<IUserContext, UserContext>();
        builder.Services.AddTransient<ICustomerProvider, CustomerProvider>();
        builder.Services.AddTransient<IBookshelfProvider, BookshelfProvider>();
        builder.Services.RegisterCommandHandlers<BookRepoContext>();
        builder
            .Services
            .Configure<Auth0Options>(builder.Configuration.GetSection("Auth0Management"));
        builder.Services.AddTransient<IAuth0Token, Auth0Token>();
        builder.Services.AddTransient<IAuth0Client, Auth0Client>();

        builder.Services.AddTransient<IOpenLibraryCient, OpenLibraryClient>();
        builder.Services.Decorate<IOpenLibraryCient, OpenLibraryClientDecorator>();

        builder.Services.Configure<BlobOptions>(builder.Configuration.GetSection("Blob"));
        builder.Services.AddSingleton<IBlobClient, BlobClient>();

        builder.Services.AddAuthorization();

        builder
            .Services
            .AddMediatR(
                config => config.RegisterServicesFromAssemblies(Assembly.GetExecutingAssembly())
            );
        builder.Services.AddAutoMapper(typeof(Program));

        var app = builder.Build();
        if (app.Configuration.GetValue<bool>("migrateDB"))
        {
            using (var scope = app.Services.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<BookRepoContext>();
                await dbContext.Database.MigrateAsync();
            }
        }
        app.UseSwagger();
        app.UseSwaggerUI(settings =>
        {
            settings.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1.0");
            settings.OAuthClientId(configuration["Auth0:ClientId"]);
            settings.OAuthClientSecret(configuration["Auth0:ClientSecret"]);
            settings.OAuthUsePkce();
        });

        app.UseCors();
        app.UseAuthentication();
        app.UseAuthorization();

        app.MapHealthChecks("/healthz");
        app.MapGroup("/customer").MapCustomerEndpoints();
        app.MapGroup("/action").MapActionEndpoints().RequireAuthorization();
        app.MapGroup("/bookshelf").MapBookshelfEndpoints();
        app.MapGroup("/book").MapBookEndpoints();
        app.Run();
    }
}
