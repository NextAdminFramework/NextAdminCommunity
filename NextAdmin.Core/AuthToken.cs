using System;
using System.Collections.Generic;
using System.Security.Claims;

namespace NextAdmin.Core
{
    public class AuthToken
    {
        public string Issuer { get; set; }

        public string Audience { get; set; }

        public List<Claim> Claims { get; set; }

        public DateTime CreationDate { get; set; }

        public DateTime? ExpirationDate { get; set; }

    }

    public interface ITokenSerializer
    {
        string CreateTokenString(string audience, DateTime? expirationDate, string issuer = null, IEnumerable<Claim> claims = null);

        AuthToken ParseTokenString(string token);

        AuthToken ValidateAndParseTokenString(string token, string audience = null, string issuer = null, bool validateLifeTime = true);

        bool CheckTokenStringValidity(string token, string audience = null, string issuer = null, bool validateLifeTime = true);

    }


}
