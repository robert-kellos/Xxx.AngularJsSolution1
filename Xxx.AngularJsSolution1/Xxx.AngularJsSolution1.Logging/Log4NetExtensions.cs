using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xxx.AngularJsSolution1.Logging
{
    public static class Log4NetExtensions
    {
        public static void LogMessage(this ILog log, string message, LogLevelEnum logLevel = LogLevelEnum.Debug)
        {
            string formattedMessage = string.Format("{0} - {1}", DateTime.Now, message);
            try
            {
                switch (logLevel)
                {
                    case LogLevelEnum.Fatal:
                        Fatal(log, formattedMessage);
                        break;
                    case LogLevelEnum.Error:
                        Error(log, formattedMessage);
                        break;
                    case LogLevelEnum.Warning:
                        Warn(log, formattedMessage);
                        break;
                    case LogLevelEnum.Info:
                        Info(log, formattedMessage);
                        break;
                    default:
                        Debug(log, formattedMessage);
                        break;
                }
            }
            catch (Exception ex)
            {
                // need to look further into best practices for this
                // perhaps should be logging these errors elsewhere
                Error(log, ex.Message);
                throw;
            }
        }

        #region Helper Methods
        /// <summary>
        /// Debugs the specified message.
        /// </summary>
        /// <param name="message">The message.</param>
        private static void Debug(ILog log, string message)
        {
            log.Debug(message);
        }

        /// <summary>
        /// Warns the specified message.
        /// </summary>
        /// <param name="message">The message.</param>
        private static void Warn(ILog log, string message)
        {
            log.Warn(message);
        }
        /// <summary>
        /// Errors the specified message.
        /// </summary>
        /// <param name="message">The message.</param>
        private static void Error(ILog log, string message)
        {
            log.Error(message);
        }

        /// <summary>
        /// Informations the specified message.
        /// </summary>
        /// <param name="message">The message.</param>
        private static void Info(ILog log, string message)
        {
            log.Info(message);
        }

        /// <summary>
        /// Fatals the specified message.
        /// </summary>
        /// <param name="message">The message.</param>
        private static void Fatal(ILog log, string message)
        {
            log.Fatal(message);
        }
        #endregion
    }
}
