using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(AzureSSS.Startup))]

namespace AzureSSS
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            //added comment to test azure devops rebuild
            ConfigureAuth(app);
        }
    }
}
