using System.Text.Json.Serialization;

namespace SevenDayForecast_BE.JsonClassStructures
{
    public static class GeocodeResponse
    {
        // Root myDeserializedClass = JsonSerializer.Deserialize<Root>(myJsonResponse);
        public class Address
        {
            [JsonPropertyName("zip")]
            public string? zip { get; set; }

            [JsonPropertyName("city")]
            public string? city { get; set; }

            [JsonPropertyName("street")]
            public string? street { get; set; }

            [JsonPropertyName("state")]
            public string? state { get; set; }
        }

        public class AddressComponents
        {
            [JsonPropertyName("zip")]
            public string? zip { get; set; }

            [JsonPropertyName("streetName")]
            public string? streetName { get; set; }

            [JsonPropertyName("preType")]
            public string? preType { get; set; }

            [JsonPropertyName("city")]
            public string? city { get; set; }

            [JsonPropertyName("preDirection")]
            public string? preDirection { get; set; }

            [JsonPropertyName("suffixDirection")]
            public string? suffixDirection { get; set; }

            [JsonPropertyName("fromAddress")]
            public string? fromAddress { get; set; }

            [JsonPropertyName("state")]
            public string? state { get; set; }

            [JsonPropertyName("suffixType")]
            public string? suffixType { get; set; }

            [JsonPropertyName("toAddress")]
            public string? toAddress { get; set; }

            [JsonPropertyName("suffixQualifier")]
            public string? suffixQualifier { get; set; }

            [JsonPropertyName("preQualifier")]
            public string? preQualifier { get; set; }
        }

        public class AddressMatch
        {
            [JsonPropertyName("tigerLine")]
            public TigerLine? tigerLine { get; set; }

            [JsonPropertyName("coordinates")]
            public Coordinates? coordinates { get; set; }

            [JsonPropertyName("addressComponents")]
            public AddressComponents? addressComponents { get; set; }

            [JsonPropertyName("matchedAddress")]
            public string? matchedAddress { get; set; }
        }

        public class Benchmark
        {
            [JsonPropertyName("isDefault")]
            public bool isDefault { get; set; }

            [JsonPropertyName("benchmarkDescription")]
            public string? benchmarkDescription { get; set; }

            [JsonPropertyName("id")]
            public string? id { get; set; }

            [JsonPropertyName("benchmarkName")]
            public string? benchmarkName { get; set; }
        }

        public class Coordinates
        {
            [JsonPropertyName("x")]
            public double x { get; set; }

            [JsonPropertyName("y")]
            public double y { get; set; }
        }

        public class Input
        {
            [JsonPropertyName("address")]
            public Address? address { get; set; }

            [JsonPropertyName("benchmark")]
            public Benchmark? benchmark { get; set; }
        }

        public class Result
        {
            [JsonPropertyName("input")]
            public Input? input { get; set; }

            [JsonPropertyName("addressMatches")]
            public List<AddressMatch>? addressMatches { get; set; }
        }

        public class Root
        {
            [JsonPropertyName("result")]
            public Result? result { get; set; }
            public string getWfoLocationParams()
            {
                string coordx = result?.addressMatches?[0]?.coordinates?.x.ToString() ?? "0";
                string coordy = result?.addressMatches?[0]?.coordinates?.y.ToString() ?? "0";
                return $"{coordy}%2C{coordx}";
            }
        }

        public class TigerLine
        {
            [JsonPropertyName("side")]
            public string? side { get; set; }

            [JsonPropertyName("tigerLineId")]
            public string? tigerLineId { get; set; }
        }


    }
}
