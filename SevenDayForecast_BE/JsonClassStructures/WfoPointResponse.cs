using System.Text.Json.Serialization;

namespace SevenDayForecast_BE.JsonClassStructures
{
    public class WfoPointResponse
    {
        // Root myDeserializedClass = JsonSerializer.Deserialize<Root>(myJsonResponse);
        public class Bearing
        {
            [JsonPropertyName("unitCode")]
            public string? UnitCode { get; set; }

            [JsonPropertyName("value")]
            public int? Value { get; set; }
        }

        public class Distance
        {
            [JsonPropertyName("unitCode")]
            public string? UnitCode { get; set; }

            [JsonPropertyName("value")]
            public double? Value { get; set; }
        }

        public class Geometry
        {
            [JsonPropertyName("type")]
            public string? Type { get; set; }

            [JsonPropertyName("coordinates")]
            public List<double?>? Coordinates { get; set; }
        }

        public class Properties
        {
            [JsonPropertyName("@id")]
            public string? Id { get; set; }

            [JsonPropertyName("@type")]
            public string? Type { get; set; }

            [JsonPropertyName("cwa")]
            public string? Cwa { get; set; }

            [JsonPropertyName("forecastOffice")]
            public string? ForecastOffice { get; set; }

            [JsonPropertyName("gridId")]
            public string? GridId { get; set; }

            [JsonPropertyName("gridX")]
            public int? GridX { get; set; }

            [JsonPropertyName("gridY")]
            public int? GridY { get; set; }

            [JsonPropertyName("forecast")]
            public string? Forecast { get; set; }

            [JsonPropertyName("forecastHourly")]
            public string? ForecastHourly { get; set; }

            [JsonPropertyName("forecastGridData")]
            public string? ForecastGridData { get; set; }

            [JsonPropertyName("observationStations")]
            public string? ObservationStations { get; set; }

            [JsonPropertyName("relativeLocation")]
            public RelativeLocation? RelativeLocation { get; set; }

            [JsonPropertyName("forecastZone")]
            public string? ForecastZone { get; set; }

            [JsonPropertyName("county")]
            public string? County { get; set; }

            [JsonPropertyName("fireWeatherZone")]
            public string? FireWeatherZone { get; set; }

            [JsonPropertyName("timeZone")]
            public string? TimeZone { get; set; }

            [JsonPropertyName("radarStation")]
            public string? RadarStation { get; set; }

            [JsonPropertyName("city")]
            public string? City { get; set; }

            [JsonPropertyName("state")]
            public string? State { get; set; }

            [JsonPropertyName("distance")]
            public Distance? Distance { get; set; }

            [JsonPropertyName("bearing")]
            public Bearing? Bearing { get; set; }
        }

        public class RelativeLocation
        {
            [JsonPropertyName("type")]
            public string? Type { get; set; }

            [JsonPropertyName("geometry")]
            public Geometry? Geometry { get; set; }

            [JsonPropertyName("properties")]
            public Properties? Properties { get; set; }
        }

        public class Root
        {
            [JsonPropertyName("@context")]
            public List<object>? Context { get; set; }

            [JsonPropertyName("id")]
            public string? Id { get; set; }

            [JsonPropertyName("type")]
            public string? Type { get; set; }

            [JsonPropertyName("geometry")]
            public Geometry? Geometry { get; set; }

            [JsonPropertyName("properties")]
            public Properties? Properties { get; set; }
            public string getWfoForecastParams()
            {
                string gridId = Properties?.Id ?? "CLE";
                string gridX = Properties?.GridX.ToString() ?? "0";
                string gridY = Properties?.GridY.ToString() ?? "0";
                return $"{gridId}/{gridX},{gridY}/forecast";
            }
        }


    }
}
