using System.Net.Http.Headers;
using System;
using System.Text.Json.Serialization;
using System.Text.Json;
using System.Security.Cryptography.X509Certificates;
using SevenDayForecast_BE.JsonClassStructures;
using Newtonsoft.Json;


var policyName = "_myAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: policyName,
        builder =>
        {
            builder
                .WithOrigins("http://localhost:3000") // specifying the allowed origin
                .WithMethods("GET") // defining the allowed HTTP method
                .AllowAnyHeader(); // allowing any header to be sent
        });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseCors(policyName);

static async Task<GeocodeResponse.Root?> GetGeoCodeResponse(string parameters)
{
    const string GeoCodingBaseURL = "https://geocoding.geo.census.gov/geocoder/locations/address";
    GeocodeResponse.Root? geoCodeResponse = null;
    HttpClient client = new HttpClient();
    client.BaseAddress = new Uri(GeoCodingBaseURL);
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    HttpResponseMessage response = await client.GetAsync(parameters).ConfigureAwait(false);
    if (response.IsSuccessStatusCode)
    {
        var jsonString = await response.Content.ReadAsStringAsync();
        geoCodeResponse = JsonConvert.DeserializeObject<GeocodeResponse.Root>(jsonString);
    }
    return geoCodeResponse;
}

static async Task<WfoPointResponse.Root?> GetWfoPointResponse(string parameters)
{
    const string WFOLocationBaseURL = "https://api.weather.gov/points/";
    WfoPointResponse.Root? wfoPointResponse = null;
    HttpClient client = new HttpClient();
    client.BaseAddress = new Uri(WFOLocationBaseURL);
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/geo+json"));
    client.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("zackstehura", "1.0"));
    HttpResponseMessage response = await client.GetAsync(parameters).ConfigureAwait(false);
    if (response.IsSuccessStatusCode)
    {
        var jsonString = await response.Content.ReadAsStringAsync();
        wfoPointResponse = JsonConvert.DeserializeObject<WfoPointResponse.Root>(jsonString);
    }
    return wfoPointResponse;
}

static async Task<Forecast[]?> GetForecast(string parameters)
{
    const string ForecastBaseURL = "https://api.weather.gov/gridpoints/";

    Forecast[]? forecasts = null;
    GeocodeResponse.Root? geoCodeResponse = GetGeoCodeResponse(parameters).Result;
    if(geoCodeResponse == null) return null;
    WfoPointResponse.Root? wfoPointResponse = GetWfoPointResponse(geoCodeResponse.getWfoLocationParams()).Result;
    if (wfoPointResponse == null) return null;

    HttpClient client = new HttpClient();
    client.BaseAddress = new Uri(ForecastBaseURL);
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/geo+json"));
    client.DefaultRequestHeaders.UserAgent.Add(new ProductInfoHeaderValue("zackstehura", "1.0"));
    HttpResponseMessage response = await client.GetAsync(wfoPointResponse.getWfoForecastParams()).ConfigureAwait(false);
    if (response.IsSuccessStatusCode)
    {
        var jsonString = await response.Content.ReadAsStringAsync();
        forecasts = GetForecasts(JsonConvert.DeserializeObject<ForecastResponse.Root>(jsonString));
    }

    return forecasts;
}

static Forecast[] GetForecasts(ForecastResponse.Root? forecastResponse)
{
    Forecast[] f = new Forecast[14];
    for(int i  = 0; i < f.Length; i++)
    {
        ForecastResponse.Period? p = forecastResponse?.Properties?.Periods?[i];
        f[i] = new Forecast(p?.Number ?? 0, p?.Name ?? "", p?.ShortForecast ?? "", p?.DetailedForecast ?? ""
            , p?.ProbabilityOfPrecipitation?.Value ?? 0, p?.Temperature ?? 0);
    }

    return f;
}


app.MapGet("/{streetAddress}/{city}/{state}/{zip}", (string streetAddress, string city, string state, string zip) =>
{
    Location location = new Location(streetAddress, city, state, zip);
    return GetForecast(location.GeocodingParam());    
})
.WithName("GetForecast");


app.Run();

[Serializable]
public record Forecast(int id, string name, string shortDesc, string longDesc, int probOfPrecip, decimal temperature);
internal record Location(string streetAddress, string cityName, string stateName, string zipCode)
{
    public string GeocodingParam()
    {
        string s = $"address?street={streetAddress}";
        if (!string.IsNullOrEmpty(cityName)) s += $"&city={cityName}&state={stateName}";
        if (!string.IsNullOrEmpty(zipCode)) s += $"&zip={zipCode}";
        s += "&benchmark=Public_AR_Current&format=json";
        return s;
    }
}


internal record WeatherForecast(DateTime Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}