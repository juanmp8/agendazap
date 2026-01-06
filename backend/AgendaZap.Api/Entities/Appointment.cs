namespace AgendaZap.Api.Entities;

public class Appointment
{
    public Guid Id { get; set; }

    public DateTime Date { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string CustomerPhone { get; set; } = string.Empty;

    public int DurationMinutes { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
