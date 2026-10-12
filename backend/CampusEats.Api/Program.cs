using System.Text;

using CampusEats.Api.Data;
using CampusEats.Api.Models;
using CampusEats.Api.Services;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ------------------------------------
// Add services to the container
// ------------------------------------

builder.Services.AddControllers();

// ------------------------------------
// CORS - let the React dev server call this API
// ------------------------------------

const string FrontendPolicy = "Frontend";

builder.Services.AddCors(opt =>
    opt.AddPolicy(FrontendPolicy, p => p
        .WithOrigins(
            "http://localhost:5173",   // Vite dev server
            "http://127.0.0.1:5173")
        .AllowAnyHeader()
        .AllowAnyMethod()));

builder.Services.AddEndpointsApiExplorer();


// ------------------------------------
// Swagger + JWT configuration
// ------------------------------------

builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        In = ParameterLocation.Header,

        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",

        Description = "Paste ONLY the token - no 'Bearer ' prefix."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
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

            Array.Empty<string>()
        }
    });
});


// ------------------------------------
// PostgreSQL + Entity Framework Core
// ------------------------------------

builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseNpgsql(
        builder.Configuration.GetConnectionString("Default")
    ));


// ------------------------------------
// Menu Service
// ------------------------------------

builder.Services.AddScoped<IMenuService, MenuService>();


// ------------------------------------
// JWT Authentication
// ------------------------------------

var jwt = builder.Configuration.GetSection("Jwt");

var key = Encoding.UTF8.GetBytes(
    jwt["Key"]!
);

builder.Services
    .AddAuthentication(
        JwtBearerDefaults.AuthenticationScheme
    )
    .AddJwtBearer(opt =>
    {
        opt.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidIssuer = jwt["Issuer"],

            ValidateAudience = true,
            ValidAudience = jwt["Audience"],

            ValidateIssuerSigningKey = true,
            IssuerSigningKey =
                new SymmetricSecurityKey(key),

            ValidateLifetime = true
        };
    });


// ------------------------------------
// Authorization
// ------------------------------------

builder.Services.AddAuthorization();


// ------------------------------------
// Build application
// ------------------------------------

var app = builder.Build();


// ------------------------------------
// Seed Menu Items
// ------------------------------------

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider
        .GetRequiredService<AppDbContext>();

    if (!db.MenuItems.Any())
    {
        db.MenuItems.AddRange(
            new MenuItem
            {
                Name = "Kottu Roti",
                Price = 750m,
                Category = "Mains"
            },

            new MenuItem
            {
                Name = "Fried Rice",
                Price = 850m,
                Category = "Mains"
            },

            new MenuItem
            {
                Name = "Watalappan",
                Price = 350m,
                Category = "Dessert"
            }
        );

        db.SaveChanges();
    }
}


// ------------------------------------
// Configure HTTP request pipeline
// ------------------------------------

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Skip the HTTPS redirect in dev: a redirected preflight request fails CORS
if (!app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

// CORS must come before authentication/authorization
app.UseCors(FrontendPolicy);

// Authentication MUST come before Authorization
app.UseAuthentication();    // who are you?  (validates JWT)

app.UseAuthorization();     // may you?      (checks roles)

app.MapControllers();

app.Run();