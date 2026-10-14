
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
// CORS - Allow the Vercel frontend and local development
// ------------------------------------

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy
            .WithOrigins(
                "https://campus-eats-lab11.vercel.app",
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// ------------------------------------
// Add services to the container
// ------------------------------------

builder.Services.AddControllers();
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

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(
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
var key = Encoding.UTF8.GetBytes(jwt["Key"]!);

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new()
        {
            ValidateIssuer = true,
            ValidIssuer = jwt["Issuer"],

            ValidateAudience = true,
            ValidAudience = jwt["Audience"],

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),

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

if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

// CORS must run before authentication and endpoint execution.
app.UseCors("FrontendPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
