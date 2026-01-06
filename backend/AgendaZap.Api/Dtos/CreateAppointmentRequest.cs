namespace AgendaZap.Api.Dtos;

public class CreateAppointmentRequest
{
    public DateTime Date { get; set; }

    public int DurationMinutes { get; set; }

    public string CustomerName { get; set; } = string.Empty;

    public string CustomerPhone { get; set; } = string.Empty;
}
