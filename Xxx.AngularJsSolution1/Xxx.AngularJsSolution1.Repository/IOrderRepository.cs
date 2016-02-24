using Xxx.AngularJsSolution1.Objects.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xxx.AngularJsSolution1.Repository
{
    public interface IOrderRepository
    {
        IQueryable<Order> GetActiveOrders();
        Task<int> CreateOrderAsync(Order order);
    }

    //public interface IOrderRepository
    //{
    //    IQueryable<Order> GetActiveOrders();
    //    Task<int> CreateOrderAsync(Order order);
    //}
}
