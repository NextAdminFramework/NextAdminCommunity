using System.Text;

namespace NextAdmin.Core
{
    public static class StringExtension
    {

        public static string Nl2br(this string str)
        {
            return str.Replace("\r\n", "<br />").Replace("\n", "<br />");
        }


        public static string ReplaceFirst(this string str, string search, string replace)
        {
            int pos = str.IndexOf(search);
            if (pos < 0)
            {
                return str;
            }
            return str.Substring(0, pos) + replace + str.Substring(pos + search.Length);
        }


        public static List<string> SplitWithDelimiters(this string str, params char[] delimiters)
        {
            string currentPart = "";
            List<string> parts = new List<string>();
            foreach (char c in str)
            {
                if (delimiters.Contains(c))
                {
                    if (currentPart != string.Empty)
                    {
                        parts.Add(currentPart);
                        currentPart = "";
                    }
                    parts.Add(c.ToString());
                }
                else
                {
                    currentPart += c;
                }
            }
            if (currentPart != string.Empty)
            {
                parts.Add(currentPart);
            }
            return parts;
        }


        public static string FirstCharToLower(this string str)
        {
            return Char.ToLower(str[0]) + str.Substring(1);
        }

        public static string FirstCharToUpper(this string str)
        {
            return Char.ToUpper(str[0]) + str.Substring(1);
        }

        public static string ToNumericString(this string str, params char[] allowedChars)
        {
            return new string(str.Where(c => char.IsDigit(c) || allowedChars.Contains(c)).ToArray());
        }

        public static string ToAlphaString(this string str, params char[] allowedChars)
        {
            return new string(str.Where(c => char.IsLetter(c) || allowedChars.Contains(c)).ToArray());
        }

        public static string ToAlphaNumercicString(this string str, params char[] allowedChars)
        {
            return new string(str.Where(c => char.IsLetterOrDigit(c) || allowedChars.Contains(c)).ToArray());
        }

        public static string RemoveDiacritics(this string str, params char[] allowedChars)
        {
            return string.Concat(
                str.Normalize(NormalizationForm.FormD)
                 .Where(c => System.Globalization.CharUnicodeInfo.GetUnicodeCategory(c) !=
                             System.Globalization.UnicodeCategory.NonSpacingMark)).ToAlphaNumercicString(allowedChars);
        }


        public static List<string> ExtractTags(this string str, string startTag, string endTag)
        {
            var results = new List<string>();
            if (str == null)
                return results;

            while (true)
            {
                var indexOfStart = str.IndexOf(startTag);
                if (indexOfStart == -1)
                    break;
                str = str.Substring(indexOfStart + startTag.Length);
                var indexOfEnd = str.IndexOf(endTag);
                if (indexOfEnd == -1)
                    break;
                var subStr = str.Substring(0, indexOfEnd);
                results.Add(subStr);
                str = str.Substring(indexOfEnd + endTag.Length);
            }
            return results;
        }

        public static string RemoveTags(this string str, string startDelimiter, string endDelimiter)
        {
            var outputStr = "";
            if (startDelimiter == endDelimiter)
            {
                var b = true;
                foreach (var subStr in str.Split(startDelimiter))
                {
                    if (b)
                    {
                        outputStr += subStr;
                    }
                    b = !b;
                }
            }
            else
            {
                foreach (var subStr in str.Split(startDelimiter))
                {
                    var stopIndex = subStr.IndexOf(endDelimiter);
                    string newStr = subStr;
                    if (stopIndex != -1)
                    {
                        newStr = subStr.Substring(stopIndex + endDelimiter.Length);
                    }
                    outputStr += newStr;
                }
            }
            return outputStr;
        }


        public static string CamelCaseToSpaces(this string str)
        {
            string output = "";
            foreach (char character in (str ?? "").FirstCharToLower())
            {
                string strChar = character + "";
                if (character == strChar.FirstCharToUpper()[0])
                {
                    output += " " + strChar.FirstCharToLower();
                }
                else
                {
                    output += strChar;
                }
            }
            return output.FirstCharToUpper();
        }



    }
}
