using System;
using System.Data.Entity.Design.PluralizationServices;
using System.Globalization;
using System.Linq;

namespace CustomLogic.StringHelpers
{
    public static class CastlesStringHelpers
    {
        public static string FirstCharToUpper(this string input)
        {
            if (String.IsNullOrEmpty(input))
                throw new ArgumentException("ARGH!");
            return input.First().ToString().ToUpper() + String.Join("", input.Skip(1));
        }
        
        public static string Pluralize(this string str, bool pluralise = true)
        {
            PluralizationService pluralizationService = PluralizationService.CreateService(new CultureInfo("en"));
            if (pluralise)
            {
                return pluralizationService.Pluralize(str);
            }
            else
            {
                return pluralizationService.Singularize(str);
            }
          
        }
    }
}
