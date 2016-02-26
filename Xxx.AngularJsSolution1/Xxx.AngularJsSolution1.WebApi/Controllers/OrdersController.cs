using Xxx.AngularJsSolution1.Objects.Entities;
using Xxx.AngularJsSolution1.Services;
using System.Linq;
using System.Linq.Dynamic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Xxx.AngularJsSolution1.WebApi.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    /// <seealso cref="System.Web.Http.ApiController" />
    [RoutePrefix("api/orders")]
    public class OrdersController : BaseApiController
    {
        #region Private Readonly Fields
        /// <summary>
        /// The service
        /// </summary>
        private readonly IOrderService service;
        #endregion

        #region Ctors
        /// <summary>
        /// Initializes a new instance of the <see cref="OrdersController"/> class.
        /// </summary>
        /// <param name="service">The service.</param>
        public OrdersController(IOrderService service)
        {
            this.service = service;
        }
        #endregion

        #region Public Methods

        [Route("nextOrderSet", Name = "NextOrderRoute")]
        [HttpPost]
        public IHttpActionResult AddNextTestOrderSet()
        {
            CreateOrders();

            return Ok();
        }

        [Route("newOrder", Name = "NewOrderRoute")]
        [HttpPost]
        public IHttpActionResult NewOrderRoute(Order order)
        {
            service.CreateOrder(order);

            return Ok(order);
        }

        [Route("updateOrder", Name = "UpdateOrderRoute")]
        [HttpPut]
        public IHttpActionResult UpdateOrder(Order order)
        {
            service.UpdateOrder(order);

            return Ok(order);
        }

        [Route("deleteOrder", Name = "DeleteOrderRoute")]
        [HttpDelete]
        public IHttpActionResult DeleteOrder(int id)
        {
            service.DeleteOrder(id);

            return Ok();
        }

        /// <summary>
        /// Gets the active orders.
        /// </summary>
        /// <param name="page">The page.</param>
        /// <param name="pageSize">Size of the page.</param>
        /// <param name="sortBy">The sort by.</param>
        /// <param name="reverse">if set to <c>true</c> [reverse].</param>
        /// <returns></returns>
        [Route("activeOrders", Name = "OrdersRoute")]
        public IHttpActionResult GetActiveOrders(int page = 0, int pageSize = 10, string sortBy = "ID", bool reverse = false)
        {
            IQueryable<Order> query = service.GetActiveOrders();
            if (query == null)
                return ResponseMessage(Request.CreateResponse(HttpStatusCode.NoContent));

            AppendPaginationDataToHeader(query, page, pageSize);

            return Ok(GetRequestedPage(query, page, pageSize, sortBy, reverse));
        }

        private async void CreateOrders()
        {
            string baseXml = "<order><id>{0}</id><vendor>{1}</vendor><value>{2}</value></order>";
            int baseOrderValue = 21399;
            for (int i = 1000; i <= 1100; i++)
            {
                string orderXml = string.Format(baseXml, i.ToString(), "KYW-TV", (i + baseOrderValue));
                Order order = new Order() { OrderData = orderXml, Version = 1 };
                
                await service.CreateOrder(order).ConfigureAwait(true);
            }
        }

        #endregion
    }
}