﻿using System;
using Repository.Pattern.Infrastructure;

namespace Repository.Pattern.DataContext
{
    public interface IDataContext : IDisposable
    {
        int SaveChanges();
        //void SyncObjectState<TEntity>(TEntity entity) where TEntity : class, IEntity<long>;
        //void SyncObjectsStatePostCommit();
    }
}