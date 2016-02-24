using Repository.Pattern.UnitOfWork;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Xxx.AngularJsSolution1.Repository
{
    public interface IDefaultRepository
    {
        IUnitOfWorkAsync UnitOfWorkAsync { get; }
    }
    //public interface IDefaultRepository
    //{
    //    IUnitOfWorkAsync UnitOfWorkAsync { get; }
    //}
}
