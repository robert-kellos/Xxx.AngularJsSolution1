using Xxx.AngularJsSolution1.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;
using System.Web.Http.Routing;
using System.Web.Http.Validation;

namespace Xxx.AngularJsSolution1.WebApi
{
    /// <summary>
    /// 
    /// </summary>
    public class WebApiConfig
    {
        private static readonly log4net.ILog Log = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);
        /// <summary>
        /// Registers the specified configuration.
        /// </summary>
        /// <param name="config">The configuration.</param>
        public static void Register(HttpConfiguration config)
        {
            Log.LogMessage("App Init Started");
            config.Formatters.Remove(config.Formatters.JsonFormatter);
            config.Formatters.Add(new CustomJsonFormatter());
            config.MapHttpAttributeRoutes(new CustomDirectRouteProvider());
            Log.LogMessage("App Init Completed");
        }

        /// <summary>
        /// 
        /// </summary>
        /// <seealso cref="System.Web.Http.Routing.DefaultDirectRouteProvider" />
        public class CustomDirectRouteProvider : DefaultDirectRouteProvider
        {
            /// <summary>
            /// Gets the controller route factories.
            /// </summary>
            /// <param name="controllerDescriptor">The controller descriptor.</param>
            /// <returns></returns>
            protected override IReadOnlyList<IDirectRouteFactory> GetControllerRouteFactories(HttpControllerDescriptor controllerDescriptor)
            {
                return controllerDescriptor.GetCustomAttributes<IDirectRouteFactory>(inherit: true);
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <seealso cref="System.Net.Http.Formatting.JsonMediaTypeFormatter" />
        public class CustomJsonFormatter : JsonMediaTypeFormatter
        {
            /// <summary>
            /// Initializes a new instance of the <see cref="CustomJsonFormatter"/> class.
            /// </summary>
            public CustomJsonFormatter()
            {
                this.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/html"));
                this.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                this.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            }

            // In place so response is of type "application/json" for JSON Browser extensions
            // See http://stackoverflow.com/questions/9847564/how-do-i-get-asp-net-web-api-to-return-json-instead-of-xml-using-chrome/20556625#20556625
            public override void SetDefaultContentHeaders(Type type, HttpContentHeaders headers,
                MediaTypeHeaderValue mediaType)
            {
                base.SetDefaultContentHeaders(type, headers, mediaType);
                headers.ContentType = new MediaTypeHeaderValue("application/json");
            }
        }

    }
}