using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SpringXBuilder.MVC.Startup))]
namespace SpringXBuilder.MVC
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
