using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NextAdmin.Core.API.Services
{
    public class AuthTokenSerializer : ITokenSerializer
    {

        public string PrivateKey { get; set; }

        public AuthTokenSerializer(string? privateKey = null)
        {
            PrivateKey = privateKey ?? NextAdminHelper.AuthTokenPrivateKey;
            if (PrivateKey == null)
            {
                throw new Exception("Not private key");
            }
        }

        /// <summary>
        /// Generate JWT string
        /// </summary>
        /// <param name="privateKey">The private key used to sign the token</param>
        /// <param name="audience">User type, ex : NextAdminUser</param>
        /// <param name="expirationDate"></param>
        /// <param name="issuer">The owner of the token, if null : NextApp.AppName</param>
        /// <param name="claims">Additional key value/value data</param>
        /// <returns></returns>
        public string CreateTokenString(string audience, DateTime? expirationDate, string? issuer = null, IEnumerable<Claim>? claims = null)
        {
            if (issuer == null)
            {
                issuer = NextAdminHelper.AppName;
            }
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(PrivateKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(issuer, audience, claims, expires: expirationDate, signingCredentials: credentials);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }


        public JwtSecurityToken ParseTokenString(string token)
        {
            return new JwtSecurityToken(token);
        }

        /// <summary>
        /// Validate token string, if is not valid return null
        /// </summary>
        /// <param name="token"></param>
        /// <param name="privateKey"></param>
        /// <param name="audience"></param>
        /// <param name="issuer"></param>
        /// <returns></returns>
        public JwtSecurityToken? ValidateAndParseTokenString(string token, string? audience = null, string? issuer = null, bool validateLifeTime = true)
        {
            if (ValidateTokenString(token, audience, issuer, validateLifeTime) != null)
            {
                return new JwtSecurityToken(token);
            }
            return null;
        }

        public bool CheckTokenStringValidity(string token, string? audience = null, string? issuer = null, bool validateLifeTime = true)
        {
            return ValidateTokenString(token, audience, issuer, validateLifeTime) != null;
        }


        public SecurityToken? ValidateTokenString(string token, string? audience = null, string? issuer = null, bool validateLifeTime = true)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var validationParameters = new TokenValidationParameters()
            {
                ValidateLifetime = validateLifeTime,
                ValidateAudience = audience != null,
                ValidateIssuer = issuer != null,
                ValidIssuer = issuer,
                ValidAudience = audience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(PrivateKey)) // The same key as the one that generate the token
            };

            SecurityToken validatedToken;
            try
            {
                tokenHandler.ValidateToken(token, validationParameters, out validatedToken);
                return validatedToken;
            }
            catch
            {

            }
            return null;
        }

        AuthToken ITokenSerializer.ParseTokenString(string token)
        {
            return ParseTokenString(token).ToAuthToken();
        }

        AuthToken? ITokenSerializer.ValidateAndParseTokenString(string token, string audience, string issuer, bool validateLifeTime)
        {
            var jwtToken = ValidateAndParseTokenString(token, audience, issuer, validateLifeTime);
            if (jwtToken == null)
            {
                return null;
            }
            return jwtToken.ToAuthToken();
        }
    }

    public static class JwtSecurityTokenExtension
    {
        public static AuthToken ToAuthToken(this JwtSecurityToken jwtToken)
        {
            return new AuthToken
            {
                Issuer = jwtToken.Issuer,
                Audience = jwtToken.Audiences.FirstOrDefault(),
                Claims = jwtToken.Claims.ToList(),
                CreationDate = jwtToken.IssuedAt,
                ExpirationDate = jwtToken.ValidTo
            };
        }

    }

}
