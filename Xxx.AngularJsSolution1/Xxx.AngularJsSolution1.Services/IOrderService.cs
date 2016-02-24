using Xxx.AngularJsSolution1.Objects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xxx.AngularJsSolution1.Services
{
    public interface IOrderService
    {
        IQueryable<Order> GetActiveOrders();
        Task<int> CreateOrder(Order order);
    }
}
