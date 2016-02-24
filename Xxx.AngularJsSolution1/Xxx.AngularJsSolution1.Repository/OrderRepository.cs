using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xxx.AngularJsSolution1.Objects.Entities;
using Repository.Pattern.UnitOfWork;

namespace Xxx.AngularJsSolution1.Repository
{
    public class OrderRepository : DefaultRepository, IOrderRepository
    {
        public OrderRepository(IUnitOfWorkAsync unitOfWorkAsync) : base(unitOfWorkAsync) { }
        public IQueryable<Order> GetActiveOrders()
        {
            return UnitOfWorkAsync.RepositoryAsync<Order>().Queryable().OrderByDescending(o => o.Id);
        }

        public async Task<int> CreateOrderAsync(Order order)
        {
            int result;
            UnitOfWorkAsync.BeginTransaction();
            try
            {
                UnitOfWorkAsync.RepositoryAsync<Order>().Insert(order);
                result = await UnitOfWorkAsync.SaveChangesAsync();
                // Commit Transaction
                UnitOfWorkAsync.Commit();
            }
            catch (Exception)
            {
                UnitOfWorkAsync.Rollback();
                throw;
            }
            return result;
        }

    }
    
    //public class OrderRepository : DefaultRepository, IOrderRepository
    //{
    //    public OrderRepository(IUnitOfWorkAsync unitOfWorkAsync) : base(unitOfWorkAsync) { }
    //    public IQueryable<Order> GetActiveOrders()
    //    {
    //        return UnitOfWorkAsync.RepositoryAsync<Order>().Queryable().OrderByDescending(o => o.Id);
    //    }

    //    public async Task<int> CreateOrderAsync(Order order)
    //    {
    //        int result;
    //        UnitOfWorkAsync.BeginTransaction();
    //        try
    //        {
    //            UnitOfWorkAsync.RepositoryAsync<Order>().Insert(order);
    //            result = await UnitOfWorkAsync.SaveChangesAsync();
    //            // Commit Transaction
    //            UnitOfWorkAsync.Commit();
    //        }
    //        catch (Exception)
    //        {
    //            UnitOfWorkAsync.Rollback();
    //            throw;
    //        }
    //        return result;
    //    }

    //}
}
