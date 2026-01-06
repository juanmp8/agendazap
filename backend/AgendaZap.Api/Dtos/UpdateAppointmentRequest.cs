namespace AgendaZap.Api.Dtos;

public class UpdateAppointmentRequest
{
    public DateTime Date { get; set; }
    public int DurationMinutes { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
}
