﻿using System.Web.Http;

namespace SpringXBuilder.MVC
{
    public class WebApiConfig
    {
        public static void Register(HttpConfiguration configuration)
        {
            configuration.Routes.MapHttpRoute("API Default", "api/{controller}/{id}",
                new { id = RouteParameter.Optional },null);
        }
    }
}