using Xxx.AngularJsSolution1.Objects.Entities;
using Xxx.AngularJsSolution1.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xxx.AngularJsSolution1.Services
{
    public class OrderService : IOrderService
    {
        #region Private Fields
        /// <summary>
        /// The repository
        /// </summary>
        private readonly IOrderRepository repository;
        #endregion

        #region Ctors
        /// <summary>
        /// Initializes a new instance of the <see cref="OrderService"/> class.
        /// </summary>
        /// <param name="repository">The repository.</param>
        public OrderService(IOrderRepository repository)
        {
            this.repository = repository;
        }
        #endregion

        #region IOrderRepository Members
        /// <summary>
        /// Gets the active orders.
        /// </summary>
        /// <returns></returns>
        public IQueryable<Order> GetActiveOrders()
        {
            return repository.GetActiveOrders();
        }

        /// <summary>
        /// Creates the order.
        /// </summary>
        /// <param name="order">The order.</param>
        /// <returns></returns>
        public async Task<int> CreateOrder(Order order)
        {
            return await repository.CreateOrderAsync(order);
        }

        #endregion
    }
}
