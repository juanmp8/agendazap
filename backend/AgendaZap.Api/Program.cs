using AgendaZap.Api.Data;
using AgendaZap.Api.Dtos;
using AgendaZap.Api.Entities;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("Default")
    );
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AngularDev", policy =>
    {
        policy
            .WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AngularDev");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast =  Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast");

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapPost("/appointments", async (
    CreateAppointmentRequest request,
    AppDbContext db
) =>
{
    // Validação básica
    if (request.DurationMinutes <= 0)
        return Results.BadRequest("Duration must be greater than zero.");

    var start = DateTime.SpecifyKind(request.Date, DateTimeKind.Utc);
    var end = start.AddMinutes(request.DurationMinutes);

    // Verificar conflito
    var hasConflict = await db.Appointments.AnyAsync(a =>
        a.Date < end &&
        a.Date.AddMinutes(a.DurationMinutes) > start
    );

    if (hasConflict)
        return Results.Conflict("Time slot already booked.");

    var appointment = new Appointment
    {
        Id = Guid.NewGuid(),
        Date = start,
        DurationMinutes = request.DurationMinutes,
        CustomerName = request.CustomerName,
    CustomerPhone = request.CustomerPhone
};


    db.Appointments.Add(appointment);
    await db.SaveChangesAsync();

    return Results.Created($"/appointments/{appointment.Id}", appointment);
});

app.MapGet("/appointments", async (
    DateTime date,
    AppDbContext db
) =>
{
    var dayStart = DateTime.SpecifyKind(date.Date, DateTimeKind.Utc);
    var dayEnd = dayStart.AddDays(1);

    var appointments = await db.Appointments
        .Where(a => a.Date >= dayStart && a.Date < dayEnd)
        .OrderBy(a => a.Date)
        .Select(a => new AppointmentResponse
        {
            Id = a.Id,
            Date = a.Date,
            DurationMinutes = a.DurationMinutes,
            CustomerName = a.CustomerName,
            CustomerPhone = a.CustomerPhone
        })
        .ToListAsync();

    return Results.Ok(appointments);
});

app.MapPut("/appointments/{id:guid}", async (
    Guid id,
    UpdateAppointmentRequest request,
    AppDbContext db
) =>
{
    var appointment = await db.Appointments.FindAsync(id);
    if (appointment is null)
        return Results.NotFound();

    var start = DateTime.SpecifyKind(request.Date, DateTimeKind.Utc);
    var end = start.AddMinutes(request.DurationMinutes);

    var hasConflict = await db.Appointments.AnyAsync(a =>
        a.Id != id &&
        a.Date < end &&
        a.Date.AddMinutes(a.DurationMinutes) > start
    );

    if (hasConflict)
        return Results.Conflict("Time slot already booked.");

    appointment.Date = start;
    appointment.DurationMinutes = request.DurationMinutes;
    appointment.CustomerName = request.CustomerName;
    appointment.CustomerPhone = request.CustomerPhone;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapDelete("/appointments/{id:guid}", async (
    Guid id,
    AppDbContext db
) =>
{
    var appointment = await db.Appointments.FindAsync(id);
    if (appointment is null)
        return Results.NotFound();

    db.Appointments.Remove(appointment);
    await db.SaveChangesAsync();

    return Results.NoContent();
});


app.Run("http://0.0.0.0:8080");

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
