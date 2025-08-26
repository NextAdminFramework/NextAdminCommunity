using System.Text.Json;

namespace NextAdmin.Core
{
    public static class Http
    {


        public static async Task<string?> TryGetAsync(string url)
        {
            try
            {
                var httpClient = new HttpClient();
                var response = await httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }
                string httpResponseBody = await response.Content.ReadAsStringAsync();
                return httpResponseBody;
            }
            catch
            {
                return null;
            }
        }

        public static async Task<TResponseData?> TryGetAsync<TResponseData>(string url)
            where TResponseData : class
        {
            try
            {
                var httpResponseBody = await TryGetAsync(url);
                if (httpResponseBody == null)
                {
                    return null;
                }
                return JsonSerializer.Deserialize<TResponseData>(httpResponseBody);
            }
            catch
            {
                return null;
            }
        }


        public static async Task<string?> TryPostJsonAsync(string url, object data)
        {
            try
            {
                var httpClient = new HttpClient();
                string jsonData = data.ToJSON(true);
                var content = new StringContent(jsonData);
                content.Headers.ContentType.MediaType = "application/json";
                var response = await httpClient.PostAsync(url, content);
                if (!response.IsSuccessStatusCode)
                {
                    return null;
                }
                string httpResponseBody = await response.Content.ReadAsStringAsync();
                return httpResponseBody;
            }
            catch
            {
                return null;
            }

        }

        public static async Task<TResponseData?> TryPostJsonAsync<TResponseData>(string url, object data)
            where TResponseData : class
        {
            try
            {
                var httpResponseBody = await TryPostJsonAsync(url, data);
                if (httpResponseBody == null)
                {
                    return null;
                }
                return JsonSerializer.Deserialize<TResponseData>(httpResponseBody);
            }
            catch
            {
                return null;
            }
        }

    }

}
