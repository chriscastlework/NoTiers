using System.ComponentModel.DataAnnotations;

namespace CustomLogic.MVC.Models
{
    /// <summary>
    /// This is the input from the used to connect to thier server
    /// </summary>
    public class ServerModel
    {
        [Required]
        public string Database { get; set; }
        [Required]
        public string Server { get; set; }

        [Display(Name = "Required tables")]
        public string RequiredList { get; set; }
        [Display(Name = "Use windows authentication")]
        public bool WindowsAuthentication { get; set; }
        [Display(Name = "User Name")]
        public string UserName { get; set; }
        public string Password { get; set; }



    }

    public class Alert
    {
        public const string TempDataKey = "TempDataAlerts";

        public string AlertStyle { get; set; }
        public string Message { get; set; }
        public bool Dismissable { get; set; }
    }

    public static class AlertStyles
    {
        public const string Success = "success";
        public const string Information = "info";
        public const string Warning = "warning";
        public const string Danger = "danger";
    }
}