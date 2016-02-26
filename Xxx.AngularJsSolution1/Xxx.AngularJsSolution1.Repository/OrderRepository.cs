using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xxx.AngularJsSolution1.Objects.Entities;
using Repository.Pattern.UnitOfWork;
using System.Threading;
using System.Diagnostics;
using Xxx.AngularJsSolution1.Logging;

namespace Xxx.AngularJsSolution1.Repository
{
    public class OrderRepository : DefaultRepository, IOrderRepository
    {
        public OrderRepository(IUnitOfWorkAsync unitOfWorkAsync) : base(unitOfWorkAsync) { }
        public IQueryable<Order> GetActiveOrders()
        {
            var result = UnitOfWorkAsync.RepositoryAsync<Order>().Queryable().OrderByDescending(o => o.Id);
            LoggingInterceptor.Log.Debug($"[GetActiveOrders] called, count: {result.Count()}");

            return result;
        }

        public async Task<int> CreateOrderAsync(Order order)
        {
            int result;
            UnitOfWorkAsync.BeginTransaction();
            try
            {
                UnitOfWorkAsync.RepositoryAsync<Order>().Insert(order);

                var identityName = Thread.CurrentPrincipal.Identity.Name;

                if (string.IsNullOrWhiteSpace(identityName))
                    order.CreatedBy = identityName;

                order.CreatedDate = DateTime.Now;

                result = await UnitOfWorkAsync.SaveChangesAsync().ConfigureAwait(true);
                // Commit Transaction
                UnitOfWorkAsync.Commit();
            }
            catch (Exception ex)
            {
                LoggingInterceptor.Log.Debug(ex);
                UnitOfWorkAsync.Rollback();
                throw;
            }
            return result;
        }

        public async Task<int> UpdateOrder(Order order)
        {
            int result;
            UnitOfWorkAsync.BeginTransaction();
            try
            {
                UnitOfWorkAsync.RepositoryAsync<Order>().Update(order);

                var identityName = Thread.CurrentPrincipal.Identity.Name;

                if (string.IsNullOrWhiteSpace(identityName))
                    order.UpdatedBy = identityName;

                result = await UnitOfWorkAsync.SaveChangesAsync().ConfigureAwait(true);
                // Commit Transaction
                UnitOfWorkAsync.Commit();
            }
            catch (Exception ex)
            {
                LoggingInterceptor.Log.Debug(ex);
                UnitOfWorkAsync.Rollback();
                throw;
            }
            return result;
        }

        public async Task<int> DeleteOrder(int id)
        {
            int result;
            UnitOfWorkAsync.BeginTransaction();
            try
            {
                await UnitOfWorkAsync.RepositoryAsync<Order>().DeleteAsync(id);

                result = await UnitOfWorkAsync.SaveChangesAsync().ConfigureAwait(true);
                // Commit Transaction
                UnitOfWorkAsync.Commit();
            }
            catch (Exception ex)
            {
                LoggingInterceptor.Log.Debug(ex);
                UnitOfWorkAsync.Rollback();
                throw;
            }
            return result;
        }
    }
}
