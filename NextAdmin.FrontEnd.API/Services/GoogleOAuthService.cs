using Google.Apis.Auth.OAuth2;
using Google.Apis.Auth.OAuth2.Flows;
using Google.Apis.Auth.OAuth2.Responses;
using Google.Apis.Oauth2.v2;
using Google.Apis.Oauth2.v2.Data;
using Google.Apis.Services;

namespace NextAdmin.FrontEnd.API.Services
{
    public class GoogleOAuthService
    {

        private string _clientId;

        private string _clientSecret;

        private string _redirectionUrl;

        private List<string> _scopes;

        private string _userTypeId;

        public virtual GoogleAuthorizationCodeFlow Flow => new GoogleAuthorizationCodeFlow(new GoogleAuthorizationCodeFlow.Initializer
        {
            ClientSecrets = new ClientSecrets
            {
                ClientId = _clientId,
                ClientSecret = _clientSecret,
            },
            Scopes = _scopes
        });

        public virtual string AuthUrl => Flow.CreateAuthorizationCodeRequest(_redirectionUrl).Build().ToString();

        public GoogleOAuthService(string clientId, string clientSecret, string redirectionUrl, List<string>? scopes = null, string userTypeId = "FrontEndUser")
        {
            _clientId = clientId;
            _clientSecret = clientSecret;
            _redirectionUrl = redirectionUrl;
            _userTypeId = userTypeId;
            if (scopes == null)
            {
                scopes = new string[] { Oauth2Service.Scope.UserinfoEmail }.ToList();
            }
            _scopes = scopes;
        }


        public async Task<TokenResponse?> GetTokenFromCode(string code)
        {
            try
            {
                var token = await Flow.ExchangeCodeForTokenAsync(_userTypeId, code, _redirectionUrl, CancellationToken.None);
                return token;
            }
            catch
            {
                return null;
            }
        }

        public async Task<TokenResponse?> GetTokenFromRefreshToken(string refreshToken)
        {
            try
            {
                var token = await Flow.RefreshTokenAsync(_userTypeId, refreshToken, CancellationToken.None);
                return token;
            }
            catch
            {
                return null;
            }
        }


        public UserCredential GetUserCredential(TokenResponse tokenResponse)
        {
            return new UserCredential(Flow, _userTypeId, tokenResponse);
        }

        public UserCredential? TryGetUserCredential(TokenResponse tokenResponse)
        {
            try
            {
                return GetUserCredential(tokenResponse);
            }
            catch
            {
                return null;
            }
        }

        public async Task<Userinfo?> GetUserInfo(UserCredential userCredential)
        {
            var oauthSerivce = new Oauth2Service(new BaseClientService.Initializer()
            {
                HttpClientInitializer = userCredential,
            });
            var userInfo = await oauthSerivce.Userinfo.Get().ExecuteAsync();
            return userInfo;
        }


        public async Task<GoogleAuthInfo?> AuthUserFromCode(string code)
        {
            var tokenResponse = await GetTokenFromCode(code);
            if (tokenResponse == null)
            {
                return null;
            }
            var userCredential = GetUserCredential(tokenResponse);
            if (userCredential == null)
            {
                return null;
            }
            var userInfo = await GetUserInfo(userCredential);
            if (userInfo == null)
            {
                return null;
            }
            return new GoogleAuthInfo
            {
                TokenResponse = tokenResponse,
                UserCredential = userCredential,
                UserInfo = userInfo
            };
        }

        public async Task<GoogleAuthInfo?> AuthUserFromRefreshToken(string refreshToken)
        {
            var tokenResponse = await GetTokenFromRefreshToken(refreshToken);
            if (tokenResponse == null)
            {
                return null;
            }
            var userCredential = GetUserCredential(tokenResponse);
            if (userCredential == null)
            {
                return null;
            }
            var userInfo = await GetUserInfo(userCredential);
            if (userInfo == null)
            {
                return null;
            }
            return new GoogleAuthInfo
            {
                TokenResponse = tokenResponse,
                UserCredential = userCredential,
                UserInfo = userInfo
            };
        }

    }


    public class GoogleAuthInfo
    {

        public TokenResponse? TokenResponse { get; set; }

        public UserCredential? UserCredential { get; set; }

        public Userinfo? UserInfo { get; set; }
    }

}
