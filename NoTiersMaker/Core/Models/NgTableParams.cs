using System.Text.RegularExpressions;

namespace CustomLogic.Core.Models
{
    /// <summary>
    /// Made from the json from angular table directive 
    /// </summary>
    public class NgTableParams //NgTableParams
    {
        public NgTableParams()
        {
            count = 10; // give the top 10 by default
        }

        public int page { get; set; }
        public int count { get; set; }
        public int total { get; set; }
        public object filter { get; set; }
        public object sorting { get; set; }
        public Group group { get; set; }
        public object groupBy { get; set; }
    }
}