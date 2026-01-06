namespace AgendaZap.Api.Dtos;

public class AppointmentResponse
{
    public Guid Id { get; set; }
    public DateTime Date { get; set; }
    public int DurationMinutes { get; set; }
    public string CustomerName { get; set; } = string.Empty;
}
