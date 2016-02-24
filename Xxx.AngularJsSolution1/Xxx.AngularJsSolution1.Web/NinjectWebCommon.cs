using System;
using System.Web;
using Microsoft.Web.Infrastructure.DynamicModuleHelper;
using Ninject;
using Ninject.Extensions.Interception.Infrastructure.Language;
using Ninject.Web.Common;
using Ninject.Web.WebApi.FilterBindingSyntax;
using System.Web.Http;
using Repository.Pattern.DataContext;
using Repository.Pattern.Ef6;
using System.Configuration;
using Repository.Pattern.UnitOfWork;
using Xxx.AngularJsSolution1.Repository;
using Xxx.AngularJsSolution1.Services;
using Xxx.AngularJsSolution1.Logging;
using Ninject.Web.WebApi.Filter;
using System.Web.Http.Validation;

[assembly: WebActivatorEx.PreApplicationStartMethod(typeof(Xxx.AngularJsSolution1.Web.NinjectWebCommon), "Start")]
[assembly: WebActivatorEx.ApplicationShutdownMethodAttribute(typeof(Xxx.AngularJsSolution1.Web.NinjectWebCommon), "Stop")]

namespace Xxx.AngularJsSolution1.Web
{
    public static class NinjectWebCommon
    {
        private static readonly Bootstrapper bootstrapper = new Bootstrapper();

        /// <summary>
        /// Starts the application
        /// </summary>
        public static void Start()
        {
            DynamicModuleUtility.RegisterModule(typeof(OnePerRequestHttpModule));
            DynamicModuleUtility.RegisterModule(typeof(NinjectHttpModule));
            bootstrapper.Initialize(CreateKernel);
        }

        /// <summary>
        /// Stops the application.
        /// </summary>
        public static void Stop()
        {
            bootstrapper.ShutDown();
        }

        /// <summary>
        /// Creates the kernel that will manage your application.
        /// </summary>
        /// <returns>The created kernel.</returns>
        private static IKernel CreateKernel()
        {
            var kernel = new StandardKernel();

            try
            {
                kernel.Bind<Func<IKernel>>().ToMethod(ctx => () => new Bootstrapper().Kernel);
                kernel.Bind<IHttpModule>().To<HttpApplicationInitializationHttpModule>();
                RegisterServices(kernel);
                //GlobalConfiguration.Configuration.DependencyResolver = new NinjectDependencyResolver(kernel);
                return kernel;
            }
            catch
            {
                kernel.Dispose();
                throw;
            }
        }

        /// <summary>
        /// Load your modules or register your services here!
        /// </summary>
        /// <param name="kernel">The kernel.</param>
        private static void RegisterServices(IKernel kernel)
        {
            //<!-- Context and Uow bindings-->
            kernel.Bind<IDataContextAsync>()
                .To<DataContext>()
                .InSingletonScope()
                .WithConstructorArgument("nameOrConnectionString",
                    context => ConfigurationManager.ConnectionStrings["SimpleOrderEntryContext"].ConnectionString);

            kernel.Bind<IUnitOfWorkAsync>().To<UnitOfWork>().InRequestScope().Intercept().With<LoggingInterceptor>();
            
            //kernel.Bind<DefaultModelValidatorProviders>().ToConstant(new DefaultModelValidatorProviders(config.Services.GetServices(typeof(ModelValidatorProvider)).Cast<ModelValidatorProvider>()));

            // <!-- Repository bindings-->
            kernel.Bind<IDefaultRepository>().To<DefaultRepository>().InRequestScope().Intercept().With<LoggingInterceptor>();
            kernel.Bind<IOrderRepository>().To<OrderRepository>().InRequestScope().Intercept().With<LoggingInterceptor>();
            
            // <!-- Service bindings-->
            kernel.Bind<IOrderService>().To<OrderService>().InRequestScope().Intercept().With<LoggingInterceptor>();
            
            //kernel.Bind<AuthContext>().To<AuthContext>().InRequestScope();
            //kernel.Bind<IAuthRepository>().To<AuthRepository>().InRequestScope();
        }
    }
}
