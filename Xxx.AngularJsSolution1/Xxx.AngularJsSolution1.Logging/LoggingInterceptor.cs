using log4net;
using log4net.Config;
using Ninject.Extensions.Interception;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xxx.AngularJsSolution1.Logging
{
    public class LoggingInterceptor : IInterceptor
    {
        /// <summary>
        /// The _log
        /// </summary>
        private static ILog _log;

        /// <summary>
        ///     Gets the log.
        /// </summary>
        /// <value>
        ///     The log.
        /// </value>
        public static ILog Log
        {
            get
            {
                if (_log != null) return _log;

                XmlConfigurator.Configure();
                _log = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

                return _log;
            }
        }

        public void Intercept(IInvocation invocation)
        {
            try
            {
                var timer = new Stopwatch();
                timer.Start();
                string methodName = string.Format("{0}.{1}", invocation.Request.Target.GetType().Name, invocation.Request.Method.Name);
                string[] parameterNames = invocation.Request.Method.GetParameters().Select(x => x.Name).ToArray();
                object[] parameterValues = invocation.Request.Arguments;

                string message =
                    string.Format("{0} called with Parameter{1} {2}", methodName,
                    (parameterNames.Length == 1 ? string.Empty : "s"), parameterNames.Length);

                for (var index = 0; index < parameterNames.Length; index++)
                {
                    string name = parameterNames[index];
                    object value = parameterValues[index];
                    message += string.Format("\r\n\t Name: {0} Value: {1}....", name, value);

                }

                Log.Debug(message);
                invocation.Proceed();
                timer.Stop();
                Log.Debug(string.Format(" <<- {0} exited with elapsed time of : {1}", methodName, timer.Elapsed));

            }
            catch (Exception e)
            {
                Log.Error(e.Message);
                throw;
            }
        }
    }
}
